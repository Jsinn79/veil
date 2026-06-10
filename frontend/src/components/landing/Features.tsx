import { Mail, Shield, Smartphone, CreditCard } from "lucide-react";

const features = [
  {
    name: "Email Aliases",
    description: "Create unique email addresses for every service. Block spam and trackers before they reach your inbox.",
    icon: Mail,
    color: "bg-blue-500",
  },
  {
    name: "Burner Numbers",
    description: "Get temporary phone numbers for SMS verification. Keep your personal number private.",
    icon: Smartphone,
    color: "bg-green-500",
  },
  {
    name: "Virtual Credit Cards",
    description: "Protect your real bank info with virtual cards. Set spending limits and freeze cards instantly.",
    icon: CreditCard,
    color: "bg-purple-500",
  },
  {
    name: "Fully Automated",
    description: "Sign up and start provisioning in seconds. No human intervention or approval queues.",
    icon: Shield,
    color: "bg-indigo-500",
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Everything you need to stay invisible</h2>
          <p className="text-lg text-muted-foreground">
            Veil provides the same core privacy tools as premium services, but without the high price tag.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-xl group">
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.name}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
