import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getToken } from "@/lib/session";
import { logoutAction } from "@/actions/auth";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: { default: "Tienda", template: "%s | Tienda" },
  description: "Tienda en línea con Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();

  return (
    <html lang="es">
      <body>
        <CartProvider>
          <nav className="flex items-center gap-4 border-b p-4">
            <Link href="/" className="font-bold">
              Tienda
            </Link>
            <Link href="/cart">Carrito</Link>
            {token ? (
              <>
                <Link href="/orders">Mis compras</Link>
                <form action={logoutAction} className="ml-auto">
                  <button type="submit">Salir</button>
                </form>
              </>
            ) : (
              <Link href="/login" className="ml-auto">
                Entrar
              </Link>
            )}
          </nav>
          <main className="mx-auto max-w-5xl p-4">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}