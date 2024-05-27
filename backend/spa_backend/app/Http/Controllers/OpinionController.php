<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Opinion;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OpinionController extends Controller
{
    /**
     * Decode JWT token and authenticate user.
     *
     * @param Request $request
     * @return \App\Models\User|null
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
        $opinions = Opinion::all()->pluck('opinion');
        return response()->json($opinions);
        
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'client_id' => 'required|exists:clients,id',
            'opinion' => 'required|string',
        ]);

        Opinion::create([
            'service_id' => $request->input('service_id'),
            'client_id' => $request->input('client_id'),
            'opinion' => $request->input('opinion'),
        ]);

        return response()->json(['message' => 'Opinion added successfully'], 200);
    }
}
