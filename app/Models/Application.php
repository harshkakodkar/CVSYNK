<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $table = 'applications';

    protected $fillable = [
        'uuid',
        'job_uuid',
        'candidate_uuid',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_uuid', 'uuid');
    }

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_uuid', 'uuid');
    }
}
