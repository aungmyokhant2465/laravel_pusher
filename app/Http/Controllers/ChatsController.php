<?php

namespace App\Http\Controllers;

use App\Message;
use App\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\MessageSent;

class ChatsController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }

    public function index() {
        return view('chat');
    }

    public function fetchMessages() {
        return Message::with('user')->get();
    }

    public function sendMessage(Request $request) {
        $user = User::whereId($request['user']['id'])->first();
        $message = $user->messages()->create([
            'message' => $request['message']
        ]);

        broadcast(new MessageSent($user, $message))->toOthers();

        return ['status'=> 'message sent'];
    }
}
