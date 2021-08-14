<?php namespace Seblhaire\Tagsinput;

use Illuminate\Support\ServiceProvider;

class TagsinputServiceProvider extends ServiceProvider{
     protected $defer = true;
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
      $this->loadTranslationsFrom(__DIR__ . '/../resources/lang', 'tagsinput');
      $this->publishes([
          __DIR__ . '/../config/tagsinput.php' => config_path('tagsinput.php'),
          __DIR__ . '/../resources/lang' => resource_path('lang/vendor/tagsinput'),
          __DIR__ . '/../resources/js/tagsinput.js' => resource_path('js/vendor/seblhaire/tagsinput/tagsinput.js'),
          __DIR__ . '/../resources/css/tagsinput.scss' => resource_path('sass/vendor/seblhaire/tagsinput/tagsinput.scss')
      ]);
    }

    /**
     * Register the application services.
     *
     * @return void
     */

    public function register()
    {
      $this->mergeConfigFrom(__DIR__ . '/../config/tagsinput.php', 'tagsinput');
      $this->app->singleton('TagsinputService', function ($app) {
        return new TagsinputService();
      });
    }

    public function provides() {
        return [TagsinputServiceContract::class];
    }
}
