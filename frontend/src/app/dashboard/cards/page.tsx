"use client";

import * as React from "react";
import { 
  Plus, 
  CreditCard, 
  Snowflake, 
  Flame, 
  Eye, 
  EyeOff,
  Settings2,
  History,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";

export default function CardsPage() {
  const [showNumbers, setShowNumbers] = React.useState<Record<number, boolean>>({});

  const toggleReveal = (id: number) => {
    setShowNumbers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const cards = [
    {
      id: 1,
      label: "Amazon Shopping",
      number: "4532 1234 5678 9012",
      expiry: "05/27",
      cvv: "423",
      limit: 500,
      spent: 124.50,
      status: "active",
      brand: "visa"
    },
    {
      id: 2,
      label: "Netflix Subscription",
      number: "5421 8876 5432 1109",
      expiry: "12/26",
      cvv: "118",
      limit: 20,
      spent: 15.99,
      status: "active",
      brand: "mastercard"
    },
    {
      id: 3,
      label: "DoorDash",
      number: "4532 0098 7765 4321",
      expiry: "08/28",
      cvv: "990",
      limit: 100,
      spent: 0,
      status: "frozen",
      brand: "visa"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Virtual Cards</h1>
          <p className="text-slate-400 mt-1">Spend safely online with isolated merchant cards.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          Generate New Card
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {cards.map((card) => {
          const isFrozen = card.status === "frozen";
          const percentage = (card.spent / card.limit) * 100;
          const isRevealed = showNumbers[card.id];

          return (
            <Card key={card.id} className={`bg-slate-900 border-slate-800 transition-all ${isFrozen ? "opacity-75 grayscale-[0.5]" : ""}`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Visual Card Component */}
                  <div className="p-8 md:w-1/2 flex items-center justify-center">
                    <div className={`relative w-full aspect-[1.58/1] rounded-2xl p-6 flex flex-col justify-between text-white shadow-2xl transition-all duration-500 overflow-hidden ${
                      isFrozen 
                        ? "bg-gradient-to-br from-slate-600 to-slate-800" 
                        : card.brand === "visa" 
                          ? "bg-gradient-to-br from-indigo-600 to-blue-700" 
                          : "bg-gradient-to-br from-purple-600 to-indigo-800"
                    }`}>
                      {/* Abstract Shapes */}
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-black/20 rounded-full blur-xl"></div>
                      
                      <div className="flex justify-between items-start z-10">
                        <span className="font-bold text-sm tracking-widest uppercase opacity-80">Veil</span>
                        <div className="h-8 w-12 bg-white/20 rounded-md backdrop-blur-sm border border-white/10 flex items-center justify-center">
                           <div className="w-8 h-6 bg-yellow-400/80 rounded-[3px]"></div>
                        </div>
                      </div>

                      <div className="space-y-1 z-10">
                        <p className="text-xs font-medium opacity-60 uppercase tracking-tighter">Card Number</p>
                        <p className="text-xl font-mono font-bold tracking-[0.2em]">
                          {isRevealed ? card.number : `•••• •••• •••• ${card.number.slice(-4)}`}
                        </p>
                      </div>

                      <div className="flex justify-between items-end z-10">
                        <div>
                          <p className="text-[10px] opacity-60 uppercase">Expiry</p>
                          <p className="text-sm font-bold">{card.expiry}</p>
                        </div>
                        <div>
                          <p className="text-[10px] opacity-60 uppercase">CVV</p>
                          <p className="text-sm font-bold">{isRevealed ? card.cvv : "•••"}</p>
                        </div>
                        <div className="uppercase font-bold italic text-lg opacity-80">
                          {card.brand}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Details/Controls */}
                  <div className="p-8 flex-1 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-bold text-white text-lg">{card.label}</h3>
                          <p className="text-xs text-slate-500">Created on May 10, 2024</p>
                        </div>
                        <Badge 
                          variant={isFrozen ? "outline" : "secondary"} 
                          className={isFrozen ? "border-slate-700 text-slate-500" : "bg-green-500/10 text-green-500 border-none"}
                        >
                          {card.status}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Spending Limit</span>
                            <span className="text-white">${card.spent} / ${card.limit}</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-1000 ${percentage > 90 ? "bg-red-500" : "bg-indigo-500"}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                          <div className="flex items-center gap-2">
                            {isFrozen ? <Lock className="h-4 w-4 text-slate-500" /> : <Unlock className="h-4 w-4 text-indigo-400" />}
                            <span className="text-sm text-slate-300">{isFrozen ? "Card Frozen" : "Card Active"}</span>
                          </div>
                          <Switch checked={!isFrozen} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleReveal(card.id)}
                        className="border-slate-800 text-slate-300 hover:bg-slate-800 gap-2"
                      >
                        {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {isRevealed ? "Hide" : "Reveal"}
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-800 text-slate-300 hover:bg-slate-800 gap-2">
                        <History className="h-3 w-3" />
                        Activity
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
