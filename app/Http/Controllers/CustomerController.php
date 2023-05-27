<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class CustomerController extends Controller
{
    public function getCustomerData(Request $request)
    {
        $table_row = (int)$request->query('row');
        $table_page = (int)$request->query('page');
        $query = DB::table('table_customer')
            ->offset($table_page === 0 ? 0 : $table_row * $table_page)
            ->limit($table_row)
            ->get();
        $total_data = DB::table('table_customer')->count();

        $data = (object)[
            'data' => $query,
            'meta' => [
                'page' => $table_page,
                'page_size' => $table_row,
                'total' => $total_data,
            ]
        ];

        return response()->json($data);
    }

    public function customerDataOption(Request $request)
    {
        $query = DB::table('table_customer')->select('name', 'customer_id')->get();

        return response()->json($query);
    }

    public function addCustomer(Request $request): RedirectResponse
    {
        $total_data = DB::table('table_customer')->count() + 1;
        $rt = $request->input('rt');
        $uniqueRT = $rt < 10 ? "00$rt" : ($rt < 100 ? "0$rt" : $rt);
        $generateCustomerID = "Pam-$total_data-$uniqueRT";
        try {
            DB::table('table_customer')->insert([
                'name'  => $request->input('name'),
                'customer_id' => $generateCustomerID,
                'phone' => $request->input('phone'),
                'address' => $request->input('address'),
                'rt' => $request->input('rt'),
                'rw' => $request->input('rw'),
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }

        return Redirect::route('customer');
    }

    public function changeStatus(Request $request): RedirectResponse
    {
        $customId = $request->query('id');
        $status = $request->input('status');

        DB::table('table_customer')->where('customer_id', $customId)->update([
            'status' => $status === 1 ? 0 : 1,
        ]);

        return Redirect::route('customer');
    }

    public function deleteCustomer(Request $request): RedirectResponse
    {
        $customId = $request->query('customer_id');

        try {
            DB::table('table_customer')->where('customer_id', $customId)->delete();
        } catch (\Throwable $th) {
            throw $th;
        }

        return Redirect::route('customer');
    }

    public function updateCustomer(Request $request): RedirectResponse
    {
        $customId = $request->input('table_customer');

        try {
            DB::table('table_customer')->where('customer_id', $customId)->update([
                'name' => $request->input('name'),
                'phone' => $request->input('phone'),
                'address' => $request->input('address'),
                'rt' => $request->input('rt'),
                'rw' => $request->input('rw'),
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }

        return Redirect::route('customer');
    }

    public function getSingleCustomer(Request $request, $id)
    {
        try {
            $data = DB::table('table_customer')->where('customer_id', $id)->first();
            return response()->json($data);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
