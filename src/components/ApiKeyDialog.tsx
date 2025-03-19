
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

  const validateApiKey = (key: string): boolean => {
    // Basic validation for fal.ai key format
    // Real fal.ai keys typically start with "fal_" or "sk-"
    return !!key.trim() && (key.startsWith("fal_") || key.startsWith("sk-"));
  };

  const handleSave = () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateApiKey(trimmedKey)) {
      toast({
        title: "Invalid API Key Format",
        description: "Your API key should start with 'fal_' or 'sk-'.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("FAL_AI_API_KEY", trimmedKey);
    window.dispatchEvent(new Event('storage')); // Trigger the storage event for listeners
    
    toast({
      title: "API Key Saved",
      description: "Your fal.ai API key has been saved successfully.",
    });
    onOpenChange(false);
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
            placeholder="Enter your fal.ai API key here (starts with fal_ or sk-)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
            className="w-full"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Get your API key from the <a href="https://fal.ai/dashboard/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">fal.ai dashboard</a>.
          </p>
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
