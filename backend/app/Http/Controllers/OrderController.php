<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     * Historial de compras del usuario logueado.
     */
    public function index(Request $request)
    {
        try{
            $orders = Order::with(['items.product', 'payment'])
                ->where('user_id', $request->user()->id)
                ->get();

            return response()->json([
                'data' => $orders
            ]);
        }catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     * Crea una orden con varios productos.
     */
    public function store(Request $request)
    {
        try{
            $request->validate([
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1'
            ]);

            $total = 0;
            $orderItemsData = [];

            // Recorremos cada producto pedido para calcular el total
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    return response()->json([
                        'message' => "Stock insuficiente para {$product->name}"
                    ], 422);
                }

                $subtotal = $product->price * $item['quantity'];
                $total += $subtotal;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price
                ];

                // Descontamos el stock
                $product->decrement('stock', $item['quantity']);
            }

            // Creamos la orden
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total' => $total,
                'status' => 'pending'
            ]);

            // Creamos cada order_item asociado a la orden
            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            return response()->json([
                'message' => 'Order created successfully',
                'data' => $order->load('items.product')
            ], 201);

        }catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        return response()->json([
            'data' => $order->load('items.product', 'payment')
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Normalmente solo se actualiza el status (pending, paid, shipped, etc.)
     */
    public function update(Request $request, Order $order)
    {
        try{
            $request->validate([
                'status' => 'required|string|in:pending,paid,shipped,cancelled'
            ]);

            $order->update([
                'status' => $request->status
            ]);

            return response()->json([
                'message' => 'Order updated successfully',
                'data' => $order
            ]);

        }catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        try{
            $order->delete();

            return response()->json([
                'message' => 'Order deleted successfully'
            ]);
        }catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
            ]);
        }
    }
}