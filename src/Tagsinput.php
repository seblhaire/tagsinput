<?php namespace Seblhaire\Tagsinput;

use Seblhaire\Autocompleter\Autocompleter;

class Tagsinput{
  protected $divid;
  protected $ac_id;
  protected $options_ac;
  protected $options_tags;
  protected $ac;
  protected $ulid;
  protected $addbtnid;
  protected $addAcCallback = false;

	public function __construct($divid, $label, $url, $optionsAc = [], $optionsTags = []){
		$this->divid = $divid;
    $this->ac_id = $this->divid . '_ac';
    $this->ulid = $this->divid . '_taglist';
    $this->addbtnid = $this->divid . '_addbtn';
    $optionsAc['helptext'] = '';
		$this->options_ac = array_merge(config('autocompleter'), $optionsAc);
		$this->options_tags = array_merge(config('tagsinput'), $optionsTags);
    if (is_null($this->options_ac['callback'])){
      $this->options_ac['callback'] = $this->divid . '_ac_callback';
      $this->addAcCallback = true;
    }
    $this->ac = new Autocompleter($this->ac_id, $label, $url, $this->options_ac);
	}

	public function output(){
    $str = '<div id="' . $this->divid . '" class="' . $this->options_tags['maindivclass'] . '">' . PHP_EOL;
    $str .= $this->printLabel();
    $str .= $this->printAutocompleter();
    $str .= $this->printTagList();
    $str .= $this->printHiddenInput();
    $str .= $this->printHelpText();
    $str .= '</div>' . PHP_EOL . '<script type="text/javascript">' . PHP_EOL;
    $str .= $this->printAcCallback();
    $str .= ' jQuery(document).ready(function() {' . PHP_EOL;
    $str .=  $this->printTagInputInit();
    $str .= ' });' . PHP_EOL .'</script>' . PHP_EOL;
    return $str;
	}

  public function printHiddenInput(){
    if ($this->options_tags['hiddeninput']){
      return '<input type="hidden" id="' . $this->divid . '-result" name="' . $this->divid . '-result" value="" />'. PHP_EOL;
    }
  }
  public function printLabel(){
    $str = '  <div class="' . $this->options_tags['divlabelclass'] . '">' . PHP_EOL;
    $str .= $this->ac->printLabel();
    $str .= '</div>' . PHP_EOL;
    return $str;
  }

  public function printAutocompleter(){
    $str = '  <div class="' . $this->options_tags['divacclass'] . '">' . PHP_EOL;
    if ($this->options_tags['showaddbutton']){
      $str .= '<div class="' . $this->options_tags['inputcontainerclass'] . '">' . PHP_EOL . $this->ac->printInput();
      $str .= '<div class="' . $this->options_tags['addbuttoncontainerclass'] . '">' . PHP_EOL;
      $str .= '<button id="' . $this->addbtnid .'" class="' . $this->options_tags['addbuttonclass'] . '" type="button">';
      $str .= '<i class="' . $this->options_tags['buttonlabelclass'] . '"></i></button>' . PHP_EOL;
      $str .= '</div>' . PHP_EOL;
      $str .= '</div>'. PHP_EOL;
    }else{
      $str .= $this->ac->printInput();
    }
    if (strlen($this->options_tags['invalid-feedback']) > 0){
      $str .= '<div class="invalid-feedback">' . $this->translateOrPrint($this->options_tags['invalid-feedback']) . '</div>' . PHP_EOL;
    }
    if (strlen($this->options_tags['valid-feedback']) > 0){
      $str .= '<div class="valid-feedback">' . $this->translateOrPrint($this->options_tags['valid-feedback']) . '</div>' . PHP_EOL;
    }
    $str .= $this->ac->printResultDiv() .'  </div>' . PHP_EOL;
    //$str .= $this->ac->printResultDiv();
    return $str;
  }

  public function printTagList(){
    $str = '  <div class="' . $this->options_tags['divtaglist'] . '">' . PHP_EOL;
    $str .= '    <ul id="' . $this->ulid . '" class="' . $this->options_tags['taglistclass'] . '">' . PHP_EOL;
    $str .= '    </ul>' . PHP_EOL;
    $str .= '  </div>' . PHP_EOL;
    return $str;
  }

  public function printAcCallback(){
    $str = '';
    if ($this->addAcCallback){
      $str .= '  var ' . $this->options_ac['callback'] . ' = function(data){' . PHP_EOL;
      $str .= '    jQuery(\'#' . $this->divid . '\').data(\'tagsinput\').addtolist(data);' . PHP_EOL;
      $str .= '  }' . PHP_EOL;
    }
    return $str;
  }

  public function printTagInputInit(){
    $str = $this->ac->printJsInit();
    $str .= '   jQuery(\'#' . $this->divid  . '\').tagsinput({'. PHP_EOL;
    $str .= '     checkunicity : ' . ($this->options_tags['checkunicity'] ? 'true,': 'false,') . PHP_EOL;
    $str .= '     field : \'' . $this->options_tags['field'] . '\',' . PHP_EOL;
    $str .= '     tagclass : \'' . $this->options_tags['tagclass'] . '\',' . PHP_EOL;
    $str .= '     taglabelelement : \'' . $this->options_tags['taglabelelement'] . '\',' . PHP_EOL;
    $str .= '     tagclasselement : \'' . $this->options_tags['tagclasselement'] . '\',' . PHP_EOL;
    $str .= '     tagremovebtnclass : \'' . $this->options_tags['tagremovebtnclass'] . '\',' . PHP_EOL;
    if (!is_null($this->options_tags['tagaddcallback'])){
      $str .= '     tagaddcallback: ' .$this->options_tags['tagaddcallback'] . ',' . PHP_EOL;
    }
    if (!is_null($this->options_tags['tagremovecallback'])){
      $str .= '     tagremovecallback: ' . $this->options_tags['tagremovecallback'] . "," .PHP_EOL;
    }
    $str .= '     hiddeninput: ' . ($this->options_tags['hiddeninput'] ? 'true,': 'false,') . PHP_EOL;
    $str .= '   });' . PHP_EOL;
    return $str;
  }

  public function printReset(){
    return 'jQuery(\'#' . $this->divid  . '\').data(\'tagsinput\').reset()';
  }

  public function printCount(){
    return 'jQuery(\'#' . $this->divid  . '\').data(\'tagsinput\').count()';
  }

  public function printGetArrayValues(){
    return 'jQuery(\'#' . $this->divid  . '\').data(\'tagsinput\').getArrayValues()';
  }

  public function printGetCommaSepValues(){
    return 'jQuery(\'#' . $this->divid  . '\').data(\'tagsinput\').getCommaSepValues()';
  }

  public function printSerialize($champ){
    return 'jQuery(\'#' . $this->divid  . '\').data(\'tagsinput\').serialize(\'' . $champ . '\')';
  }

  public function printAddToList($varia){
    return 'jQuery(\'#' . $this->divid  . '\').data(\'tagsinput\').addtolist(' . $varia . ')';
  }

  public function printHelpText(){
    if ($this->options_tags['helptext'] != ''){
      return '<p class="' . $this->options_tags['helptextclass'] . '">' . $this->translateOrPrint($this->options_tags['helptext']) . '</p>' . PHP_EOL;
    }
  }

	public function __toString(){
      return $this->output();
  }

  /**
   * returns a string or passes translation key to translation function
   *
   * @param string $key
   *            normal string or translation key surrounded by #
   * @return string text to display
   */
  private function translateOrPrint($key)
  {
      if (preg_match('/^\#(.+)\#$/', $key, $matches)) {
          return __($matches[1]);
      }
      return $key;
  }
}
