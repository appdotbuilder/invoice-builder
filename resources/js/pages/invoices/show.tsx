import React from 'react';
import { Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unit_price: string;
    total: string;
}

interface Invoice {
    id: number;
    invoice_number: string;
    user_id: number;
    sender_name: string;
    sender_email: string;
    sender_phone: string | null;
    sender_address: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string | null;
    customer_address: string;
    invoice_date: string;
    due_date: string;
    subtotal: string;
    tax_rate: string;
    tax_amount: string;
    discount_rate: string;
    discount_amount: string;
    total: string;
    notes: string | null;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    items: InvoiceItem[];
}

interface Props {
    invoice: Invoice;
    [key: string]: unknown;
}

const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    sent: { label: 'Sent', color: 'bg-blue-100 text-blue-800' },
    paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
    overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800' },
};

export default function ShowInvoice({ invoice }: Props) {
    const handleDownloadPDF = () => {
        window.open(`/invoices/${invoice.id}/pdf`, '_blank');
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            router.delete(`/invoices/${invoice.id}`);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppShell
            title={`Invoice ${invoice.invoice_number}`}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        🖨️ Print
                    </Button>
                    <Button variant="outline" onClick={handleDownloadPDF}>
                        📄 Download PDF
                    </Button>
                    <Link href={`/invoices/${invoice.id}/edit`}>
                        <Button variant="outline">
                            ✏️ Edit
                        </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleDelete}>
                        🗑️ Delete
                    </Button>
                </div>
            }
        >
            <div className="print:shadow-none print:border-none" id="invoice-content">
                {/* Invoice Header */}
                <Card className="mb-8">
                    <CardHeader className="text-center border-b-2 border-blue-600 pb-6">
                        <CardTitle className="text-4xl font-bold text-blue-600">
                            INVOICE
                        </CardTitle>
                        <div className="text-xl text-gray-600 mt-2">
                            {invoice.invoice_number}
                        </div>
                        <Badge className={statusConfig[invoice.status].color}>
                            {statusConfig[invoice.status].label}
                        </Badge>
                    </CardHeader>
                </Card>

                {/* Invoice Info */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-blue-600 border-b border-gray-200 pb-2">
                                👤 From
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="font-bold">{invoice.sender_name}</div>
                            <div>{invoice.sender_email}</div>
                            {invoice.sender_phone && <div>{invoice.sender_phone}</div>}
                            <div className="whitespace-pre-line">{invoice.sender_address}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-blue-600 border-b border-gray-200 pb-2">
                                🏢 Bill To
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="font-bold">{invoice.customer_name}</div>
                            {invoice.customer_email && <div>{invoice.customer_email}</div>}
                            {invoice.customer_phone && <div>{invoice.customer_phone}</div>}
                            <div className="whitespace-pre-line">{invoice.customer_address}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Dates */}
                <Card className="mb-8 bg-gray-50">
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <span className="font-bold">Invoice Date: </span>
                                {new Date(invoice.invoice_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div>
                                <span className="font-bold">Due Date: </span>
                                {new Date(invoice.due_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Items Table */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>📋 Invoice Items</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-600 text-white">
                                    <tr>
                                        <th className="text-left py-4 px-6">Description</th>
                                        <th className="text-right py-4 px-6">Quantity</th>
                                        <th className="text-right py-4 px-6">Unit Price</th>
                                        <th className="text-right py-4 px-6">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-200">
                                            <td className="py-4 px-6">{item.description}</td>
                                            <td className="text-right py-4 px-6">{item.quantity}</td>
                                            <td className="text-right py-4 px-6">
                                                ${parseFloat(item.unit_price).toFixed(2)}
                                            </td>
                                            <td className="text-right py-4 px-6 font-semibold">
                                                ${parseFloat(item.total).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-0">
                            <div className="space-y-3 p-6">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">
                                        ${parseFloat(invoice.subtotal).toFixed(2)}
                                    </span>
                                </div>
                                {parseFloat(invoice.discount_rate) > 0 && (
                                    <div className="flex justify-between">
                                        <span>Discount ({parseFloat(invoice.discount_rate).toFixed(1)}%):</span>
                                        <span className="font-semibold text-red-600">
                                            -${parseFloat(invoice.discount_amount).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {parseFloat(invoice.tax_rate) > 0 && (
                                    <div className="flex justify-between">
                                        <span>Tax ({parseFloat(invoice.tax_rate).toFixed(1)}%):</span>
                                        <span className="font-semibold">
                                            ${parseFloat(invoice.tax_amount).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between text-lg font-bold bg-blue-600 text-white p-4 -m-6 mt-3">
                                    <span>Total:</span>
                                    <span>${parseFloat(invoice.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notes */}
                {invoice.notes && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-blue-600">📝 Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-line">{invoice.notes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #invoice-content,
                    #invoice-content * {
                        visibility: visible;
                    }
                    #invoice-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:border-none {
                        border: none !important;
                    }
                }
            `}</style>
        </AppShell>
    );
}