<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artist extends Model
{
    use HasFactory;

    protected $fillable = [

        'name', 'photo', 'description',  'facebook', 'instagram', 'twitter', 'youtube', 'birth_date', 'birth_place'

    ];

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'artist', 'id');
    }
}
