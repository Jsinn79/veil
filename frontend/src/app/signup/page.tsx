import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <span className="text-2xl font-bold tracking-tight">Veil</span>
      </Link>
      <AuthForm type="signup" />
    </div>
  );
}
