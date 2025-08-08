import React from 'react';
import { AppHeader } from './app-header';
import { AppContent } from './app-content';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider } from './ui/sidebar';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    variant?: 'header' | 'sidebar';
}

export default function AppLayout({ children, breadcrumbs = [], variant = 'sidebar' }: AppLayoutProps) {
    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                <AppHeader />
                <AppContent variant="header">
                    {children}
                </AppContent>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </SidebarProvider>
    );
}