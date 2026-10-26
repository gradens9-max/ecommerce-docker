import { getOrders } from "@/lib/api";

export default async function OrderList() {
  const orders = await getOrders();

  if (orders.length === 0) return <p>Aún no tienes compras.</p>;

  return (
    <ul className="flex flex-col gap-4">
      {[...orders].reverse().map((o) => (
        <li key={o.id} className="rounded border p-4">
          <div className="flex justify-between font-semibold">
            <span>Orden #{o.id}</span>
            <span>{o.status}</span>
          </div>
          <ul className="mt-2 text-sm">
            {o.items.map((it) => (
              <li key={it.id}>
                {it.product?.name ?? `Producto ${it.product_id}`} x {it.quantity}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-bold">
            Total: ${Number(o.total).toFixed(2)}
          </p>
        </li>
      ))}
    </ul>
  );
}