import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | AI Chatbot',
  description: 'Sign in or create an account.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
      {/* Layer 1: Base Background */}
      <div className="bg-layer-1" />

      {/* Layer 2: Animated Gradient */}
      <div className="bg-layer-2" />

      {/* Layer 3: Glassmorphism / Particles (Simulated with subtle overlay) */}
      <div className="fixed inset-0 z-[-1] bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

      {/* Content */}
      <main className="relative z-10 w-full max-w-md animate-slide-up">
        {children}
      </main>
    </div>
  );
}
