# Ecosistema E-commerce con Docker

Entorno de producción contenerizado con tres servicios: frontend **Next.js 16**, API REST **Laravel** y base de datos **MySQL 8**, con builds multi-stage y orquestación mediante Docker Compose.

## Arquitectura

```
Navegador
   │
   ├── :3000 ──► frontend (Next.js) ──► http://nginx/api
   │                                         │
   └── :8000 ───────────────────────────►  nginx ──► backend (PHP-FPM :9000) ──► db (MySQL :3306)
```

Todos los servicios están en la red interna `app-net`. MySQL no se expone al host y guarda sus datos en el volumen `db_data` (`/var/lib/mysql`).

| Servicio | Imagen base | Puerto |
|---|---|---|
| frontend | `node:20-alpine` | 3000 |
| backend | `php:8.4-fpm-alpine` | 9000 (interno) |
| nginx | `nginx:alpine` | 8000 → 80 |
| db | `mysql:8.0` | 3306 (interno) |

## Cómo ejecutarlo

Requisitos: Docker Desktop.

```bash
git clone https://github.com/gradens9-max/ecommerce-docker.git
cd ecommerce-docker
cp .env.example .env
```

Genera una `APP_KEY` y pégala en `.env`:

```bash
docker run --rm php:8.4-cli-alpine php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
```

Levanta todo:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8000/api/products

Para detener: `docker compose down` (el volumen conserva los datos).

## Variables de entorno

Documentadas en `.env.example`: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` y `APP_KEY`. El `docker-compose.yml` no contiene credenciales; las lee de `.env`, que no se sube al repositorio.