import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Redirect Chain Tester",
    description:
        "Test and visualize the complete redirect chain for any URL with device simulation. Similar to wheregoes.com but with enhanced device simulation capabilities.",
    keywords: ["redirect", "redirect chain", "redirect tester", "URL tester", "redirect checker", "SEO tools"],
    authors: [{ name: "Redirect Tester" }],
    icons: {
        icon: "/favicon.svg",
    },
    openGraph: {
        title: "Redirect Chain Tester",
        description: "Test and visualize the complete redirect chain for any URL",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
        </html>
    );
}
