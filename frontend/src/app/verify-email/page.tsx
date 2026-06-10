import Link from "next/link";
import { Shield, Mail, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <span className="text-2xl font-bold tracking-tight">Veil</span>
      </Link>
      
      <div className="w-full max-w-md p-8 rounded-3xl bg-background border border-border shadow-2xl shadow-primary/5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-4">Check your email</h1>
        <p className="text-muted-foreground mb-8">
          We&apos;ve sent a verification link to your email address. Please click the link to activate your account.
        </p>
        <div className="space-y-4">
          <button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all">
            Resend Verification Email
          </button>
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            Back to login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
