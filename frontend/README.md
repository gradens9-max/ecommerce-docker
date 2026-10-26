# Ecommerce Frontend

Frontend de e-commerce en Next.js (App Router) + TypeScript que consume una API REST en Laravel.

## Requisitos
- Node.js 20+
- La API de e-commerce corriendo (por defecto en `http://localhost:8000/api`)

## Configuración
1. Copia `.env.example` a `.env.local`.
2. Ajusta `BASE_URL` si tu API usa otra dirección:

   BASE_URL=http://localhost:8000/api

## Cómo ejecutar
    npm install
    npm run dev

Para producción (y para medir Lighthouse):

    npm run build
    npm start

## Rutas implementadas
| Ruta | Descripción |
|---|---|
| `/` | Catálogo público (Server Component) |
| `/products/[id]` | Detalle del producto con metadata SEO |
| `/register` | Registro (Server Action) |
| `/login` | Login (Server Action, token en cookie httpOnly) |
| `/cart` | Carrito en estado local con persistencia y creación de orden |
| `/orders` | Historial de compras (ruta protegida) |

## Decisiones técnicas
- Las lecturas se hacen en el servidor con Server Components.
- Login, registro, logout y creación de órdenes usan Server Actions.
- El token se guarda en una cookie `httpOnly`, nunca en localStorage.
- Tras crear una orden se usa `revalidatePath`.
- Hay `loading.tsx` y `error.tsx` con botón de reintentar, y `Suspense` en el catálogo y el historial.

## Pago con Stripe
La API entregada no tiene implementado el endpoint de pago, por lo que esta parte no está incluida.

## Capturas
Están en la carpeta `docs/`: Lighthouse, flujo de compra y endpoints consumidos.