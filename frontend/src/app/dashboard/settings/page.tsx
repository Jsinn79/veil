"use client";

import * as React from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Save,
  Bell,
  Shield,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-slate-400 mt-1">Manage your profile, security, and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Personal Profile</CardTitle>
                <CardDescription className="text-slate-500">How you appear on Veil.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-slate-300">Display Name</Label>
                <Input 
                  id="displayName" 
                  defaultValue="John Doe"
                  className="bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Primary Email</Label>
                <Input 
                  id="email" 
                  defaultValue="john.doe@example.com"
                  className="bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Security</CardTitle>
                <CardDescription className="text-slate-500">Update your password and secure your account.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password"
                  className="bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    className="bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    className="bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800 gap-2">
                <Key className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Notifications */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">Notifications</CardTitle>
                <CardDescription className="text-slate-500">Manage how you receive alerts.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-200">Email Notifications</p>
                  <p className="text-xs text-slate-500">Get alerts for alias activity and billing.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-200">Security Alerts</p>
                  <p className="text-xs text-slate-500">Notifications about new logins and card usage.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-200">Marketing Emails</p>
                  <p className="text-xs text-slate-500">Stay up to date with new features and privacy tips.</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
