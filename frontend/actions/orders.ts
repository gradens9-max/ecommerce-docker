"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createOrder } from "@/lib/api";
import { getToken } from "@/lib/session";

export type OrderState = { error?: string; ok?: boolean } | undefined;

export async function createOrderAction(
  items: { product_id: number; quantity: number }[]
): Promise<OrderState> {
  const token = await getToken();
  if (!token) redirect("/login");

  if (items.length === 0) return { error: "El carrito está vacío." };

  try {
    await createOrder(items);
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "No se pudo crear la orden.",
    };
  }

  revalidatePath("/");
  revalidatePath("/products/[id]", "page");
  revalidatePath("/orders");
  return { ok: true };
}