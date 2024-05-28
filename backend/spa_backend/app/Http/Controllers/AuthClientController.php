<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;


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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:clients',
            'password' => 'required|string|min:8',
            'gender' => 'required|string',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $verification_token = Str::random(60);

        $client = Client::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'gender' => $request->gender,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'verification_token' => $verification_token,
        ]);

        // Send verification email
        Mail::send('emails.verify', ['token' => $verification_token], function ($message) use ($client) {
            $message->to($client->email);
            $message->subject('Email Verification');
        });

        return response()->json([
            'message' => 'Client registered successfully. Please verify your email.',
            'client' => $client
        ], 201);
    }

    public function verifyEmail($token)
    {
        $client = Client::where('verification_token', $token)->first();

        if (!$client) {
            return response()->json([
                'message' => 'Invalid verification token.'
            ], 404);
        }

        $client->verified_email = true;
        $client->verification_token = null;
        $client->save();

        return response()->json([
            'message' => 'Email verified successfully.'
        ], 200);
    }


    /**
     * Get a JWT via given credentials for client interface.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    // app/Http/Controllers/AuthClientController.php

    public function login(LoginRequest $request): JsonResponse
    {
        $client = Client::where('email', $request->email)->first();

        if (!$client->verified_email) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Please verify your email before logging in.',
            ], 401);
        }

        if (!$client || !Hash::check($request->password, $client->password)) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if (!$token = Auth::guard('client')->attempt($request->only('email', 'password'))) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid email or password.',
            ], 401);
        }

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
