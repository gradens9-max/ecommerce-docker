import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/session";
import OrderList from "@/components/OrderList";

export const metadata = { title: "Mis compras" };

export default async function OrdersPage() {
  const token = await getToken();
  if (!token) redirect("/login");

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Mis compras</h1>
      <Suspense fallback={<p>Cargando historial...</p>}>
        <OrderList />
      </Suspense>
    </section>
  );
}