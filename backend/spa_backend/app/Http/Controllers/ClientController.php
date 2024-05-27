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

    public function addOpinion(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:clients,id',
            'opinion' => 'required|string',
        ]);

        $client = Client::findOrFail($request->input('id'));

        $client->opinion = $request->input('opinion');
        $client->save();

        return response()->json(['message' => 'Opinion added successfully'], 200);
    }
}
