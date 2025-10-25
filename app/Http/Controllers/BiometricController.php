<?php

namespace App\Http\Controllers;

use App\Models\BiometricDatum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BiometricController extends Controller
{
    public function index()
    {
        $biometricData = BiometricDatum::where('user_id', Auth::id())
            ->orderBy('measurement_date', 'desc')
            ->get();
        return response()->json($biometricData);
    }

    public function store(Request $request)
    {
        $request->validate([
            'weight' => 'nullable|numeric|min:0',
            'systolic_bp' => 'nullable|integer|min:50|max:300',
            'diastolic_bp' => 'nullable|integer|min:30|max:200',
            'bmi' => 'nullable|numeric|min:10|max:100',
            'measurement_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // Calculate BMI if weight and height are provided
        if ($request->weight && $request->height) {
            $request->merge([
                'bmi' => $request->weight / pow($request->height / 100, 2)
            ]);
        }

        $biometric = BiometricDatum::create([
            'user_id' => Auth::id(),
            'weight' => $request->weight,
            'systolic_bp' => $request->systolic_bp,
            'diastolic_bp' => $request->diastolic_bp,
            'bmi' => $request->bmi,
            'measurement_date' => $request->measurement_date,
            'notes' => $request->notes,
        ]);

        return response()->json($biometric, 201);
    }

    public function show($id)
    {
        $biometric = BiometricDatum::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();
        return response()->json($biometric);
    }

    public function update(Request $request, BiometricDatum $biometricDatum)
    {
        if ($biometricDatum->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'weight' => 'nullable|numeric|min:0',
            'systolic_bp' => 'nullable|integer|min:50|max:300',
            'diastolic_bp' => 'nullable|integer|min:30|max:200',
            'bmi' => 'nullable|numeric|min:10|max:100',
            'measurement_date' => 'sometimes|date',
            'notes' => 'nullable|string',
        ]);

        $biometricDatum->update($request->all());
        return response()->json($biometricDatum);
    }

    public function destroy(BiometricDatum $biometricDatum)
    {
        if ($biometricDatum->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $biometricDatum->delete();
        return response()->json(['message' => 'Biometric data deleted successfully']);
    }

    public function getTrendData()
    {
        $data = BiometricDatum::where('user_id', Auth::id())
            ->orderBy('measurement_date', 'asc')
            ->select('weight', 'systolic_bp', 'diastolic_bp', 'bmi', 'measurement_date')
            ->get();

        return response()->json([
            'weight_trend' => $data->pluck('weight', 'measurement_date'),
            'blood_pressure_trend' => $data->map(function($item) {
                return [
                    'date' => $item->measurement_date,
                    'systolic' => $item->systolic_bp,
                    'diastolic' => $item->diastolic_bp
                ];
            }),
            'bmi_trend' => $data->pluck('bmi', 'measurement_date'),
        ]);
    }
}
