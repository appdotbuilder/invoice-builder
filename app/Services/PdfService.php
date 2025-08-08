<?php

namespace App\Services;

use App\Models\Invoice;
use Illuminate\Http\Response;

class PdfService
{
    /**
     * Generate PDF for an invoice.
     */
    public function generateInvoicePdf(Invoice $invoice): Response
    {
        $invoice->load(['user', 'items']);
        
        // For now, return the HTML view as response
        // In a real implementation, you would use a PDF library like DomPDF or wkhtmltopdf
        $html = view('invoices.pdf', compact('invoice'))->render();
        
        return response($html, 200, [
            'Content-Type' => 'text/html',
            'Content-Disposition' => 'inline; filename="invoice-' . $invoice->invoice_number . '.html"'
        ]);
    }
    
    /**
     * Generate PDF download for an invoice.
     */
    public function downloadInvoicePdf(Invoice $invoice): Response
    {
        $invoice->load(['user', 'items']);
        
        // Mock PDF generation - in real implementation, use DomPDF
        $html = view('invoices.pdf', compact('invoice'))->render();
        
        return response($html, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="invoice-' . $invoice->invoice_number . '.pdf"'
        ]);
    }
}