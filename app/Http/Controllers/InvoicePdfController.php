<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\PdfService;

class InvoicePdfController extends Controller
{
    /**
     * Download PDF for the invoice.
     */
    public function show(Invoice $invoice, PdfService $pdfService)
    {
        // Check if user can view this invoice
        if (!auth()->user()->isAdmin() && $invoice->user_id !== auth()->id()) {
            abort(403);
        }

        return $pdfService->downloadInvoicePdf($invoice);
    }
}