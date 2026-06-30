<?php

test('health endpoint returns expected response', function () {
    $this->getJson('/api/health')
        ->assertOk()
        ->assertExactJson([
            'status'=>'ok',
        ]);
});