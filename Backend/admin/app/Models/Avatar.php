<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Notifications\Notifiable;

class Avatar extends Model
{
    use HasFactory, Notifiable, HasUuids;
    protected $fillable = [
        'name',
        'secure_url',
        'price',
    ];

    public function getIncrementing ()
    {
        return false;
    }
}
