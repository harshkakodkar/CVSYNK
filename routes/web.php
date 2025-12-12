<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/test', function () {
    return response()->json(['message' => 'Hello, Laravel API is working!']);
});


// React Routes (Frontend)
// Route::view('/login', 'app');


// Catch-all for other React routes
Route::view('/{path}', 'welcome')->where('path', '.*');
