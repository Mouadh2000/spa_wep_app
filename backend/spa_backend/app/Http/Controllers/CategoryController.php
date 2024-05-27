<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Category;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\PermissionController;

class CategoryController extends Controller
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

            $categories = Category::all();
            
            // Iterate through categories to include image content
            foreach ($categories as $category) {
                $category->image_content = null; // Initialize image content
                
                // Check if image exists for the category
                if ($category->image && Storage::disk('public')->exists('category_images/' . $category->image)) {
                    // If image exists, read its content and encode it as base64
                    $imageContent = Storage::disk('public')->get('category_images/' . $category->image);
                    $base64Image = base64_encode($imageContent);
                    $category->image_content = $base64Image;
                }
            } 
            return response()->json($categories);
    }


    public function store(Request $request)
    {
        $user = $request->user();
        if ($this->authenticateUser($request)) {
            $validator = Validator::make($request->all(), [
                'category_name' => 'required',
                'description' => 'nullable',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }
            $isAdmin = $user->is_admin;
    
            if ($isAdmin == 1 || ($isAdmin == 0 && PermissionController::createPermission($request))) {
                // Handle image upload
                $imagePath = $request->file('image')->store('category_images', 'public');
    
                $category = new Category();
                $category->category_name = $request->category_name;
                $category->description = $request->description;
                $category->image = basename($imagePath); // Store only the filename in the database
                $category->save();
    
                return response()->json($category, 201);
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
            $category = Category::find($id);
            if (!$category) {
                return response()->json(['error' => 'Category not found'], 404);
            }
            $isAdmin = $user->is_admin;
    
            if ($isAdmin == 1 || ($isAdmin == 0 && PermissionController::deletePermisison($request))) {
                $imagePath = 'category_images/' . $category->image;
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
    
                // Delete category
                $category->delete();
    
                return response()->json(null, 204);
            } else {
                return response()->json(['error' => 'Forbidden'], 403);
            }
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }
    
}

