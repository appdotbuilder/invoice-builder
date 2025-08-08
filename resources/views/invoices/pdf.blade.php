<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        
        .header {
            border-bottom: 2px solid #3b82f6;
            margin-bottom: 30px;
            padding-bottom: 20px;
        }
        
        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #3b82f6;
            margin: 0;
        }
        
        .invoice-number {
            font-size: 18px;
            color: #666;
            margin-top: 5px;
        }
        
        .invoice-info {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        
        .sender, .customer {
            display: table-cell;
            width: 45%;
            vertical-align: top;
        }
        
        .customer {
            padding-left: 10%;
        }
        
        .info-title {
            font-weight: bold;
            font-size: 16px;
            color: #3b82f6;
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }
        
        .info-content {
            line-height: 1.6;
        }
        
        .dates {
            margin: 30px 0;
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 5px;
        }
        
        .dates table {
            width: 100%;
        }
        
        .dates td {
            padding: 5px 0;
        }
        
        .dates td:first-child {
            font-weight: bold;
            width: 150px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        
        .items-table th,
        .items-table td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
        }
        
        .items-table th {
            background-color: #3b82f6;
            color: white;
            font-weight: bold;
        }
        
        .items-table td:nth-child(2),
        .items-table td:nth-child(3),
        .items-table td:nth-child(4) {
            text-align: right;
        }
        
        .totals {
            margin-top: 30px;
            float: right;
            width: 300px;
        }
        
        .totals table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .totals td {
            padding: 8px 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .totals td:first-child {
            font-weight: bold;
        }
        
        .totals td:last-child {
            text-align: right;
        }
        
        .total-row {
            background-color: #3b82f6;
            color: white;
            font-weight: bold;
        }
        
        .notes {
            clear: both;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        
        .notes h3 {
            color: #3b82f6;
            margin-bottom: 10px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-draft {
            background-color: #fbbf24;
            color: #92400e;
        }
        
        .status-sent {
            background-color: #60a5fa;
            color: #1e40af;
        }
        
        .status-paid {
            background-color: #34d399;
            color: #065f46;
        }
        
        .status-overdue {
            background-color: #f87171;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="invoice-title">INVOICE</h1>
        <div class="invoice-number">{{ $invoice->invoice_number }}</div>
        <span class="status-badge status-{{ $invoice->status }}">{{ ucfirst($invoice->status) }}</span>
    </div>

    <div class="invoice-info">
        <div class="sender">
            <div class="info-title">From</div>
            <div class="info-content">
                <strong>{{ $invoice->sender_name }}</strong><br>
                {{ $invoice->sender_email }}<br>
                @if($invoice->sender_phone)
                    {{ $invoice->sender_phone }}<br>
                @endif
                {!! nl2br(e($invoice->sender_address)) !!}
            </div>
        </div>
        
        <div class="customer">
            <div class="info-title">Bill To</div>
            <div class="info-content">
                <strong>{{ $invoice->customer_name }}</strong><br>
                @if($invoice->customer_email)
                    {{ $invoice->customer_email }}<br>
                @endif
                @if($invoice->customer_phone)
                    {{ $invoice->customer_phone }}<br>
                @endif
                {!! nl2br(e($invoice->customer_address)) !!}
            </div>
        </div>
    </div>

    <div class="dates">
        <table>
            <tr>
                <td>Invoice Date:</td>
                <td>{{ $invoice->invoice_date->format('F j, Y') }}</td>
            </tr>
            <tr>
                <td>Due Date:</td>
                <td>{{ $invoice->due_date->format('F j, Y') }}</td>
            </tr>
        </table>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->unit_price, 2) }}</td>
                    <td>${{ number_format($item->total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal:</td>
                <td>${{ number_format($invoice->subtotal, 2) }}</td>
            </tr>
            @if($invoice->discount_rate > 0)
                <tr>
                    <td>Discount ({{ $invoice->discount_rate }}%):</td>
                    <td>-${{ number_format($invoice->discount_amount, 2) }}</td>
                </tr>
            @endif
            @if($invoice->tax_rate > 0)
                <tr>
                    <td>Tax ({{ $invoice->tax_rate }}%):</td>
                    <td>${{ number_format($invoice->tax_amount, 2) }}</td>
                </tr>
            @endif
            <tr class="total-row">
                <td>Total:</td>
                <td>${{ number_format($invoice->total, 2) }}</td>
            </tr>
        </table>
    </div>

    @if($invoice->notes)
        <div class="notes">
            <h3>Notes</h3>
            <p>{!! nl2br(e($invoice->notes)) !!}</p>
        </div>
    @endif
</body>
</html>