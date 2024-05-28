<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
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
        $authenticated = $this->authenticateUser($request);
        $user = $request->user();
        $isStaff = $user->is_staff;
        $isAdmin = $user->is_admin;

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);
        if ($validator->fails()) {
            // Return detailed error messages
            return response()->json(['errors' => $validator->errors()], 400);
        }
        
        if ($authenticated  && $isAdmin === 1 && $isStaff === 1) {
            $newUser = User::create($request->all());
            return response()->json($newUser, 201);
        } else {
            return response()->json(['error' => 'Forbidden'], 403);
        }
    }

    public function update(Request $request, $id)
    {
        $authenticatedUser = $this->authenticateUser($request);

        $user = $request->user();
        $isStaff = $user->is_staff;
        $isAdmin = $user->is_admin;

        $userToUpdate = User::find($id);

        if(!$userToUpdate){
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($authenticatedUser  && $isAdmin === 1 && $isStaff === 1) {
            $userToUpdate->update($request->all());
            return response()->json($user, 200);
        } else {
            return response()->json(['error' => 'Forbidden'], 403);
        }
    }

    public function destroy(Request $request, $id)
    {
        $authenticatedUser = $this->authenticateUser($request);

        $user = $request->user();
        $isStaff = $user->is_staff;
        $isAdmin = $user->is_admin;

        $userToDelete = User::find($id);

        if (!$userToDelete) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($authenticatedUser && $isAdmin === 1 && $isStaff === 1) {
            $userToDelete->delete();
            return response()->json(null, 204);
        } else {
            return response()->json(['error' => 'Forbidden'], 403);
        }
    }

    public function countUsers(Request $request)
    {
        $authenticated = $this->authenticateUser($request);
        if ($authenticated) {
            $userCount = User::count();
            return response()->json(['user_count' => $userCount]);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }
}
