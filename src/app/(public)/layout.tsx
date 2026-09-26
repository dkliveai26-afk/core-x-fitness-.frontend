import { AuthModalProvider } from '@/context/AuthModalContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthModalProvider>
      <SmoothScrollProvider>
        <Navbar />
        <main className="flex-1 w-full flex flex-col">{children}</main>
        <Footer />
        <AuthModal />
      </SmoothScrollProvider>
    </AuthModalProvider>
  );
}
