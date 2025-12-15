

export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  category: {
    id: number;
    name: string;
    parent?: string;
  };
  categoryType: string;
  quantity: number;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  tags: string[];
  supplier: {
    name: string;
    email: string;
    phone: string;
  };
  subTable: Array<{
    subId: number;
    description: string;
    amount: number;
    status: string;
    history: Array<{
      changedAt: Date;
      oldValue: string;
      newValue: string;
    }>;
  }>;
}