import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/components/app-layout';
import { Head } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
    title?: string;
    actions?: React.ReactNode;
}

export function AppShell({ children, variant = 'header', title, actions }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    if (variant === 'sidebar') {
        return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
    }

    const breadcrumbs = title ? [{ title, href: '#' }] : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {title && <Head title={title} />}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {(title || actions) && (
                    <div className="flex justify-between items-center">
                        {title && <h1 className="text-2xl font-bold">{title}</h1>}
                        {actions && <div className="flex gap-2">{actions}</div>}
                    </div>
                )}
                {children}
            </div>
        </AppLayout>
    );
}
