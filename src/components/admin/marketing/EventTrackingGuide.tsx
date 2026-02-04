import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, MousePointerClick, ShoppingCart, Phone, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const EventTrackingGuide = () => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const trackableElements = [
    {
      id: "btn-order-main",
      name: "অর্ডার করতে চাই (Main CTA)",
      icon: ShoppingCart,
      gtmEvent: "order_click",
      description: "Primary order button on hero section",
    },
    {
      id: "btn-whatsapp",
      name: "WhatsApp Button",
      icon: MessageCircle,
      gtmEvent: "whatsapp_click",
      description: "WhatsApp contact button",
    },
    {
      id: "btn-call",
      name: "Call Button",
      icon: Phone,
      gtmEvent: "call_click",
      description: "Phone call button",
    },
    {
      id: "btn-contact-submit",
      name: "Contact Form Submit",
      icon: Send,
      gtmEvent: "contact_submit",
      description: "Contact form submission button",
    },
    {
      id: "btn-cta-order",
      name: "CTA Section Order",
      icon: ShoppingCart,
      gtmEvent: "cta_order_click",
      description: "Order button in CTA section",
    },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied!",
      description: "Element ID copied to clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const gtmTriggerCode = `// GTM Click Trigger Configuration
// Trigger Type: Click - All Elements
// This trigger fires on: Some Clicks
// Fire this trigger when: Click ID equals [element-id]

// Example for order button:
// Click ID equals: btn-order-main

// GTM Tag: Google Ads Conversion
{
  "conversionId": "AW-XXXXXXXXX",
  "conversionLabel": "XXXXXXXXXXXX",
  "value": "{{DLV - Order Value}}",
  "currency": "BDT"
}`;

  const dataLayerCode = `// Automatically pushed on form submission
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'purchase',
  'transaction_id': '{{order_id}}',
  'value': {{order_value}},
  'currency': 'BDT',
  'items': [{
    'item_name': '{{product_name}}',
    'price': {{product_price}},
    'quantity': 1
  }]
});

// Meta Pixel Purchase Event
fbq('track', 'Purchase', {
  value: {{order_value}},
  currency: 'BDT',
  content_type: 'product',
  content_ids: ['{{product_id}}']
});`;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-foreground">Event Tracking Guide</h3>
        <p className="text-sm text-muted-foreground">
          Track button clicks and conversions using Google Tag Manager
        </p>
      </div>

      {/* Trackable Elements */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Trackable Elements</h4>
        {trackableElements.map((element) => (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border/50 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <element.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-medium text-foreground">{element.name}</h5>
                  <p className="text-xs text-muted-foreground">{element.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-secondary px-2 py-1 rounded font-mono">
                  id="{element.id}"
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(element.id, element.id)}
                >
                  {copiedId === element.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">GTM Event:</span>
              <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                {element.gtmEvent}
              </code>
            </div>
          </motion.div>
        ))}
      </div>

      {/* GTM Setup Guide */}
      <div className="bg-secondary/30 rounded-xl border border-border/50 p-5">
        <h4 className="font-medium text-foreground mb-3">GTM Trigger Setup</h4>
        <div className="relative">
          <pre className="bg-background rounded-lg p-4 text-xs font-mono overflow-x-auto text-muted-foreground">
            {gtmTriggerCode}
          </pre>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(gtmTriggerCode, "gtm-trigger")}
          >
            {copiedId === "gtm-trigger" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* DataLayer Events */}
      <div className="bg-secondary/30 rounded-xl border border-border/50 p-5">
        <h4 className="font-medium text-foreground mb-3">Purchase Event (Auto-fired)</h4>
        <p className="text-sm text-muted-foreground mb-3">
          These events are automatically pushed when a form is submitted with order data.
        </p>
        <div className="relative">
          <pre className="bg-background rounded-lg p-4 text-xs font-mono overflow-x-auto text-muted-foreground">
            {dataLayerCode}
          </pre>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(dataLayerCode, "datalayer")}
          >
            {copiedId === "datalayer" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Quick Setup Steps */}
      <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
        <h4 className="font-medium text-foreground mb-3">Quick Setup Steps</h4>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
            <span>Add Google Tag Manager script via the Script Manager tab</span>
          </li>
          <li className="flex gap-2">
            <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
            <span>Create Click triggers in GTM using the element IDs above</span>
          </li>
          <li className="flex gap-2">
            <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
            <span>Set up conversion tags for Google Ads / Meta / TikTok</span>
          </li>
          <li className="flex gap-2">
            <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">4</span>
            <span>Enable server-side tracking in Conversions tab for better accuracy</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default EventTrackingGuide;
