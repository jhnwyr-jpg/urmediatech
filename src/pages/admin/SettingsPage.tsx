import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      orderAlerts: true,
      newUsers: true,
    },
    profile: {
      name: '',
      email: user?.email || '',
    },
  });

  const handleSave = () => {
    toast({ title: 'Settings saved successfully!' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
      >
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-3xl">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Profile Picture</h3>
                <p className="text-muted-foreground text-sm">Your avatar is auto-generated based on your email</p>
              </div>
            </div>
            <div className="grid gap-4 max-w-md">
              <div>
                <Label>Display Name</Label>
                <Input
                  value={settings.profile.name}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, name: e.target.value }
                  })}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={settings.profile.email} disabled />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications' },
                { key: 'orderAlerts', label: 'Order Alerts', desc: 'Get notified when new orders come in' },
                { key: 'newUsers', label: 'New User Signups', desc: 'Get notified when users register' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, [item.key]: checked }
                    })}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4 max-w-md">
              <div>
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button variant="outline">Change Password</Button>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Use smaller spacing in the UI</p>
                </div>
                <Switch />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-6 border-t border-border/50">
          <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-violet-600">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
