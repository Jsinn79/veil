"use client";

import * as React from "react";
import { 
  Receipt, 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  ExternalLink,
  Download,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

export default function BillingPage() {
  const usage = [
    { label: "Email Aliases", current: 12, limit: 50, color: "bg-blue-500" },
    { label: "Virtual Cards", current: 4, limit: 10, color: "bg-purple-500" },
    { label: "Phone Numbers", current: 1, limit: 3, color: "bg-cyan-500" }
  ];

  const invoices = [
    { id: "INV-001", date: "May 1, 2024", amount: "$3.00", status: "Paid" },
    { id: "INV-002", date: "Jun 1, 2024", amount: "$3.00", status: "Paid" }
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
          <p className="text-slate-400 mt-1">Manage your plan, payment methods, and invoices.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Zap className="h-4 w-4" />
          Upgrade to Pro
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <Card className="lg:col-span-1 bg-slate-900 border-slate-800 flex flex-col justify-between">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-none">
                Monthly
              </Badge>
              <ShieldCheck className="h-6 w-6 text-indigo-500" />
            </div>
            <CardTitle className="text-2xl text-white">Basic Plan</CardTitle>
            <CardDescription className="text-slate-500">Professional privacy protection.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">$3</span>
              <span className="text-slate-500 text-sm">/ month</span>
            </div>
            
            <ul className="space-y-3">
              {[
                "Up to 50 Aliases",
                "Up to 10 Virtual Cards",
                "1 Burner Number",
                "Priority Email Support"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="pt-6 border-t border-slate-800">
            <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-800 gap-2">
              Manage Subscription <ExternalLink className="h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>

        {/* Usage & Limits */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Usage Limits</CardTitle>
                <CardDescription className="text-slate-500">Track your current resource consumption.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {usage.map((item) => {
              const percentage = (item.current / item.limit) * 100;
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-200">{item.label}</span>
                    <span className="text-slate-400">
                      <span className="text-white font-bold">{item.current}</span> / {item.limit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="pt-6 border-t border-slate-800 bg-slate-900/50">
            <p className="text-xs text-slate-500">
              Need more? <span className="text-indigo-400 cursor-pointer hover:underline">Upgrade to Pro</span> for unlimited aliases and more resources.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Payment Method */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Payment Method</CardTitle>
          <CardDescription className="text-slate-500">Manage your cards and billing details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="h-10 w-14 bg-slate-800 rounded-md border border-slate-700 flex items-center justify-center text-slate-400">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Visa ending in 4242</p>
                <p className="text-xs text-slate-500">Expires 12/26</p>
              </div>
            </div>
            <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Invoices</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-900/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Invoice ID</TableHead>
                <TableHead className="text-slate-400 font-medium">Date</TableHead>
                <TableHead className="text-slate-400 font-medium">Amount</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-right text-slate-400 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <TableCell className="font-medium text-slate-200">{invoice.id}</TableCell>
                  <TableCell className="text-slate-400">{invoice.date}</TableCell>
                  <TableCell className="text-slate-200">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-none text-[10px]">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
