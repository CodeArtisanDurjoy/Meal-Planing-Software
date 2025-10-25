<?php

namespace App\Http\Controllers;

use App\Models\UserGoal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoalController extends Controller
{
    public function index()
    {
        $goals = UserGoal::where('user_id', Auth::id())->get();
        return response()->json($goals);
    }

    public function store(Request $request)
    {
        $request->validate([
            'goal_type' => 'required|string|max:255',
            'target_value' => 'required|numeric',
            'direction' => 'required|in:up,down',
            'unit' => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $goal = UserGoal::create([
            'user_id' => Auth::id(),
            'goal_type' => $request->goal_type,
            'target_value' => $request->target_value,
            'direction' => $request->direction,
            'unit' => $request->unit,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        return response()->json($goal, 201);
    }

    public function show(UserGoal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        return response()->json($goal);
    }

    public function update(Request $request, UserGoal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'goal_type' => 'sometimes|string|max:255',
            'target_value' => 'sometimes|numeric',
            'direction' => 'sometimes|in:up,down',
            'unit' => 'sometimes|string|max:50',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'sometimes|boolean',
        ]);

        $goal->update($request->all());
        return response()->json($goal);
    }

    public function destroy(UserGoal $goal)
    {
        if ($goal->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $goal->delete();
        return response()->json(['message' => 'Goal deleted successfully']);
    }
}
