import React from 'react';
import { useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface InvoiceItem {
    description: string;
    quantity: number;
    unit_price: number;
}

interface Props {
    invoice_number: string;
    today: string;
    [key: string]: unknown;
}

export default function CreateInvoice({ invoice_number, today }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        sender_name: '',
        sender_email: '',
        sender_phone: '',
        sender_address: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        invoice_date: today,
        due_date: '',
        tax_rate: 0,
        discount_rate: 0,
        notes: '',
        items: [{ description: '', quantity: 1, unit_price: 0 }],
    });

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index: number) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * (data.tax_rate / 100);
    };

    const calculateDiscount = () => {
        return calculateSubtotal() * (data.discount_rate / 100);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() - calculateDiscount();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/invoices');
    };

    return (
        <AppShell title="Create Invoice">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Invoice Header */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📄 Invoice Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Invoice Number</Label>
                                <Input value={invoice_number} disabled className="bg-gray-50" />
                            </div>
                            <div>
                                <Label htmlFor="invoice_date">Invoice Date *</Label>
                                <Input
                                    id="invoice_date"
                                    type="date"
                                    value={data.invoice_date}
                                    onChange={(e) => setData('invoice_date', e.target.value)}
                                    required
                                />
                                {errors.invoice_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.invoice_date}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="due_date">Due Date *</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                required
                            />
                            {errors.due_date && (
                                <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Sender Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                👤 From (Sender)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="sender_name">Name *</Label>
                                <Input
                                    id="sender_name"
                                    value={data.sender_name}
                                    onChange={(e) => setData('sender_name', e.target.value)}
                                    required
                                />
                                {errors.sender_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.sender_name}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="sender_email">Email *</Label>
                                <Input
                                    id="sender_email"
                                    type="email"
                                    value={data.sender_email}
                                    onChange={(e) => setData('sender_email', e.target.value)}
                                    required
                                />
                                {errors.sender_email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.sender_email}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="sender_phone">Phone</Label>
                                <Input
                                    id="sender_phone"
                                    value={data.sender_phone}
                                    onChange={(e) => setData('sender_phone', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="sender_address">Address *</Label>
                                <Textarea
                                    id="sender_address"
                                    value={data.sender_address}
                                    onChange={(e) => setData('sender_address', e.target.value)}
                                    required
                                    rows={3}
                                />
                                {errors.sender_address && (
                                    <p className="text-red-500 text-sm mt-1">{errors.sender_address}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🏢 Bill To (Customer)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="customer_name">Name *</Label>
                                <Input
                                    id="customer_name"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    required
                                />
                                {errors.customer_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="customer_email">Email</Label>
                                <Input
                                    id="customer_email"
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="customer_phone">Phone</Label>
                                <Input
                                    id="customer_phone"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="customer_address">Address *</Label>
                                <Textarea
                                    id="customer_address"
                                    value={data.customer_address}
                                    onChange={(e) => setData('customer_address', e.target.value)}
                                    required
                                    rows={3}
                                />
                                {errors.customer_address && (
                                    <p className="text-red-500 text-sm mt-1">{errors.customer_address}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoice Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                📋 Invoice Items
                            </span>
                            <Button type="button" onClick={addItem} variant="outline" size="sm">
                                ➕ Add Item
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 p-4 border rounded-lg">
                                <div className="col-span-5">
                                    <Label>Description *</Label>
                                    <Input
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                        placeholder="Item description"
                                        required
                                    />
                                    {errors[`items.${index}.description` as keyof typeof errors] && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors[`items.${index}.description` as keyof typeof errors]}
                                        </p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <Label>Quantity *</Label>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Unit Price *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={item.unit_price}
                                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Total</Label>
                                    <Input
                                        value={`$${(item.quantity * item.unit_price).toFixed(2)}`}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div className="col-span-1 flex items-end">
                                    {data.items.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeItem(index)}
                                        >
                                            🗑️
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Tax and Discount */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            💰 Tax & Discount
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                                <Input
                                    id="tax_rate"
                                    type="number"
                                    step="0.01"
                                    value={data.tax_rate}
                                    onChange={(e) => setData('tax_rate', parseFloat(e.target.value) || 0)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div>
                                <Label htmlFor="discount_rate">Discount Rate (%)</Label>
                                <Input
                                    id="discount_rate"
                                    type="number"
                                    step="0.01"
                                    value={data.discount_rate}
                                    onChange={(e) => setData('discount_rate', parseFloat(e.target.value) || 0)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Invoice Totals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🧮 Invoice Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            {data.tax_rate > 0 && (
                                <div className="flex justify-between">
                                    <span>Tax ({data.tax_rate}%):</span>
                                    <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                                </div>
                            )}
                            {data.discount_rate > 0 && (
                                <div className="flex justify-between">
                                    <span>Discount ({data.discount_rate}%):</span>
                                    <span className="font-semibold text-red-600">-${calculateDiscount().toFixed(2)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📝 Additional Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Any additional notes or terms..."
                            rows={4}
                        />
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : '✨ Create Invoice'}
                    </Button>
                </div>
            </form>
        </AppShell>
    );
}