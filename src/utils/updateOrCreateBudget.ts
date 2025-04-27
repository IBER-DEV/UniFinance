import { supabase } from '../lib/supabase'; // Ajusta la ruta si tu supabase client está en otro lado
import { startOfMonth, endOfMonth } from 'date-fns';

export const updateOrCreateBudget = async (
  amount: number,
  type: 'income' | 'expense',
  dateString: string
) => {
  const date = new Date(dateString);

  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  // Buscar si ya existe un presupuesto para este mes
  const { data: existingBudget, error: fetchError } = await supabase
    .from('budgets')
    .select('*')
    .gte('month', monthStart.toISOString())
    .lte('month', monthEnd.toISOString())
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching budget:', fetchError.message);
    return;
  }

  if (existingBudget) {
    // Si existe, actualizarlo
    const updatedFields =
      type === 'income'
        ? { total_income: existingBudget.total_income + amount }
        : { total_expenses: existingBudget.total_expenses + amount };

    const { error: updateError } = await supabase
      .from('budgets')
      .update(updatedFields)
      .eq('id', existingBudget.id);

    if (updateError) {
      console.error('Error updating budget:', updateError.message);
    }
  } else {
    // Si no existe, crearlo
    const newBudget = {
      month: monthStart.toISOString(),
      total_income: type === 'income' ? amount : 0,
      total_expenses: type === 'expense' ? amount : 0,
      savings_goal: 0, // Puedes ajustar esto si quieres tener un objetivo predeterminado
    };

    const { error: insertError } = await supabase
      .from('budgets')
      .insert([newBudget]);

    if (insertError) {
      console.error('Error creating new budget:', insertError.message);
    }
  }
};
