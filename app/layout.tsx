import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Provider from "@/trpc/provider";
import ReduxProvider from "@/components/providers/redux-provider";
import ModalProvider from "@/components/providers/modal-provider";
import ChatProvider from "@/components/providers/chat-provider";

const inter = Inter({
  subsets: ["latin"],
  fallback: ["Segoe UI", "Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Intelli-Note",
  description: "A colleborative workspace where better, faster work happens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="Note-theme"
          >
            <Toaster position="top-right" />
            <Provider>
              <ReduxProvider>
                <ChatProvider>
                  <ModalProvider />
                  {children}
                </ChatProvider>
              </ReduxProvider>
            </Provider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
