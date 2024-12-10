import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "semantic-ui-css/semantic.min.css";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

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
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-slate-500 hover:bg-slate-400',
          footerActionLink: 'text-slate-500 hover:text-slate-400',
          card: 'bg-white shadow-xl rounded-xl',
          modalBackdrop: 'backdrop-blur-sm',
          modalContent: 'shadow-xl rounded-xl',
          formFieldInput: 'rounded border-gray-300',
          avatarBox: 'w-10 h-10',
          userButtonPopoverCard: 'bg-white shadow-xl rounded-xl p-2',
          userButtonPopoverActionButton: 'text-slate-900 hover:text-slate-700',
        },
        layout: {
          socialButtonsVariant: 'iconButton',
          socialButtonsPlacement: 'bottom',
          shimmer: true,
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <div className="auth-buttons">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
