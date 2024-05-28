<?php

namespace App\Http\Controllers;
use App\Models\Reservation;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
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
            $validatedData = $request->validate([
                'service_id' => 'required|integer',
                'client_id' => 'required|integer',
                'reservation_date' => 'required|date_format:Y-m-d\TH:i:s.v\Z', // Adjusted date format
            ]);

            // Parse and reformat the date to match MySQL datetime format
            $parsedDate = Carbon::createFromFormat('Y-m-d\TH:i:s.v\Z', $validatedData['reservation_date'])->format('Y-m-d H:i:s');

            $newReservation = Reservation::create([
                'service_id' => $validatedData['service_id'],
                'client_id' => $validatedData['client_id'],
                'date' => $parsedDate, // Ensure field name matches database
            ]);

            return response()->json($newReservation, 201);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }
    public function index(Request $request)
    {
        $user = $request->user();
        if ($this->authenticateUser($request)) {
            $reservations = Reservation::with(['service', 'client'])->get();

            return response()->json($reservations);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function getMonthlyReservations(Request $request)
    {
        $user = $request->user();
        if ($this->authenticateUser($request)) {
            $reservations = Reservation::selectRaw('MONTH(date) as month, COUNT(*) as count')
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            return response()->json($reservations);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function calculateTotalPrice(Request $request)
    {
        $user = $request->user();
        if ($this->authenticateUser($request)) {
            $totalPrice = Reservation::join('services', 'reservations.service_id', '=', 'services.id')
                ->selectRaw('SUM(CAST(services.price AS DECIMAL(10, 2))) as total_price')
                ->value('total_price');

            return response()->json(['total_price' => $totalPrice]);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }



}
