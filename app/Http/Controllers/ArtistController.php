<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArtistController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $artist = Artist::all();

        return response([
            'result' => [
                'status'  => 'success',
                'artist' => $artist,
            ],
        ], 200);
    }

    /**
     * Display a item of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function view($id)
    {
        $artist = Artist::where('id', $id)->with('contracts')->first();

        if ($artist) {
            return response([
                'result' => [
                    'status'  => 'success',
                    'artist' => $artist,
                ],
            ], 200);
        } else {
            return response([
                'result' => [
                    'status'  => 'No Content',
                ],
            ], 204);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'required',
        ]);

        $input = $request->all();

        if ($request->hasfile('photo')) {
            $image = $request->file('photo');
            $profileImage = time() . $image->getClientOriginalName();
            $filePath = 'photo/' . $profileImage;
            Storage::disk('s3')->put($filePath, file_get_contents($image));

            $path = Storage::disk('s3')->url($filePath);
            $input['photo'] = $path;
        }

        $artist = Artist::create($input);

        return response([
            'result' => [
                'status'  => 'success',
                'artist' => $artist,
            ],
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Artist  $artist
     * @return \Illuminate\Http\Response
     */
    public function show(Artist $artist)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Artist  $artist
     * @return \Illuminate\Http\Response
     */
    public function edit(Artist $artist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Artist  $artist
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
        ]);

        $artist = Artist::find($id);

        if (!$artist) {
            return response([
                'result' => [
                    'status'  => 'error',
                    'message' => 'Artista no encontrado',
                ],
            ], 400);
        }

        if ($request->hasfile('photo')) {
            $image = $request->file('photo');
            $profileImage = time() . $image->getClientOriginalName();
            $filePath = 'photo/'  . $profileImage;
            Storage::disk('s3')->put($filePath, file_get_contents($image));

            $path = Storage::disk('s3')->url($filePath);
            $artist->photo = $path;
        }

        $artist->name = $request->name;
        $artist->description = $request->description;
        if ($request->birth_date) {
            $artist->birth_date = $request->birth_date;
        }
        if ($request->birth_place) {
            $artist->birth_place = $request->birth_place;
        }
        if ($request->facebook) {
            $artist->facebook = $request->facebook;
        }
        if ($request->instagram) {
            $artist->instagram = $request->instagram;
        }
        if ($request->twitter) {
            $artist->twitter = $request->twitter;
        }
        if ($request->youtube) {
            $artist->youtube = $request->youtube;
        }

        $artist->save();

        return response([
            'result' => [
                'status'  => 'success',
                'artist' => $artist,
            ],
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Artist  $artist
     * @return \Illuminate\Http\Response
     */
    public function destroy(Artist $artist)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Contract  $contract
     * @return \Illuminate\Http\Response
     */
    public function delete($id)
    {
        $artist = Artist::find($id);

        if (!$artist) {
            return response([
                'result' => [
                    'status'  => 'error',
                    'message' => 'Artista no encontrado',
                ],
            ], 400);
        }

        $artist->delete();

        return response([
            'result' => [
                'status'  => 'success',
                'message' => 'Artist deleted successfully.',
            ],
        ], 200);
    }
}
