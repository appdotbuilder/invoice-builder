<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $invoiceDate = $this->faker->dateTimeBetween('-6 months', 'now');
        $dueDate = clone $invoiceDate;
        $dueDate->modify('+30 days');

        $subtotal = $this->faker->numberBetween(100, 5000);
        $taxRate = $this->faker->randomFloat(2, 0, 25);
        $discountRate = $this->faker->randomFloat(2, 0, 10);
        
        $taxAmount = $subtotal * ($taxRate / 100);
        $discountAmount = $subtotal * ($discountRate / 100);
        $total = $subtotal + $taxAmount - $discountAmount;

        return [
            'invoice_number' => 'INV-' . str_pad((string) $this->faker->unique()->numberBetween(1, 999999), 6, '0', STR_PAD_LEFT),
            'user_id' => User::factory(),
            'sender_name' => $this->faker->company(),
            'sender_email' => $this->faker->companyEmail(),
            'sender_phone' => $this->faker->phoneNumber(),
            'sender_address' => $this->faker->address(),
            'customer_name' => $this->faker->company(),
            'customer_email' => $this->faker->companyEmail(),
            'customer_phone' => $this->faker->phoneNumber(),
            'customer_address' => $this->faker->address(),
            'invoice_date' => $invoiceDate,
            'due_date' => $dueDate,
            'subtotal' => $subtotal,
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'discount_rate' => $discountRate,
            'discount_amount' => $discountAmount,
            'total' => $total,
            'notes' => $this->faker->optional()->paragraph(),
            'status' => $this->faker->randomElement(['draft', 'sent', 'paid', 'overdue']),
        ];
    }

    /**
     * Indicate that the invoice is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    /**
     * Indicate that the invoice is sent.
     */
    public function sent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
        ]);
    }

    /**
     * Indicate that the invoice is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
        ]);
    }

    /**
     * Indicate that the invoice is overdue.
     */
    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'overdue',
            'due_date' => $this->faker->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }
}