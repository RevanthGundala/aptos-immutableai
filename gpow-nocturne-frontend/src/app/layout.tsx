import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Header from "@/components/header";
import SubstrateNodeProvider from "@/providers/substrate-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Immutable AI Labs",
  description: "Immutable AI Labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" reverseOrder={false} containerStyle={{
          top: 100
        }} />
        <SubstrateNodeProvider>
          <Header />
          {children}
        </SubstrateNodeProvider>
      </body>
    </html>
  );
}