<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create an admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        // Create regular users
        $users = User::factory(5)->create();

        // Create invoices for each user
        foreach ($users->concat([$admin]) as $user) {
            $invoices = Invoice::factory(random_int(2, 8))->create([
                'user_id' => $user->id,
            ]);

            // Create items for each invoice
            foreach ($invoices as $invoice) {
                $itemCount = random_int(1, 5);
                $items = InvoiceItem::factory($itemCount)->create([
                    'invoice_id' => $invoice->id,
                ]);

                // Recalculate totals based on items
                $subtotal = (float) $items->sum('total');
                $taxAmount = $subtotal * ((float) $invoice->tax_rate / 100);
                $discountAmount = $subtotal * ((float) $invoice->discount_rate / 100);
                $total = $subtotal + $taxAmount - $discountAmount;

                $invoice->update([
                    'subtotal' => $subtotal,
                    'tax_amount' => $taxAmount,
                    'discount_amount' => $discountAmount,
                    'total' => $total,
                ]);
            }
        }
    }
}