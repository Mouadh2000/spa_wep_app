<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
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
        if ($authenticated) {
            $users = User::all();
            return response()->json($users);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function store(Request $request)
    {
        $token = $request->header('Authorization');

        $authenticated = $this->authenticateUser($request);
        $user = $request->user();
        $isStaff = $user->is_staff;
        $isAdmin = $user->is_admin;
        if ($authenticated  && $isAdmin === 1 && $isStaff === 1) {
            $newUser = User::create($request->all());
            return response()->json($newUser, 201);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function update(Request $request, User $user)
    {
        $token = $request->header('Authorization');

        $authenticatedUser = $this->authenticateUser($request);

        $user = $request->user();
        $isStaff = $user->is_staff;
        $isAdmin = $user->is_admin;

        if ($authenticatedUser  && $isAdmin === 1 && $isStaff === 1) {
            $user->update($request->all());
            return response()->json($user, 200);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function destroy(Request $request, User $user)
    {
        $token = $request->header('Authorization');

        $authenticatedUser = $this->authenticateUser($request);

        $user = $request->user();
        $isStaff = $user->is_staff;
        $isAdmin = $user->is_admin;

        if ($authenticatedUser && $isAdmin === 1 && $isStaff === 1) {
            $user->delete();
            return response()->json(null, 204);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }
}
