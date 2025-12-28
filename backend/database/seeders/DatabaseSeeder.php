<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            RoleSeeder::class,
        ]);

        $user = User::create([
            'first_name' => 'System',
            'last_name' => 'Admin',
            'phone_number' => '0000000000',
            'email' => 'system.admin@example.com',
            'password' => bcrypt('SystemAdmin123'),
        ]);
        $user->assignRole('admin');
    }
}
