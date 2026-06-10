"use client";

import { 
  Mail, 
  Phone, 
  CreditCard, 
  ArrowUpRight, 
  Plus,
  ShieldCheck,
  Clock,
  Zap
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function DashboardPage() {
  const stats = [
    {
      title: "Active Aliases",
      value: "12",
      icon: Mail,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      change: "+2 this week"
    },
    {
      title: "Virtual Cards",
      value: "4",
      icon: CreditCard,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      change: "2 active, 2 frozen"
    },
    {
      title: "Phone Numbers",
      value: "1",
      icon: Phone,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      change: "Basic Plan"
    }
  ];

  const activities = [
    {
      id: 1,
      type: "alias",
      action: "Forwarded email",
      target: "netflix@veil.sh",
      time: "2 mins ago",
      icon: Mail,
      status: "success"
    },
    {
      id: 2,
      type: "card",
      action: "Transaction declined",
      target: "Amazon Card",
      time: "1 hour ago",
      icon: CreditCard,
      status: "error"
    },
    {
      id: 3,
      type: "number",
      action: "SMS Received",
      target: "+1 (555) 0123",
      time: "3 hours ago",
      icon: Phone,
      status: "success"
    },
    {
      id: 4,
      type: "card",
      action: "Card frozen",
      target: "DoorDash Card",
      time: "Yesterday",
      icon: CreditCard,
      status: "warning"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, John!</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your privacy tools.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800">
            View Analytics
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus className="h-4 w-4" />
            Quick Create
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                <CardDescription className="text-slate-500">Your latest privacy events</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-700 transition-colors">
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.target}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">{activity.time}</span>
                    <Badge 
                      variant={activity.status === "success" ? "secondary" : activity.status === "error" ? "destructive" : "outline"}
                      className="capitalize text-[10px] px-2 py-0"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips / Upgrade */}
        <div className="space-y-6">
          <Card className="bg-indigo-600/10 border-indigo-500/20">
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg text-white">Privacy Score: 85</CardTitle>
              <CardDescription className="text-indigo-200/60">Your protection is looking good, John!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-indigo-500/10 rounded-full h-2 mb-4">
                <div className="bg-indigo-500 h-2 rounded-full w-[85%]"></div>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2">
                Improve Protection
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-3">
              <Zap className="h-12 w-12 text-slate-800 -rotate-12" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-white">Pro Plan</CardTitle>
              <CardDescription className="text-slate-500">Unlimited privacy tools await.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="h-1 w-1 rounded-full bg-indigo-500"></div>
                  Unlimited Email Aliases
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="h-1 w-1 rounded-full bg-indigo-500"></div>
                  10 Virtual Credit Cards
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="h-1 w-1 rounded-full bg-indigo-500"></div>
                  Priority Support
                </li>
              </ul>
              <Button variant="secondary" className="w-full text-xs py-2">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
