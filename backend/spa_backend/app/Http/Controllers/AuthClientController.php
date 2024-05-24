<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthClientController extends Controller
{
    /**
     * Register a new client.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $client = Client::create($request->all());
        
        return response()->json([
            'message' => 'Client registered successfully',
            'client' => $client
        ], 201);
    }


    /**
     * Get a JWT via given credentials for client interface.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if (!$token = Auth::guard('client')->attempt($request->only('email', 'password'))) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid email or password.',
            ], 401);
        }
        $client = Auth::guard('client')->user();


        return $this->responseWithToken($token, $client);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return JsonResponse
     */
    public function logout(): JsonResponse
    {
        Auth::guard('client')->logout();

        return new JsonResponse(['success' => true]);
    }

    /**
     * Respond with token.
     *
     * @param string $token
     * @return JsonResponse
     */
    protected function responseWithToken(string $token, $user): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('client')->factory()->getTTL() * 60,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'address' => $user->address,
                // Add other fields as necessary
            ],
        ]);
    }
}
