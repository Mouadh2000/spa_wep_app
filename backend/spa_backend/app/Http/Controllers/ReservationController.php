<?php

namespace App\Http\Controllers;
use App\Models\Reservation;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Exception;



use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Decode JWT token and authenticate user.
     *
     * @param Request $request
     * @return \App\Models\Client|null
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
    public function store(Request $request)
    {
        $user = $request->user();
        if ($this->authenticateUser($request)) {
                $newReservation = Reservation::create($request->all());
                return response()->json($newReservation, 201);
        }
    }
}
