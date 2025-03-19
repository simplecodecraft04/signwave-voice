
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { configureFalClient } from '@/services/falAiService';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Save, Check } from 'lucide-react';

const localStorageKeyName = 'fal_ai_api_key';

export const getStoredApiKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(localStorageKeyName);
};

export const saveApiKey = (apiKey: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(localStorageKeyName, apiKey);
};

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey() || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(!!getStoredApiKey());

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid fal.ai API key",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Attempt to configure the client with the API key
      const success = configureFalClient(apiKey);
      
      if (success) {
        // Save the API key to localStorage
        saveApiKey(apiKey);
        setIsConfigured(true);
        
        toast({
          title: "API Key Saved",
          description: "Your fal.ai API key has been saved successfully",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: "Failed to configure fal.ai client with the provided API key",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configure fal.ai API Key</CardTitle>
        <CardDescription>
          You need to provide your own fal.ai API key to generate sign language videos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter your fal.ai API key (format: key_id:key_secret)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored only in your browser&apos;s local storage and is never sent to our servers.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://fal.ai/dashboard/keys', '_blank')}
              className="flex items-center gap-1 text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Get an API Key
            </Button>
            
            <Button onClick={handleSaveApiKey} disabled={isSaving} className="flex items-center gap-1">
              {isSaving ? (
                'Saving...'
              ) : isConfigured ? (
                <>
                  <Check className="h-4 w-4" /> Configured
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Key
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
