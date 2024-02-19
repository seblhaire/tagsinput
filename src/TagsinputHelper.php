<?php

namespace Seblhaire\Tagsinput;

use Illuminate\Support\Facades\Facade;

class TagsinputHelper extends Facade {

    protected static function getFacadeAccessor() {
        return 'TagsinputService';
    }
}
