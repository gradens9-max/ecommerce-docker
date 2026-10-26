# ---------- Etapa 1: Composer (solo para instalar dependencias) ----------
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY . .
RUN composer dump-autoload --no-dev --optimize

# ---------- Etapa 2: imagen final (PHP-FPM ligero) ----------
FROM php:8.4-fpm-alpine AS runtime
WORKDIR /var/www/html

# pdo_mysql hay que instalarlo; el resto de extensiones ya vienen en la imagen oficial
RUN docker-php-ext-install pdo_mysql \
 && php -r 'foreach (["pdo_mysql","mbstring","openssl","tokenizer","xml","ctype","json"] as $e) { if (!extension_loaded($e)) { fwrite(STDERR, "Falta extension $e\n"); exit(1); } }'

# Solo vendor/ viene de la etapa de build; el código viene del contexto
COPY --from=vendor /app/vendor ./vendor
COPY . .

RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

USER www-data
EXPOSE 9000
CMD ["sh", "-c", "php artisan migrate --force && exec php-fpm"]