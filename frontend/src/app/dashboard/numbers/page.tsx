"use client";

import * as React from "react";
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Phone,
  RefreshCw,
  Clock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";

export default function NumbersPage() {
  const numbers = [
    {
      id: 1,
      label: "Personal Verifications",
      number: "+1 (555) 0123",
      status: "active",
      messages: 12,
      lastSms: "Your verification code is 8842...",
      lastSmsTime: "10 mins ago"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Phone Numbers</h1>
          <p className="text-slate-400 mt-1">Temporary numbers for SMS verifications and calls.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          Provision New Number
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {numbers.length > 0 ? (
          numbers.map((num) => (
            <Card key={num.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Left Section: Number Info */}
                  <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{num.label}</h3>
                        <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-500 border-none text-[10px] h-5">
                          {num.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-mono font-bold text-white tracking-tight">{num.number}</span>
                        <CopyButton value={num.number} variant="ghost" size="sm" className="text-slate-500 hover:text-white" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>Expires in 28 days</span>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white gap-2">
                        <RefreshCw className="h-3 w-3" />
                        Renew
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-slate-800 text-red-400/60 hover:bg-red-500/10 hover:text-red-500 border-red-500/20 gap-2">
                        <Trash2 className="h-3 w-3" />
                        Release
                      </Button>
                    </div>
                  </div>

                  {/* Right Section: Recent Message */}
                  <div className="p-6 flex-1 bg-slate-900/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Latest Message</span>
                        <span className="text-xs text-slate-600">{num.lastSmsTime}</span>
                      </div>
                      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-800/50">
                        <p className="text-slate-300 text-sm italic">"{num.lastSms}"</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">{num.messages} total messages</span>
                      </div>
                      <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 group-hover:translate-x-1 transition-transform">
                        View Inbox <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-slate-900 border-dashed border-slate-800 p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 mb-4">
              <Phone className="h-8 w-8" />
            </div>
            <CardTitle className="text-white">No active numbers</CardTitle>
            <CardDescription className="max-w-xs mt-2">
              Provision a temporary number to receive SMS verifications without sharing your real phone info.
            </CardDescription>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white">
              Provision Your First Number
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
