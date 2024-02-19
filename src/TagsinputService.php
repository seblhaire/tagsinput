<?php

namespace Seblhaire\Tagsinput;

class TagsinputService implements TagsinputServiceContract {

    public static $instances = [];

    public function init($divid, $label, $url, $optionsAc = [], $optionsTags = []) {
        self::$instances[$divid] = new Tagsinput($divid, $label, $url, $optionsAc, $optionsTags);
        return self::$instances[$divid];
    }

    public function getTagElement($tagElement = '') {
        if ($tagElement == '') {
            return reset(self::$instances);
        }
        return self::$instances[$tagElement];
    }
}
