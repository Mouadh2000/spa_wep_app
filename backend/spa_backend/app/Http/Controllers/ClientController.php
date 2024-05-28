<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;


class ClientController extends Controller
{
    /**
     * Decode JWT token and authenticate user.
     *
     * @param string $token
     * @return \App\Models\User|null
     * 
     */
    private function authenticateUser(Request $request)
    {
        try {
            $decodedToken = JWT::decode($request->bearerToken(), new Key(config('jwt.key'), 'HS256'));
            if (isset($decodedToken)) {
                return true;
            }
        } catch (Exception $e) {
        }

        return null;
    }

    public function index(Request $request)
    {
        $authenticated = $this->authenticateUser($request);
        $user = $request->user();
        $viewClient = $user->view_client_permission;
        if ($authenticated && $viewClient === 1) {
            $clients = Client::all();
            return response()->json($clients);
        } else {
            return response()->json(['error' => 'Forbidden'], 403);
        }
    }

    /**
     * Get the count of clients.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function countClients(Request $request)
    {
        $authenticated = $this->authenticateUser($request);
        if ($authenticated) {
            $clientCount = Client::count();
            return response()->json(['client_count' => $clientCount]);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    /**
     * Update user profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $authenticatedUser = $this->authenticateUser($request);
        $clientToUpdate = Client::find($id);

        if (!$clientToUpdate) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Validating email and password
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'old_password' => 'nullable|min:8',
            'new_password' => 'nullable|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        // Check if old password is provided and matches the hashed password in the database
        if ($request->has('old_password')) {
            if (!Hash::check($request->old_password, $clientToUpdate->password)) {
                return response()->json(['error' => 'Old password does not match'], 422);
            }
        }

        // Update user data
        $clientToUpdate->fill($request->only(['email', 'password', /* add other fields here if needed */ ]));
        
        // Optionally, you can hash the new password before saving
        if ($request->has('new_password')) {
            $clientToUpdate->password = bcrypt($request->new_password);
        }

        $clientToUpdate->save();

        return response()->json("updated", 200);
    }

    
}
