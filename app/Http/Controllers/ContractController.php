<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $contract = Contract::with('artist')->get();

        return response([
            'result' => [
                'status'  => 'success',
                'contract' => $contract,
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
        $contract = Contract::where('id', $id)->with('artist')->first();

        if ($contract) {
            return response([
                'result' => [
                    'status'  => 'success',
                    'contract' => $contract,
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
            'artist' => 'required',
            'start_date' => 'required|date',
        ]);

        $input = $request->all();

        if ($request->hasfile('contract')) {
            $contract = $request->file('contract');

            $contractName = time() . $contract->getClientOriginalName();
            $filePath = 'contract/' . $request->artist . '/' . $contractName;
            Storage::disk('s3')->put($filePath, file_get_contents($contract));

            $path = Storage::disk('s3')->url($filePath);
            $input['contract'] = $path;
        } else {
            $input['contract'] = null;
        }

        $contract = Contract::create($input);

        return response([
            'result' => [
                'status'  => 'success',
                'contract' => $contract,
            ],
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Contract  $contract
     * @return \Illuminate\Http\Response
     */
    public function show(Contract $contract)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Contract  $contract
     * @return \Illuminate\Http\Response
     */
    public function edit(Contract $contract)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Contract  $contract
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'start_date' => 'required|date',
        ]);

        $contract = Contract::find($id);

        if (!$contract) {
            return response([
                'result' => [
                    'status'  => 'error',
                    'message' => 'Contrato no encontrado',
                ],
            ], 400);
        }

        if ($request->hasfile('contract')) {
            $contractFile = $request->file('contract');

            $contractName = time() . $contractFile->getClientOriginalName();
            $filePath = 'contract/' . $request->artist . '/' . $contractName;
            Storage::disk('s3')->put($filePath, file_get_contents($contractFile));

            $path = Storage::disk('s3')->url($filePath);
            $contract->contract = $path;
        }

        $contract->start_date = $request->start_date;
        if ($request->end_date) {
            $contract->end_date = $request->end_date;
        }
        if ($request->value) {
            $contract->value = $request->value;
        }
        if ($request->notes) {
            $contract->notes = $request->notes;
        }

        $contract->save();

        return response([
            'result' => [
                'status'  => 'success',
                'contract' => $contract,
            ],
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Contract  $contract
     * @return \Illuminate\Http\Response
     */
    public function delete($id)
    {
        $contract = Contract::find($id);

        if (!$contract) {
            return response([
                'result' => [
                    'status'  => 'error',
                    'message' => 'Contrato no encontrado',
                ],
            ], 400);
        }

        $contract->delete();

        return response([
            'result' => [
                'status'  => 'success',
                'message' => 'Contract deleted successfully.',
            ],
        ], 200);
    }
}
