<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * Controller
 */

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;


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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/customer', [CustomerController::class, 'getCustomerData'])->name('customer_data');
    Route::get('/customer/list', [CustomerController::class, 'customerDataOption'])->name('customer_option');
    Route::get('/settings', [SettingController::class, 'getSettingData'])->name('settings_data');
    Route::post('/settings/save', [SettingController::class, 'saveSetting'])->name('settings_save');
    Route::post('/customer/add', [CustomerController::class, 'addCustomer'])->name('customer_save');
    Route::post('/customer/status', [CustomerController::class, 'changeStatus'])->name('customer_status');
    Route::get('/customer/delete', [CustomerController::class, 'deleteCustomer'])->name('customer_delete');
    Route::post('/customer/update', [CustomerController::class, 'updateCustomer'])->name('customer_update');
    Route::get('/customer/view/{id}', [CustomerController::class, 'getSingleCustomer'])->name('customer_view');
    Route::post('/report/add', [ReportController::class, 'addReport'])->name('report_add');
    Route::get('/reports', [ReportController::class, 'showReport'])->name('report_data');
    Route::get('/report/check', [ReportController::class, 'checkDataReport'])->name('check_report');
    Route::post('/report/edit', [ReportController::class, 'editReport'])->name('edit_report');
    Route::get('/report/{id}', [ReportController::class, 'deleteReport'])->name('delete_report');
});
