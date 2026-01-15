<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Services\Message\MessageService;
use App\Trait\HttpResponse;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    use HttpResponse;

    protected MessageService $messageService;

    public function __construct(MessageService $messageService)
    {
        $this->messageService = $messageService;
    }

    public function store(StoreMessageRequest $request): JsonResponse
    {
        $message = $this->messageService->store($request->validated());
        return $this->success('success', $message, 'Message sent successfully', 201);
    }

    public function index(): JsonResponse
    {
        $messages = $this->messageService->index();
        return $this->success('success', $messages, 'Messages retrieved successfully', 200);
    }

    public function delete($id){
        $this->messageService->delete($id);
        return $this->success('success', null, 'Message deleted successfully', 200);
    }
}
