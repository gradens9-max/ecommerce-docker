import { Suspense } from "react";
import ProductList from "@/components/ProductList";

export default function HomePage() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Catálogo</h1>
      <Suspense fallback={<p>Cargando productos...</p>}>
        <ProductList />
      </Suspense>
    </section>
  );
}