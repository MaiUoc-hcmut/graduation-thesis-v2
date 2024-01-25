/* eslint-disable @next/next/no-sync-scripts */
export default function LearingLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <html lang="en">
            <body className="">
                {children}
            </body>

        </html>
    )
}
