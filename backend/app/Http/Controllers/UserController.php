<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function register(Request $request){
    try{
    $user = $request->validate([
        'name' => 'required|string|max:100|min:5',
        'email' => 'required|string|email|max:200|unique:users',
        'password' => [
            'required',
            'string',
            Password::min(8)
            ->mixedCase()
            ->numbers()
            ->symbols()
        ]
    ]);

    $newUser = User::create([
        'name' => $user['name'],
        'email' => $user['email'],
        'password' => Hash::make($user['password'])
    ]);

    return response()->json([
        'message' => 'User Created',
        'user' => $newUser
    ],201);
    } catch(\Exception $error){
        return response()->json([
            'message' => $error->getMessage()
        ]);
    }
}

    public function login(Request $request)
{
    try{
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User logged successfully',
            'user' => $user,
            'token' => $token,
            'type_token' => 'Bearer'
        ]);

    } catch(\Exception $error){
        return response()->json([
            'message' => $error->getMessage()
        ]);
    }
}
}