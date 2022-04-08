export default definePreset({
	name: 'laravel:jetstream-inertia-vite',
	options: {

	},
	handler: async() => {
        await installPackages({
            title: 'Installing node packages',
            for: 'node',
            packages: [
                'vite',
                '@vitejs/plugin-vue',
                'unplugin-vue-components',
                'unplugin-icons',
                '@inertiajs/progress',
                'postcss-import',
            ],
            dev: true,
        })

        await extractTemplates({
            title: 'Extracting template',
            from: 'default'
        })

        await executeCommand({
            title: 'Uninstalling laravel-mix package',
            command: 'npm',
            arguments: ['remove', 'laravel-mix']
        })

        await deletePaths({
            title: 'Deleting unnecessary file',
            paths: [
                'webpack.mix.js',
                'resources/js/bootstrap.js',
            ]
        })

        await editFiles({
            title: 'Install @vite directive',
            files: 'app/Providers/AppServiceProvider.php',
            operations: [
                {
                    type: 'add-line',
                    position: 'after',
                    match: /use Illuminate\\Support\\ServiceProvider;/,
                    lines: [
                        'use Illuminate\\Support\\Facades\\Blade;'
                    ]
                },
                {
                    type: 'remove-line',
                    match: /public function boot()/,
                    count: 2,
                    start: 1,
                },
                {
                    type: 'add-line',
                    position: 'after',
                    match: /public function boot()/,
                    indent: '    ',
                    lines: [
                        "{",
                        "    Blade::directive('vite', function ($expression) {",
                        "        if($expression === 'assets' || empty($expression)){",
                        "            return \\App\\Vite::assets();",
                        "        }",
                        "",
                        "        if($expression === 'css-only'){",
                        "            return \\App\\Vite::cssOnly();",
                        "        }",
                        "    });",
                    ]
                },
            ]
        })

        await editFiles({
            title: 'Install vite dev command at package.json',
            files: 'package.json',
            operations: [
                {
                    type: 'edit-json',
                    replace: (json) => ({
                        ...json,
                        scripts: {
                            "predev": "printf \"dev\" > public/hot",
                            "dev": "vite",
                            "preprod": "printf \"prod\" > public/hot",
                            "prod": "vite build"
                        }
                    })
                }
            ]
        })

        await editFiles({
            title: 'Add @vite at app.blade.php',
            files: 'resources/views/app.blade.php',
            operations: [
                {
                    type: 'remove-line',
                    match: /<script src="{{ mix\('js\/app\.js'\) }}" defer><\/script>/,
                    count: 1,
                    start: 0,
                },
                {
                    type: 'remove-line',
                    match: /<!-- Styles -->/,
                    count: 3,
                    start: -1,
                },
                {
                    type: 'remove-line',
                    match: /\@env \('local'\)/,
                    count: 4,
                    start: -1,
                },
                {
                    type: 'add-line',
                    match: /\@routes/,
                    position: 'after',
                    lines: [
                        "@vite",
                    ]
                }
            ]
        })
	},
})
