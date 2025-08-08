<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Invoice
 *
 * @property int $id
 * @property string $invoice_number
 * @property int $user_id
 * @property string $sender_name
 * @property string $sender_email
 * @property string|null $sender_phone
 * @property string $sender_address
 * @property string $customer_name
 * @property string|null $customer_email
 * @property string|null $customer_phone
 * @property string $customer_address
 * @property string $invoice_date
 * @property string $due_date
 * @property float $subtotal
 * @property float $tax_rate
 * @property float $tax_amount
 * @property float $discount_rate
 * @property float $discount_amount
 * @property float $total
 * @property string|null $notes
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\InvoiceItem> $items
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice query()
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereCustomerAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereCustomerEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereCustomerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereCustomerPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereDiscountAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereDiscountRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereInvoiceDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereInvoiceNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereSenderAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereSenderEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereSenderName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereSenderPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereSubtotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereTaxRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereUserId($value)
 * @method static \Database\Factories\InvoiceFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Invoice extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'invoice_number',
        'user_id',
        'sender_name',
        'sender_email',
        'sender_phone',
        'sender_address',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'invoice_date',
        'due_date',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'discount_rate',
        'discount_amount',
        'total',
        'notes',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'invoice_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_rate' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the invoice.
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the invoice.
     */
    public function items(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    /**
     * Generate the next invoice number.
     */
    public static function generateInvoiceNumber(): string
    {
        $lastInvoice = self::orderBy('id', 'desc')->first();
        $number = $lastInvoice ? (int) substr($lastInvoice->invoice_number, 4) + 1 : 1;
        return 'INV-' . str_pad((string) $number, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Calculate totals based on items.
     */
    public function calculateTotals(): void
    {
        $subtotal = (float) $this->items->sum('total');
        $taxRate = (float) $this->tax_rate;
        $discountRate = (float) $this->discount_rate;
        
        $this->subtotal = $subtotal;
        $this->tax_amount = $subtotal * ($taxRate / 100);
        $this->discount_amount = $subtotal * ($discountRate / 100);
        $this->total = $subtotal + (float) $this->tax_amount - (float) $this->discount_amount;
    }
}