# API de E-commerce Segura

API REST para un e-commerce básico desarrollada con Laravel 12, con autenticación mediante tokens (Sanctum).

## Instalación

1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd ecommerce-api
```

2. Instalar dependencias
```bash
composer install
```

3. Configurar el entorno
```bash
copy .env.example .env
php artisan key:generate
```

4. Editar `.env` con tus credenciales de MySQL
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_api
DB_USERNAME=root
DB_PASSWORD=
```

5. Ejecutar migraciones y seeders
```bash
php artisan migrate --seed
```

6. Levantar el servidor
```bash
php artisan serve
```

## Autenticación

La API usa Laravel Sanctum. El flujo es:

1. Registrarse en `/api/register`
2. Iniciar sesión en `/api/login` para obtener un token
3. Usar ese token como `Bearer Token` en el header `Authorization` para acceder a rutas protegidas

## Endpoints

### Auth (públicos)

**POST /api/register**
```json
// Request
{
    "name": "Marcos Jardin",
    "email": "correo@ejemplo.com",
    "password": "Pass123word!"
}

// Response 201
{
    "message": "User Created",
    "user": { "id": 1, "name": "Marcos Jardin", "email": "correo@ejemplo.com" }
}
```

**POST /api/login**
```json
// Request
{
    "email": "correo@ejemplo.com",
    "password": "Pass123word!"
}

// Response 200
{
    "message": "User logged successfully",
    "user": { ... },
    "token": "1|xxxxxxxxxxxxxxxxxxxx",
    "type_token": "Bearer"
}
```

### Products

**GET /api/products** — público, lista todos los productos

**GET /api/products/{id}** — público, muestra un producto

**POST /api/products** — requiere token
```json
// Request
{
    "name": "Camisa azul",
    "description": "Camisa de algodón talla M",
    "price": 25.99,
    "stock": 50
}
```

**PUT /api/products/{id}** — requiere token, mismo body que POST

**DELETE /api/products/{id}** — requiere token

### Orders (todos requieren token)

**GET /api/orders** — historial de compras del usuario logueado

**POST /api/orders** — crea una orden con uno o varios productos
```json
// Request
{
    "items": [
        { "product_id": 1, "quantity": 2 },
        { "product_id": 2, "quantity": 1 }
    ]
}

// Response 201
{
    "message": "Order created successfully",
    "data": {
        "user_id": 1,
        "total": 91.97,
        "status": "pending",
        "items": [ ... ]
    }
}
```

**GET /api/orders/{id}** — muestra una orden específica

**PUT /api/orders/{id}** — actualiza el status de una orden
```json
{ "status": "paid" }
```

**DELETE /api/orders/{id}** — elimina una orden

## Manejo de errores

Todos los endpoints usan try/catch y devuelven mensajes de error descriptivos en formato JSON con el código HTTP correspondiente.

## Notas

- La pasarela de pago (Stripe) y la tabla `payments` son opcionales según los requisitos de la tarea y no fueron implementadas en esta entrega.
- La documentación de endpoints se encuentra en este README de forma manual.