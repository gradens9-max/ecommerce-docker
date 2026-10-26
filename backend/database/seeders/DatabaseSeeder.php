<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Product::create(['name' => 'Camisa azul', 'description' => 'Camisa de algodón talla M', 'price' => 25.99, 'stock' => 50]);
        Product::create(['name' => 'Pantalón negro', 'description' => 'Pantalón de mezclilla talla 32', 'price' => 39.99, 'stock' => 30]);
        Product::create(['name' => 'Zapatos deportivos', 'description' => 'Talla 42', 'price' => 59.99, 'stock' => 20]);
    }
}
