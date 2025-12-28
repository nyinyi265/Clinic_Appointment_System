<?php

namespace App\Console\Commands;

use Illuminate\Console\GeneratorCommand;

class MakeServiceCommand extends GeneratorCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:service {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new service class';
    public function getStub()
    {
        return __DIR__.'/stubs/service.stub';
    }
    public function getDefaultNamespace($rootNamespace)
    {
        return $rootNamespace.'\Services';
    }
    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        return parent::handle();
    }
}
