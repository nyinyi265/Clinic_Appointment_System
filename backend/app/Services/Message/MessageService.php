<?php

namespace App\Services\Message;

use App\Models\Message;
use App\Http\Resources\Message\MessageResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MessageService
{
    public function store(array $data): MessageResource
    {
        $message = Message::create($data);
        return new MessageResource($message);
    }

    public function index(): AnonymousResourceCollection
    {
        $messages = Message::orderBy('created_at', 'desc')->get();
        return MessageResource::collection($messages);
    }

    public function delete($id){
        $message = Message::where('id', $id)->first();
        $message->delete();
    }
}
