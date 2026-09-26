import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: 'Sign In | CORE X FITNESS',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#050607] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-core-red selection:text-white">
      
      {/* Premium Glass-inspired Container */}
      <div className="w-full max-w-6xl h-auto min-h-[600px] lg:h-[700px] bg-[#0A0D14] border border-white/5 rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-[0_40px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(255,42,42,0.06)] relative z-10 animate-fade-in-up opacity-0">
        
        {/* LEFT SIDE: Authenticaton Panel */}
        <div className="w-full lg:w-[55%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden bg-gradient-to-b from-[#0A0D14] to-[#050607]">
          
          {/* Subtle background red glow */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-core-red/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Header Section */}
          <div className="w-full max-w-md mx-auto mb-8 animate-slide-in-left opacity-0" style={{ animationDelay: '0.1s' }}>
            <Link href="/" className="inline-block group mb-10 transition-transform hover:-translate-x-1 duration-300">
               <div className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-mono font-bold uppercase tracking-widest">
                 <ArrowLeft className="w-4 h-4" />
                 <span>Back to Website</span>
               </div>
            </Link>

            <Image
              src="/gymlogo1.png"
              alt="CORE X FITNESS"
              width={160}
              height={48}
              className="w-32 sm:w-40 h-auto object-contain mb-6"
            />
            
            <div className="space-y-2">
              <div className="inline-block px-2 py-1 rounded bg-core-red/10 border border-core-red/20 text-core-red text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-2">
                Admin Access
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-400 text-sm font-sans">
                Enter your credentials to access the internal operating system.
              </p>
            </div>
          </div>

          {/* Clerk SignIn Component wrapper */}
          <div className="w-full max-w-md mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
            <SignIn 
              appearance={{
                layout: {
                  socialButtonsPlacement: "bottom",
                  socialButtonsVariant: "blockButton",
                },
                elements: {
                  rootBox: "w-full",
                  cardBox: "w-full shadow-none bg-transparent border-none p-0",
                  card: "w-full shadow-none bg-transparent border-none p-0",
                  header: "hidden", 
                  footer: "hidden",
                  formFieldInput: "bg-[#0D1117]/80 border border-white/10 text-white rounded-xl focus:border-core-red focus:ring-1 focus:ring-core-red/50 transition-all shadow-inner py-3",
                  formFieldLabel: "text-slate-400 text-xs font-bold uppercase tracking-wider font-mono",
                  formButtonPrimary: "bg-red-gradient text-white font-heading uppercase tracking-widest font-bold py-3.5 rounded-xl border border-core-red/50 hover:bg-core-red transition-all shadow-glow-red mt-2",
                  dividerRow: "hidden",
                  socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl py-3 transition-colors",
                  socialButtonsBlockButtonText: "font-sans font-semibold text-sm",
                  identityPreview: "bg-[#0D1117] border border-white/10 rounded-xl p-3 mb-4",
                  identityPreviewText: "text-white font-sans",
                  identityPreviewEditButtonIcon: "text-core-red",
                  formResendCodeLink: "text-core-red hover:text-white transition-colors",
                }
              }}
            />
          </div>

        </div>

        {/* RIGHT SIDE: Visual Panel */}
        <div className="w-full lg:w-[45%] h-64 lg:h-auto relative hidden sm:block overflow-hidden animate-slide-in-right opacity-0" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-core-red/10 mix-blend-overlay z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A0D14]/90 z-10" />
          
          <Image
            src="/admin_auth_side_visual.jpg"
            alt="Core X Fitness Athletic Visual"
            fill
            className="object-cover object-center scale-105 hover:scale-110 transition-transform duration-[10s] ease-out"
            priority
          />
          
          <div className="absolute bottom-8 right-8 z-20 text-right">
            <span className="text-[10px] font-mono text-white/50 tracking-[0.3em] uppercase block mb-1">
              Core X Kolkata
            </span>
            <span className="text-xs font-heading text-white/80 tracking-widest font-bold uppercase">
              Performance Lab
            </span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
