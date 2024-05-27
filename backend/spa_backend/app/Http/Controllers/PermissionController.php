<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Exception;


class PermissionController extends Controller
{
    
    public static function createPermission(Request $request)
    {
        $user = $request->user();
        $permission_level = $user->permission_level;
        if(in_array($permission_level, ['Editor', 'Create', 'Edit', 'Refine'])){
            return true;
        }
        else {
            return false;
        }
    }  
    public static function updatePermission(Request $request)
    {
        $user = $request->user();
        $permission_level = $user->permission_level;
        if(in_array($permission_level, ['Editor', 'Modify', 'Emend', 'Refine'])){
            return true;
        }
        else {
            return false;
        }
    }


    public static function deletePermisison(Request $request)
    {
 
        $user = $request->user();
        $permission_level = $user->permission_level;
        if(in_array($permission_level, ['Editor', 'Delete', 'Edit', 'Emend'])){
            return true;
        }
        else {
            return false;
        }
    }

}
