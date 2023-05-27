<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use DB;

class SettingController extends Controller
{
    public function getSettingData() {
        $query = DB::table('table_settings')->get();

        return response()->json($query);
    }

    public function saveSetting(Request $request): RedirectResponse {
        try {
            DB::table('table_settings')
                ->where('id', 1)
                ->update(['cubic_price' => $request->input('cubic'), 'admin_price' => $request->input('admin')]);
        } catch (\Throwable $th) {
            throw $th;
        }
        return Redirect::route('settings');
    }
}
