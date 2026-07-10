<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserActivityResource;
use App\Http\Resources\UserLoginSummaryResource;
use App\Models\UserActivity;
use App\Models\User;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserActivityController extends Controller
{
    use ApiResponse;

    public function index ()
    {
        $data = UserActivity::with([
            'user:id,name'
        ])->paginate(20);
        
        return $this->success(UserActivityResource::collection($data), 'User Activities fetched successfully');
    }

    public function summary ()
    {
        $todayLoginUsers = UserActivity::with('user:id,name')
            ->selectRaw('user_id, COUNT(*) as login_count')
            ->where('activity', 'login')
            ->whereDate('created_at', today())
            ->groupBy('user_id')
            ->get();

        $data = [
            'total' => [
                'activity' => UserActivity::count(),
                'user_login' => UserActivity::where('activity', 'login')
                    ->distinct('user_id')
                    ->count('user_id'),
            ],
            'today' => [
                'activity' => UserActivity::whereDate('created_at', today())
                    ->count(),
                'user_login' => [
                    'total' => $todayLoginUsers->count(),
                    'users' => UserLoginSummaryResource::collection($todayLoginUsers),
                ]
            ]
        ];

        return $this->success($data, 'user activities summary fetched successfully');
    }

    public function period (Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        $data = UserActivity::with([
                'user:id,name',
            ])->whereBetween('created_at', [
                Carbon::parse($validated['start_date'])->startOfDay(),
                Carbon::parse($validated['end_date'])->endOfDay(),
            ])
            ->latest()
            ->paginate(20);
        
        return $this->success(
            UserActivityResource::collection($data),
            'period user activities fetched successfully'
        );
    }

    public function byUser (User $user)
    {
        $record = UserActivity::with('user:id,name')
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(20);
        

        return $this->success(
            UserActivityResource::collection($record),
            'user activities fetched successfully'
        );
    }
}
