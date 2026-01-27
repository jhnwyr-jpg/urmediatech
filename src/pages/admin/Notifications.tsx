import { useState } from "react";
import { Bell, Send, Image, Link, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

const Notifications = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<{ title: string; recipients: number } | null>(null);

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title এবং Message দিতে হবে");
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          title: title.trim(),
          message: message.trim(),
          url: url.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Notification পাঠানো হয়েছে! (${data.recipients || 0} জনকে)`);
        setLastSent({ title: title.trim(), recipients: data.recipients || 0 });
        
        // Clear form
        setTitle("");
        setMessage("");
        setUrl("");
        setImageUrl("");
      } else {
        throw new Error(data?.error || 'Failed to send notification');
      }
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error(error.message || "Notification পাঠাতে সমস্যা হয়েছে");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Push Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            সব subscribers দের push notification পাঠান
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Notification Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                নতুন Notification
              </CardTitle>
              <CardDescription>
                সব subscribed users দের একসাথে notification পাঠান
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Notification title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">{title.length}/50</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Notification message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">{message.length}/200</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center gap-1">
                  <Link className="h-4 w-4" />
                  Launch URL (optional)
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://urmedia.tech/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Click করলে এই URL এ যাবে
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  Image URL (optional)
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Notification এ image দেখাবে
                </p>
              </div>

              <Button
                onClick={handleSendNotification}
                disabled={isSending || !title.trim() || !message.trim()}
                className="w-full"
                size="lg"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    পাঠানো হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Notification পাঠান
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview & Status */}
          <div className="space-y-6">
            {/* Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Notification এভাবে দেখাবে
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                      UR
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {title || "Notification Title"}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message || "Your notification message will appear here..."}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        urmedia.tech • now
                      </p>
                    </div>
                  </div>
                  {imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={imageUrl} 
                        alt="Notification" 
                        className="rounded-md max-h-32 w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Last Sent Status */}
            {lastSent && (
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold text-primary">
                        সফলভাবে পাঠানো হয়েছে!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        "{lastSent.title}" - {lastSent.recipients} জনকে
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Title সংক্ষিপ্ত রাখুন (50 characters এর মধ্যে)</p>
                <p>• Message clear এবং actionable করুন</p>
                <p>• Important updates এর জন্য image যোগ করুন</p>
                <p>• Launch URL দিলে click করলে সেখানে যাবে</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
