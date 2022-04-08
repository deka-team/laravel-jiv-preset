<?php
namespace App;

use Illuminate\Support\HtmlString;

class Vite
{
    static public function assets(): HtmlString
    {
        $devServerIsRunning = false;

        if (app()->environment('local')) {
            try {
                $devServerIsRunning = file_get_contents(public_path('hot')) == 'dev';
            } catch (\Exception) {
            }
        }

        if ($devServerIsRunning) {
            return new HtmlString(<<<HTML
                <script type="module" src="http://localhost:3000/@vite/client"></script>
                <script type="module" src="http://localhost:3000/resources/js/app.js"></script>
            HTML);
        }

        $manifest = json_decode(file_get_contents(
            public_path('dist/manifest.json')
        ), true);

        return new HtmlString(<<<HTML
            <script type="module" src="/dist/{$manifest['resources/js/app.js']['file']}"></script>
            <link rel="stylesheet" href="/dist/{$manifest['resources/js/app.js']['css'][0]}">
        HTML);
    }

    static public function cssOnly(): HtmlString
    {
        $manifest = json_decode(file_get_contents(
            public_path('dist/manifest.json')
        ), true);

        return new HtmlString(<<<HTML
            <link rel="stylesheet" href="/dist/{$manifest['resources/js/app.js']['css'][0]}">
        HTML);
    }
}
