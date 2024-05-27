<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OpinionController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AuthClientController;
use App\Http\Controllers\ReservationController;






/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth.token')->get('/me', function (Request $request) {
    return $request->user();
});

Route::controller(AuthClientController::class)->group(function ($router) {
    Route::post('client/login', 'login')->name('client.login');
    Route::post('client/logout', 'logout')->name('client.logout')->middleware('auth.token');
    Route::post('client/register', 'register')->name('client.register');
    Route::post('client/reservation/add', [ReservationController::class, 'store'])->name('reservation.store');
    //Opinion Route
    Route::post('client/add/opinion', [OpinionController::class, 'store'])->name('clients.addopinion');
    Route::get('clients/opinions', [OpinionController::class, 'index'])->name('clients.opinion');

});

Route::controller(AuthController::class)->group(function ($router) {
    Route::post('login', 'login')->name('login');
    Route::post('logout', 'logout')->name('logout')->middleware('auth.token');
    //User Route
    Route::get('users/views', [UserController::class, 'index'])->name('users.index');

    Route::post('users/create', [UserController::class, 'store'])->name('users.store');
    Route::put('users/edit/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/delete/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    //Category Route
    Route::get('category/views', [CategoryController::class, 'index'])->name('category.index');
    Route::post('category/create', [CategoryController::class, 'store'])->name('category.store');
    Route::delete('category/delete/{user}', [CategoryController::class, 'destroy'])->name('category.destroy');
    //Service Route
    Route::get('service/views', [serviceController::class, 'index'])->name('service.index');
    Route::post('service/create', [ServiceController::class, 'store'])->name('service.store');
    Route::put('service/edit/{service}', [ServiceController::class, 'update'])->name('service.update');
    Route::delete('service/delete/{service}', [ServiceController::class, 'destroy'])->name('service.destroy');
    //Client Route
    Route::get('clients/views', [ClientController::class, 'index'])->name('clients.index');
    


});
