export type Expense = {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  note: string | null;
  created_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category: string;
  limit_amount: number;
};

export type Insight = {
  id: string;
  user_id: string;
  type: string;
  message: string;
  created_at: string;
};

