import { AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface IndexMissingErrorProps {
  message?: string;
}

export function IndexMissingError({ message }: IndexMissingErrorProps) {
  const firebaseConsoleUrl = `https://console.firebase.google.com/project/istri-82971/firestore/indexes`;
  
  return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Database Index Required</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          {message || "This feature requires a Firestore composite index that hasn't been created yet."}
        </p>
        <p className="text-sm">
          The index is needed to efficiently query and display your data. Please create the required index in the Firebase Console.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => window.open(firebaseConsoleUrl, '_blank')}
        >
          Open Firebase Console
          <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
