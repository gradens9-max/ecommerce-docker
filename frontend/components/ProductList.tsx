import Link from "next/link";
import { getProducts } from "@/lib/api";

export default async function ProductList() {
  const products = await getProducts();

  if (products.length === 0) return <p>No hay productos todavía.</p>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.id} className="rounded-lg border p-4">
          <h2 className="font-semibold">{p.name}</h2>
          <p className="line-clamp-2 text-sm opacity-70">{p.description}</p>
          <p className="mt-2 font-bold">${Number(p.price).toFixed(2)}</p>
          <p className="text-xs">Stock: {p.stock}</p>
          <Link
            href={`/products/${p.id}`}
            className="mt-2 inline-block text-blue-500 underline"
          >
            Ver detalle
          </Link>
        </li>
      ))}
    </ul>
  );
}