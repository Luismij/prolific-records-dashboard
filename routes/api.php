<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\ContractController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('artist', [ArtistController::class, 'index']);
Route::post('artist/create', [ArtistController::class, 'store']);
Route::get('artist/get/{id}', [ArtistController::class, 'view']);
Route::post('artist/update/{id}', [ArtistController::class, 'update']);
Route::post('artist/delete/{id}', [ArtistController::class, 'delete']);

Route::get('contract', [ContractController::class, 'index']);
Route::post('contract/create', [ContractController::class, 'store']);
Route::get('contract/get/{id}', [ContractController::class, 'view']);
Route::post('contract/update/{id}', [ContractController::class, 'update']);
Route::post('contract/delete/{id}', [ContractController::class, 'delete']);

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);

    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::get('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });
});
