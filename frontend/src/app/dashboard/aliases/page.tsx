"use client";

import * as React from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  ExternalLink,
  Shield,
  Filter
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/Table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { CopyButton } from "@/components/ui/CopyButton";
import { Label } from "@/components/ui/Label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/DropdownMenu";

export default function AliasesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  
  const aliases = [
    {
      id: 1,
      label: "Netflix",
      address: "user_netflix@veil.sh",
      forwarding: true,
      createdAt: "2024-05-10",
      domain: "veil.sh"
    },
    {
      id: 2,
      label: "Amazon",
      address: "shopping.safe@veil.sh",
      forwarding: true,
      createdAt: "2024-05-12",
      domain: "veil.sh"
    },
    {
      id: 3,
      label: "Dating App",
      address: "private.id@veil.sh",
      forwarding: false,
      createdAt: "2024-06-01",
      domain: "veil.sh"
    },
    {
      id: 4,
      label: "Newsletter",
      address: "reads@cloak.veil.sh",
      forwarding: true,
      createdAt: "2024-06-05",
      domain: "cloak.veil.sh"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Email Aliases</h1>
          <p className="text-slate-400 mt-1">Protect your primary inbox with disposable addresses.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Create New Alias
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle>Create New Alias</DialogTitle>
              <DialogDescription className="text-slate-400">
                Generate a unique email address for a specific service or purpose.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="label" className="text-slate-300">Label</Label>
                <Input 
                  id="label" 
                  placeholder="e.g. Netflix, Online Shopping" 
                  className="bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-slate-300">Domain Choice</Label>
                <select className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>veil.sh</option>
                  <option>cloak.veil.sh</option>
                  <option>private.io</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Generate Alias
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search aliases..." 
            className="pl-10 bg-slate-900 border-slate-800 text-white focus:border-indigo-500"
          />
        </div>
        <Button variant="outline" className="border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400 font-medium">Alias Details</TableHead>
              <TableHead className="text-slate-400 font-medium">Address</TableHead>
              <TableHead className="text-slate-400 font-medium">Created</TableHead>
              <TableHead className="text-slate-400 font-medium">Forwarding</TableHead>
              <TableHead className="text-right text-slate-400 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aliases.map((alias) => (
              <TableRow key={alias.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Shield className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-slate-200">{alias.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                      {alias.address}
                    </code>
                    <CopyButton value={alias.address} size="sm" className="h-7 w-7 text-slate-500 hover:text-white" />
                  </div>
                </TableCell>
                <TableCell className="text-slate-400 text-sm">
                  {alias.createdAt}
                </TableCell>
                <TableCell>
                  <Switch checked={alias.forwarding} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
                      <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer text-red-400">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Alias
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
