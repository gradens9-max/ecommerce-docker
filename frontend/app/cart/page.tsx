"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createOrderAction } from "@/actions/orders";

export default function CartPage() {
  const { items, remove, clear, total } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const checkout = () => {
    setError(null);
    startTransition(async () => {
      const result = await createOrderAction(
        items.map((i) => ({ product_id: i.product.id, quantity: i.quantity }))
      );
      if (result?.error) {
        setError(result.error);
        return;
      }
      clear();
      router.push("/orders");
    });
  };

  if (items.length === 0) {
    return (
      <p>
        Tu carrito está vacío.{" "}
        <Link href="/" className="text-blue-500 underline">
          Ver catálogo
        </Link>
      </p>
    );
  }

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Carrito</h1>
      <ul className="flex flex-col gap-2">
        {items.map((i) => (
          <li
            key={i.product.id}
            className="flex items-center justify-between rounded border p-3"
          >
            <span>
              {i.product.name} x {i.quantity}
            </span>
            <span className="flex items-center gap-4">
              ${(Number(i.product.price) * i.quantity).toFixed(2)}
              <button
                onClick={() => remove(i.product.id)}
                className="text-red-500"
              >
                Quitar
              </button>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xl font-bold">Total: ${total.toFixed(2)}</p>
      {error && (
        <p role="alert" className="mt-2 text-red-600">
          {error}
        </p>
      )}
      <button
        onClick={checkout}
        disabled={pending}
        className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Creando orden..." : "Crear orden"}
      </button>
    </section>
  );
}