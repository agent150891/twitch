<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PagesController extends Controller
{
    public function main()
    {
        return view('pages.main');
    }

    public function games()
    {
        return view('pages.games');
    }

    public function game($gameName)
    {
        return view('pages.game', ['gameName'   => $gameName]);
    }

    public function watchStream($streamName)
    {
        return view('pages.watchStream', ['streamName'   => $streamName]);
    }

    public function allPrizes()
    {
        return view('pages.allPrizes');
    }
}
