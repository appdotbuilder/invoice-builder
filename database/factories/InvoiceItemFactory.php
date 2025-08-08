<?php

namespace Database\Factories;

use App\Models\InvoiceItem;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InvoiceItem>
 */
class InvoiceItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(1, 10);
        $unitPrice = $this->faker->randomFloat(2, 10, 500);
        $total = $quantity * $unitPrice;

        return [
            'invoice_id' => Invoice::factory(),
            'description' => $this->faker->randomElement([
                'Web Development Services',
                'Graphic Design Work',
                'Consulting Hours',
                'Software License',
                'Domain Registration',
                'Hosting Services',
                'SEO Optimization',
                'Content Writing',
                'Logo Design',
                'Database Setup',
                'API Integration',
                'Mobile App Development',
                'UI/UX Design',
                'Server Maintenance',
                'Security Audit',
            ]),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total' => $total,
        ];
    }
}