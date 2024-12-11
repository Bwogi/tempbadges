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
      <html lang="en">
        <body className={inter.className}>
          <MenuBar />
          <div style={{ 
            paddingTop: '6rem', 
            paddingBottom: '8rem',
            minHeight: '100vh'
          }}>
            {children}
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
