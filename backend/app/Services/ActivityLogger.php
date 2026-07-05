<?php

namespace App\Services;

use App\Models\UserActivity;

class ActivityLogger
{
    public function log (int $userId, string $activity): void
    {
        UserActivity::create([
            'user_id' => $userId,
            'activity' => $activity,
        ]);
    }
}