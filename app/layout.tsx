import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Sentinel | Monitor",
    description: "Enterprise grade infrastructure monitoring",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body className={`${inter.className} bg-neutral-950 text-neutral-200 antialiased selection:bg-indigo-500/30`}>
        {children}
        </body>
        </html>
    );
}