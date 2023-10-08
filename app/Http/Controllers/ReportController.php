<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class ReportController extends Controller
{
    public function addReport(Request $request): JsonResponse
    {
        $monthInput = date('Y-m-', strtotime(($request->input('month'))));
        $monthBefore = date_create($request->input('month'))->modify('-1 months')->format('Y-m-');
        try {
            $dataIsExist = DB::table('table_reports')->where([
                ['customer_id', '=', $request->input('customer_id')],
                ['report_date', 'like', $monthInput . '%']
            ])->get();
            $getSettingData = DB::table('table_settings')->where('id', 1)->first();

            if (count($dataIsExist) === 0) {
                $dataBefore = DB::table('table_reports')->where([
                    ['customer_id', '=', $request->input('customer_id')],
                    ['report_date', 'like', $monthBefore . '%']
                ])->get();
                $totalMeter = count($dataBefore) === 0 ? $request->input('cubic') : ($request->input('cubic') - $dataBefore[0]->meter);
                $totalPrice = ($totalMeter * $getSettingData->cubic_price) + $getSettingData->admin_price;
                DB::table('table_reports')->insert([
                    'customer_id' => $request->input('customer_id'),
                    'meter' => $request->input('cubic'),
                    'report_date' => $request->input('month'),
                    'total' => $totalPrice,
                ]);

                return Response::json('Report berhasil ditambahkan');
            } else {
                return Response::json('Report sudah ada', 401);
            }

            return Response::json($dataIsExist);
        } catch (\Throwable $th) {
            return Response::json($th, 400);
        }
    }

    private function getDataBefore($customerId, $month)
    {
        try {
            $data = DB::table('table_reports')->where([
                ['customer_id', '=', $customerId],
                ['report_date', 'like', $month . '%']
            ])->first();

            return $data;
        } catch (\Throwable $e) {
            return $e;
        }
    }

    public function showReport(Request $request): JsonResponse
    {
        $table_row = (int)$request->query('row');
        $table_page = (int)$request->query('page');
        $monthBefore = $request->query('month_before');
        $month = $request->query('month');
        $getSettingData = DB::table('table_settings')->where('id', 1)->first();
        $query = DB::table('table_reports')
            ->leftJoin('table_customer', 'table_reports.customer_id', '=', 'table_customer.customer_id')
            ->where('table_reports.report_date', 'like', $month . '%')
            ->select(
                'table_reports.id as id',
                'table_customer.name as name',
                'table_customer.customer_id as customer_id',
                'table_reports.meter as meter_now',
                'table_reports.total as total',
                'table_reports.report_date as report_date'
            )
            ->offset(($table_page === 0 ? 0 : $table_row * $table_page))
            ->limit($table_row)
            ->get();

        $reportData = [];
        foreach ($query as $key => $data) {
            $meterBefore = $this->getDataBefore($data->customer_id, $monthBefore);
            $result = (object)[
                'id' => $key + 1,
                'no' => $data->id,
                'name' => $data->name,
                'customer_id' => $data->customer_id,
                'meter_before' => $meterBefore === null ? 0 : $meterBefore->meter,
                'meter_now' => $data->meter_now,
                'total' => $data->total,
                'cubic_price' => $getSettingData->cubic_price,
                'admin_price' => $getSettingData->admin_price,
                'report_date' => $data->report_date,
            ];

            array_push($reportData, $result);
        };
        $total_data = DB::table('table_reports')->count();

        return Response::json(['data' => $reportData, 'meta' => (object)['total' => $total_data]]);
    }

    public function checkDataReport(Request $request)
    {
        $cusId = $request->query('cus_id');
        $targetMonth = $request->query('date');
        $query = DB::table('table_reports')
            ->where('customer_id', $cusId)
            ->where('report_date', $targetMonth)
            ->first();

        return Response::json($query);
    }

    public function editReport(Request $request)
    {
        $idReport = $request->input('id');
        $cubic = $request->input('cubic');
        $targetMonth = $request->input('date');
        $cusId = $request->input('cus_id');
        $idToDelete = $request->input('id_delete');
        try {
            if ($idToDelete !== null) {
                DB::table('table_reports')
                    ->where('id', $idToDelete)
                    ->delete();
            }
            $monthBefore = date_create($targetMonth)->modify('-1 months')->format('Y-m-');
            $getSettingData = DB::table('table_settings')->where('id', 1)->first();
            $dataBefore = DB::table('table_reports')->where([
                ['customer_id', '=', $cusId],
                ['report_date', 'like', $monthBefore . '%']
            ])->get();
            $totalMeter = 0;
            if (count($dataBefore) !== 0) {
                $totalMeter = $cubic - $dataBefore[0]->meter;
            }
            $totalPrice = ($totalMeter * $getSettingData->cubic_price) + $getSettingData->admin_price;
            DB::table('table_reports')
                ->where('id', $idReport)
                ->update(['meter' => $cubic, 'report_date' => $targetMonth, 'total' => $totalPrice]);

            return Response::json(true);
        } catch (e) {
            return Response::json(false);
        }
    }

    public function deleteReport($id)
    {
        try {
            DB::table('table_reports')->where('id', $id)->delete();

            return Response::json(true);
        } catch (e) {
            return Response::json(false);
        }
    }
}
