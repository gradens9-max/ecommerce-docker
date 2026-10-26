<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $products = Product::all();

            return response()->json([
                'data' => $products
            ]);
        }catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $request->validate([
                'name' => 'required|string|max:150',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0'
            ]);

            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock
            ]);

            return response()->json([
                'message' => 'Product created successfully',
                'data' => $product
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
    public function show(Product $product)
    {
        return response()->json([
            'data' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try{
            $request->validate([
                'name' => 'required|string|max:150',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0'
            ]);

            $product->update($request->all());

            return response()->json([
                'message' => 'Product updated successfully',
                'data' => $product
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
    public function destroy(Product $product)
    {
        try{
            $product->delete();

            return response()->json([
                'message' => 'Product deleted successfully'
            ]);

        }catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
            ]);
        }
    }
}