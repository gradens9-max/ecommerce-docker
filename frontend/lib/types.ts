export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string | number;
  stock: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  price: string | number;
  product?: Product;
};

export type Order = {
  id: number;
  total: string | number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};