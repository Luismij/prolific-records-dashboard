<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [

        'artist', 'start_date', 'end_date',  'value', 'notes', 'contract'

    ];


    public function artist()
    {

        return $this->belongsTo(Artist::class, 'artist');
    }
}
