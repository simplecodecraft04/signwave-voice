
import { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

interface ApiKeySettingsProps {
  onApiKeySaved: (apiKey: string) => void;
}

const ApiKeySettings = ({ onApiKeySaved }: ApiKeySettingsProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('falAiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeySaved(savedApiKey);
    }
  }, [onApiKeySaved]);

  const saveApiKey = () => {
    if (apiKey.trim() === '') {
      toast({
        title: 'API Key Required',
        description: 'Please enter your fal.ai API key',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('falAiApiKey', apiKey);
    onApiKeySaved(apiKey);
    
    toast({
      title: 'API Key Saved',
      description: 'Your fal.ai API key has been saved.',
    });
  };

  return (
    <div className="glass-card p-4 rounded-xl max-w-md mx-auto mb-8">
      <h3 className="text-lg font-medium mb-2">API Key Settings</h3>
      <div className="flex items-center p-2 bg-muted rounded-lg mb-2">
        <Key className="mr-2 h-4 w-4 text-muted-foreground" />
        <Input 
          type={isVisible ? "text" : "password"}
          placeholder="Enter your fal.ai API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsVisible(!isVisible)}
          className="ml-2"
        >
          {isVisible ? 'Hide' : 'Show'}
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Your API key is stored only in your browser
        </p>
        <Button size="sm" onClick={saveApiKey}>Save Key</Button>
      </div>
    </div>
  );
};

export default ApiKeySettings;
