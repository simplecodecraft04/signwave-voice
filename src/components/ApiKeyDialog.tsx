
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyDialog = ({ open, onOpenChange }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  
  // Load the existing API key from localStorage if available
  useEffect(() => {
    const savedKey = localStorage.getItem("FAL_AI_API_KEY");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [open]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("FAL_AI_API_KEY", apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your fal.ai API key has been saved successfully.",
      });
      onOpenChange(false);
    } else {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
          <DialogDescription>
            Enter your fal.ai API key to enable sign language video generation.
            Your key will be securely stored in your browser's local storage.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            placeholder="Enter your fal.ai API key here"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
            className="w-full"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
