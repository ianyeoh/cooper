import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import Providers from '@/app/providers';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'budgeting - Custom expense tracking solution',
  description: 'Custom expense tracking solution',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-background text-foreground font-sans antialiased'>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
