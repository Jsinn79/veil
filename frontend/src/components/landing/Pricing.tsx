import Link from "next/link";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for casual protection.",
    features: [
      "5 Email Aliases",
      "Alias forwarding",
      "Community support",
      "No Credit Card required"
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Basic",
    price: "3",
    description: "For users who need more aliases and cards.",
    features: [
      "50 Email Aliases",
      "3 Virtual Cards",
      "1 Burner Number",
      "Priority Email support"
    ],
    cta: "Upgrade to Basic",
    popular: true,
  },
  {
    name: "Pro",
    price: "7",
    description: "Unlimited privacy for the power user.",
    features: [
      "Unlimited Email Aliases",
      "10 Virtual Cards",
      "3 Burner Numbers",
      "24/7 Priority support",
      "Beta feature access"
    ],
    cta: "Get Pro Plan",
    popular: false,
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Pricing that makes sense</h2>
          <p className="text-lg text-muted-foreground">
            Simple, transparent tiers. No hidden fees. Cancel anytime.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`p-8 rounded-3xl border ${
                tier.popular 
                  ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10 relative" 
                  : "border-border bg-background"
              }`}
            >
              {tier.popular && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold tracking-tight">${tier.price}</span>
                <span className="text-muted-foreground font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup" 
                className={`block text-center py-4 rounded-xl font-bold transition-all ${
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
