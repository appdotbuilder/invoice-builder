import React from 'react';
import { Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Invoice {
    id: number;
    invoice_number: string;
    customer_name: string;
    total: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    invoice_date: string;
    due_date: string;
    created_at: string;
}

interface Props {
    invoices: {
        data: Invoice[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    [key: string]: unknown;
}

const statusConfig = {
    draft: { label: 'Draft', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
    sent: { label: 'Sent', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
    paid: { label: 'Paid', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
    overdue: { label: 'Overdue', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
};

export default function InvoiceIndex({ invoices }: Props) {
    const handleDownloadPDF = (invoiceId: number) => {
        window.open(`/invoices/${invoiceId}/pdf`, '_blank');
    };

    const handleDelete = (invoiceId: number) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            router.delete(`/invoices/${invoiceId}`);
        }
    };

    return (
        <AppShell
            title="Invoices"
            actions={
                <Link href="/invoices/create">
                    <Button>
                        <span className="mr-2">➕</span>
                        Create Invoice
                    </Button>
                </Link>
            }
        >
            {invoices.data.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-16">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-2xl font-semibold mb-2">No invoices yet</h3>
                        <p className="text-gray-600 mb-6">
                            Create your first invoice to get started with professional billing.
                        </p>
                        <Link href="/invoices/create">
                            <Button>
                                <span className="mr-2">➕</span>
                                Create Your First Invoice
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Total Invoices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{invoices.total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Draft</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-600">
                                    {invoices.data.filter(inv => inv.status === 'draft').length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Sent</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {invoices.data.filter(inv => inv.status === 'sent').length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Paid</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {invoices.data.filter(inv => inv.status === 'paid').length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Invoices Table */}
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Invoice Date</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.data.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/invoices/${invoice.id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {invoice.invoice_number}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{invoice.customer_name}</TableCell>
                                        <TableCell className="font-semibold">
                                            ${parseFloat(invoice.total).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={statusConfig[invoice.status].variant}
                                                className={statusConfig[invoice.status].color}
                                            >
                                                {statusConfig[invoice.status].label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(invoice.invoice_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(invoice.due_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        ⋯
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/invoices/${invoice.id}`}>
                                                            👁️ View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/invoices/${invoice.id}/edit`}>
                                                            ✏️ Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDownloadPDF(invoice.id)}
                                                    >
                                                        📄 Download PDF
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(invoice.id)}
                                                        className="text-red-600"
                                                    >
                                                        🗑️ Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Pagination */}
                    {invoices.last_page > 1 && (
                        <div className="flex justify-center space-x-2">
                            {invoices.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </AppShell>
    );
}