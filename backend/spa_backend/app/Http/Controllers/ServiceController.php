<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Service;
use App\Models\Category;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\PermissionController;

class ServiceController extends Controller
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
            $services = Service::All();
            return response()->json($services);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($this->authenticateUser($request)) {
            $isAdmin = $user->is_admin;
    
            if ($isAdmin == 1 || ($isAdmin == 0 && PermissionController::createPermission($request))) {  
                $newService = Service::create($request->all());
                return response()->json($newService, 201);
            } else {
                return response()->json(['error' => 'Forbidden'], 403);
            }
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        if ($this->authenticateUser($request)) {
            $serviceToUpdate = Service::find($id);
            if (!$serviceToUpdate) {
                return response()->json(['error' => 'Service not found'], 404);
            }
            $isAdmin = $user->is_admin;
    
            if ($isAdmin == 1 || ($isAdmin == 0 && PermissionController::updatePermission($request))) {
            
                $serviceToUpdate->update($request->all());
    
                return response()->json('Service Updated Successfully', 200);
            } else {
                return response()->json(['error' => 'Forbidden'], 403);
            }
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }


    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if ($this->authenticateUser($request)) {
            $service = Service::find($id);
            if (!$service) {
                return response()->json(['error' => 'Service not found'], 404);
            }
            $isAdmin = $user->is_admin;
    
            if ($isAdmin == 1 || ($isAdmin == 0 && PermissionController::deletePermisison($request))) {
            
                // Delete category
                $service->delete();
    
                return response()->json(null, 204);
            } else {
                return response()->json(['error' => 'Forbidden'], 403);
            }
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

}
