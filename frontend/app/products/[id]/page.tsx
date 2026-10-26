import type { Metadata } from "next";
import AddToCartButton from "@/components/AddToCartButton";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description ?? `Compra ${product.name}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <article className="max-w-xl">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="mt-2">{product.description}</p>
      <p className="mt-4 text-xl font-bold">
        ${Number(product.price).toFixed(2)}
      </p>
      <p className="text-sm">Stock: {product.stock}</p>
      <AddToCartButton product={product} />
    </article>
  );
}