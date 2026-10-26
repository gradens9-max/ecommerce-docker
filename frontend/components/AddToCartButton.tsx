"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <button
      onClick={() => add(product)}
      disabled={product.stock < 1}
      className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
    >
      {product.stock < 1 ? "Sin stock" : "Agregar al carrito"}
    </button>
  );
}