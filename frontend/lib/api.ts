import { getToken } from "@/lib/session";
import type { Order, Product } from "@/lib/types";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Envelope<T> = { data?: T; message?: string };

async function request<T>(
  path: string,
  init: RequestInit = {},
  auth = false
): Promise<Envelope<T>> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (auth) {
    const token = await getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  let json: Envelope<T> = {};
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    // respuesta sin JSON
  }
  if (!res.ok) {
    throw new ApiError(json.message ?? `Error ${res.status}`, res.status);
  }
  return json;
}

export async function getProducts(): Promise<Product[]> {
  const json = await request<Product[]>("/products", {
    next: { tags: ["products"], revalidate: 60 },
  });
  if (!json.data) {
    throw new Error(json.message ?? "No se pudieron cargar los productos.");
  }
  return json.data;
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const json = await request<Product>(`/products/${id}`, {
      next: { tags: ["products"], revalidate: 60 },
    });
    return json.data ?? null;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function getOrders(): Promise<Order[]> {
  const json = await request<Order[]>("/orders", { cache: "no-store" }, true);
  if (!json.data) {
    throw new Error(json.message ?? "No se pudo cargar el historial.");
  }
  return json.data;
}
export async function createOrder(
  items: { product_id: number; quantity: number }[]
): Promise<Order> {
  const json = await request<Order>(
    "/orders",
    { method: "POST", body: JSON.stringify({ items }), cache: "no-store" },
    true
  );
  if (!json.data) {
    throw new Error(json.message ?? "No se pudo crear la orden.");
  }
  return json.data;
}