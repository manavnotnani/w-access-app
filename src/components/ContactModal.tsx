import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactModal = ({ isOpen, onOpenChange }: ContactModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gold">Contact Our Team</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-muted-foreground text-center">
            Get in touch with us for support, partnerships, or general inquiries.
          </p>
          
          <div className="space-y-4">
            {/* Email Contact */}
            <div className="flex items-center justify-between p-4 bg-gradient-card border border-gold/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-lg">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">manav.notnani@gmail.com</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('mailto:manav.notnani@gmail.com', '_blank')}
                className="border-gold/20 hover:bg-gold/10"
              >
                Send Email
              </Button>
            </div>

            {/* X/Twitter Contact */}
            <div className="flex items-center justify-between p-4 bg-gradient-card border border-gold/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-lg">
                  <X className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-medium">X (Twitter)</p>
                  <p className="text-sm text-muted-foreground">@heymanavv</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://x.com/heymanavv', '_blank')}
                className="border-gold/20 hover:bg-gold/10"
              >
                Follow
              </Button>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground">
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
