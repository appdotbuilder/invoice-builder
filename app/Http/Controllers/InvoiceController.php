<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\PdfService;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices = Invoice::with(['user', 'items'])
            ->when(!auth()->user()->isAdmin(), function ($query) {
                return $query->where('user_id', auth()->id());
            })
            ->latest()
            ->paginate(10);
        
        return Inertia::render('invoices/index', [
            'invoices' => $invoices
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('invoices/create', [
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'today' => now()->format('Y-m-d')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        $validated = $request->validated();
        
        // Create invoice
        $invoice = Invoice::create([
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'user_id' => auth()->id(),
            'sender_name' => $validated['sender_name'],
            'sender_email' => $validated['sender_email'],
            'sender_phone' => $validated['sender_phone'] ?? null,
            'sender_address' => $validated['sender_address'],
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'] ?? null,
            'customer_phone' => $validated['customer_phone'] ?? null,
            'customer_address' => $validated['customer_address'],
            'invoice_date' => $validated['invoice_date'],
            'due_date' => $validated['due_date'],
            'tax_rate' => $validated['tax_rate'] ?? 0,
            'discount_rate' => $validated['discount_rate'] ?? 0,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Create invoice items
        foreach ($validated['items'] as $item) {
            $total = $item['quantity'] * $item['unit_price'];
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $total,
            ]);
        }

        // Calculate totals
        $invoice->load('items');
        $invoice->calculateTotals();
        $invoice->save();

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        // Check if user can view this invoice
        if (!auth()->user()->isAdmin() && $invoice->user_id !== auth()->id()) {
            abort(403);
        }

        $invoice->load(['user', 'items']);
        
        return Inertia::render('invoices/show', [
            'invoice' => $invoice
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        // Check if user can edit this invoice
        if (!auth()->user()->isAdmin() && $invoice->user_id !== auth()->id()) {
            abort(403);
        }

        $invoice->load('items');
        
        return Inertia::render('invoices/edit', [
            'invoice' => $invoice
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        // Check if user can update this invoice
        if (!auth()->user()->isAdmin() && $invoice->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validated();
        
        // Update invoice
        $invoice->update([
            'sender_name' => $validated['sender_name'],
            'sender_email' => $validated['sender_email'],
            'sender_phone' => $validated['sender_phone'] ?? null,
            'sender_address' => $validated['sender_address'],
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'] ?? null,
            'customer_phone' => $validated['customer_phone'] ?? null,
            'customer_address' => $validated['customer_address'],
            'invoice_date' => $validated['invoice_date'],
            'due_date' => $validated['due_date'],
            'tax_rate' => $validated['tax_rate'] ?? 0,
            'discount_rate' => $validated['discount_rate'] ?? 0,
            'notes' => $validated['notes'] ?? null,
            'status' => $validated['status'] ?? $invoice->status,
        ]);

        // Delete existing items and create new ones
        $invoice->items()->delete();
        foreach ($validated['items'] as $item) {
            $total = $item['quantity'] * $item['unit_price'];
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $total,
            ]);
        }

        // Calculate totals
        $invoice->load('items');
        $invoice->calculateTotals();
        $invoice->save();

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        // Check if user can delete this invoice
        if (!auth()->user()->isAdmin() && $invoice->user_id !== auth()->id()) {
            abort(403);
        }

        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }


}