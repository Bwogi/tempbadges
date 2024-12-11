import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "semantic-ui-css/semantic.min.css";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import MenuBar from './components/MenuBar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Management",
  description: "Manage employees with Next.js and Semantic UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full bg-gray-50">
        <body className={`${inter.className} h-full`}>
          <div className="min-h-full">
            <MenuBar />
            <main className="py-10">
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
