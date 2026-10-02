import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

export const metadata = {
  title: 'Sign Up | CORE X FITNESS — High-Performance Athletic Club',
  description: 'Create your Core X Fitness account to access training protocols, personalized diet plans, and VIP memberships.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#050607] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-core-red selection:text-white">
      
      {/* Premium Glass-inspired Container */}
      <div className="w-full max-w-6xl h-auto min-h-[620px] lg:h-[720px] bg-[#0A0D14] border border-white/10 rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-[0_40px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(255,42,42,0.08)] relative z-10 animate-fade-in-up">
        
        {/* LEFT SIDE: Authenticaton Panel */}
        <div className="w-full lg:w-[55%] p-6 sm:p-10 lg:p-14 flex flex-col justify-center relative overflow-hidden bg-gradient-to-b from-[#0A0D14] to-[#050607]">
          
          {/* Subtle background red glow */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-core-red/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Header Section */}
          <div className="w-full max-w-md mx-auto mb-6">
            <Link href="/" className="inline-block group mb-6 transition-transform hover:-translate-x-1 duration-300">
               <div className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-mono font-bold uppercase tracking-widest">
                 <ArrowLeft className="w-4 h-4" />
                 <span>Back to Website</span>
               </div>
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/gymlogo1.png"
                alt="CORE X FITNESS"
                width={150}
                height={45}
                className="w-28 sm:w-36 h-auto object-contain"
                priority
              />
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-core-red/10 border border-core-red/20 text-core-red text-[10px] font-mono uppercase tracking-[0.15em] font-bold">
                <Sparkles className="w-3 h-3" /> Athlete Portal
              </span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                Join Core X Fitness
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-sans">
                Create your account to unlock exclusive membership tiers, personalized diets, and high-performance training.
              </p>
            </div>
          </div>

          {/* Clerk SignUp Component wrapper */}
          <div className="w-full max-w-md mx-auto">
            <SignUp 
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
                  formFieldInput: "bg-[#0D1117]/90 border border-white/10 text-white rounded-xl focus:border-core-red focus:ring-1 focus:ring-core-red/50 transition-all shadow-inner py-2.5 text-sm",
                  formFieldLabel: "text-slate-300 text-[11px] font-bold uppercase tracking-wider font-mono",
                  formButtonPrimary: "bg-red-gradient text-white font-heading uppercase tracking-widest font-bold py-3 rounded-xl border border-core-red/50 hover:brightness-110 transition-all shadow-glow-red mt-2 text-xs",
                  dividerRow: "my-2 flex items-center gap-2",
                  dividerLine: "bg-white/10 h-[1px]",
                  dividerText: "text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400",
                  socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl py-2.5 transition-colors",
                  socialButtonsBlockButtonText: "font-sans font-semibold text-xs",
                  identityPreview: "bg-[#0D1117] border border-white/10 rounded-xl p-3 mb-3",
                  identityPreviewText: "text-white font-sans text-xs",
                  identityPreviewEditButtonIcon: "text-core-red",
                  formResendCodeLink: "text-core-red hover:text-white transition-colors text-xs font-mono",
                }
              }}
            />
          </div>

        </div>

        {/* RIGHT SIDE: Visual Panel */}
        <div className="w-full lg:w-[45%] h-64 lg:h-auto relative hidden sm:block overflow-hidden">
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
              Core X Flagship
            </span>
            <span className="text-xs font-heading text-white/90 tracking-widest font-bold uppercase">
              Sector 14 &bull; High-Performance Lab
            </span>
          </div>

          <div className="absolute top-8 left-8 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-core-red" />
            <span>256-Bit Encrypted Athlete Portal</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
