"use client";
import "@/styles/teacher/index.css";
// import "./data-tables-css.css";
// import "@/styles/teacher/satoshi.css";

import { ReduxProvider } from '@/redux/provider';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <ReduxProvider>
                    {children}
                </ReduxProvider>
            </body>
        </html>
    );
}
