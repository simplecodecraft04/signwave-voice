
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import ApiKeyDialog from "./ApiKeyDialog";

const ApiKeySettings = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Check if API key exists in localStorage
    const checkApiKey = () => {
      const apiKey = localStorage.getItem("FAL_AI_API_KEY");
      setHasApiKey(!!apiKey);
    };

    checkApiKey();
    // Add event listener to detect changes in localStorage
    window.addEventListener('storage', checkApiKey);
    
    return () => {
      window.removeEventListener('storage', checkApiKey);
    };
  }, []);

  return (
    <div className="fixed bottom-16 right-6 z-10">
      <Button 
        variant={hasApiKey ? "outline" : "default"} 
        size="sm" 
        className="rounded-full"
        onClick={() => setDialogOpen(true)}
      >
        <KeyRound className="h-4 w-4 mr-2" />
        {hasApiKey ? "Change API Key" : "Set API Key"}
      </Button>
      <ApiKeyDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default ApiKeySettings;
