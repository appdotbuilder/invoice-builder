import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold text-gray-900 mb-6">
                        📄 Invoice Pro
                    </h1>
                    <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Professional invoice management made simple. Create, manage, and track your invoices with automatic numbering, PDF generation, and role-based access control.
                    </p>
                    
                    {auth?.user ? (
                        <Link href="/dashboard">
                            <Button size="lg" className="text-lg px-8 py-4">
                                🚀 Go to Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex gap-4 justify-center">
                            <Link href="/login">
                                <Button size="lg" className="text-lg px-8 py-4">
                                    🔑 Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                    ✨ Register
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">🔢</div>
                        <h3 className="text-xl font-semibold mb-3">Automatic Numbering</h3>
                        <p className="text-gray-600">
                            Sequential invoice numbers generated automatically with customizable format (INV-000001, INV-000002, etc.)
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">👥</div>
                        <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
                        <p className="text-gray-600">
                            Admin users can manage all invoices and users, while regular users can only access their own invoices
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold mb-3">Detailed Information</h3>
                        <p className="text-gray-600">
                            Comprehensive sender and customer details with support for multiple contact methods and addresses
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">💰</div>
                        <h3 className="text-xl font-semibold mb-3">Tax & Discount Support</h3>
                        <p className="text-gray-600">
                            Flexible tax rates and discount options with automatic calculations and professional formatting
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">📄</div>
                        <h3 className="text-xl font-semibold mb-3">PDF Generation</h3>
                        <p className="text-gray-600">
                            Professional PDF invoices with modern design, ready for download and printing
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold mb-3">Status Tracking</h3>
                        <p className="text-gray-600">
                            Track invoice status from draft to paid, with visual indicators and organized filtering
                        </p>
                    </div>
                </div>

                {/* Demo Screenshots Mockup */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-8">
                        Professional Invoice Management
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white rounded-xl shadow-xl p-6">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg h-64 flex items-center justify-center text-white text-lg font-semibold">
                                📋 Invoice Creation Form
                                <br />
                                <span className="text-sm opacity-80">Dynamic item addition with real-time calculations</span>
                            </div>
                            <h4 className="text-lg font-semibold mt-4">Create & Edit Invoices</h4>
                            <p className="text-gray-600 text-sm mt-2">
                                Intuitive form with validation, dynamic item rows, and instant total calculations
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-xl p-6">
                            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg h-64 flex items-center justify-center text-white text-lg font-semibold">
                                📊 Invoice Dashboard
                                <br />
                                <span className="text-sm opacity-80">Overview with status filters and quick actions</span>
                            </div>
                            <h4 className="text-lg font-semibold mt-4">Dashboard Overview</h4>
                            <p className="text-gray-600 text-sm mt-2">
                                Complete invoice management with search, filters, and batch operations
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                {!auth?.user && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join thousands of professionals who trust Invoice Pro for their billing needs
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="text-lg px-8 py-4">
                                    🚀 Start Free Trial
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                    👤 Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}