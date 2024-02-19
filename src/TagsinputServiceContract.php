<?php

namespace Seblhaire\Tagsinput;

interface TagsinputServiceContract {

    public function init($divid, $label, $url, $optionsAc = [], $optionsTags = []);
}
