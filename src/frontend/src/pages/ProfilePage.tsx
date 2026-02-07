import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { usePrototypeSession } from '@/state/usePrototypeSession';
import { useProfileQueries } from '@/queries/profileQueries';
import { toast } from 'sonner';
import ClickableWordmark from '@/components/brand/ClickableWordmark';
import { ArrowLeft } from 'lucide-react';

const TOPICS = ['Crypto', 'Macro', 'Geopolitics', 'Tech'];
const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore',
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { email, setEmail } = usePrototypeSession();
  const { profile, updateProfileMutation } = useProfileQueries(email || '');

  const [localEmail, setLocalEmail] = useState(email || '');
  const [timezone, setTimezone] = useState('UTC');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setTimezone(profile.timeZone);
      setSelectedTopics(profile.topics);
    }
  }, [profile]);

  const handleSignIn = () => {
    if (!localEmail || !localEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setEmail(localEmail);
    toast.success('Signed in successfully');
  };

  const handleSaveProfile = () => {
    if (!email) {
      toast.error('Please sign in first');
      return;
    }

    updateProfileMutation.mutate(
      {
        email,
        timeZone: timezone,
        topics: selectedTopics,
      },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully');
          navigate({ to: '/brief' });
        },
        onError: () => {
          toast.error('Failed to update profile');
        },
      }
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <ClickableWordmark size="sm" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              {email ? 'Update your preferences' : 'Sign in to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!email ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={localEmail}
                    onChange={(e) => setLocalEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleSignIn} className="w-full">
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="text-sm text-muted-foreground">{email}</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Preferred Topics</Label>
                  <div className="space-y-2">
                    {TOPICS.map((topic) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={topic}
                          checked={selectedTopics.includes(topic)}
                          onCheckedChange={() => toggleTopic(topic)}
                        />
                        <Label htmlFor={topic} className="font-normal cursor-pointer">
                          {topic}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="w-full"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save & Continue'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to PulseBrief
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
