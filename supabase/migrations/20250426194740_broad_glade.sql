/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric)
      - `type` (text, either 'income' or 'expense')
      - `category` (text)
      - `description` (text)
      - `date` (date)
      - `recurring` (boolean)
      - `recurring_period` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to:
      - Read their own transactions
      - Insert their own transactions
      - Update their own transactions
*/

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  recurring boolean DEFAULT false,
  recurring_period text CHECK (
    recurring_period IS NULL OR 
    recurring_period IN ('weekly', 'biweekly', 'monthly')
  ),
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_recurring_period CHECK (
    (recurring = false AND recurring_period IS NULL) OR
    (recurring = true AND recurring_period IS NOT NULL)
  )
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);