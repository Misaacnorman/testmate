'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { AlertTriangle, Bot, Loader, User } from 'lucide-react';
import { detectAnomaliesAction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState = {
  message: '',
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Detect Anomalies'
      )}
    </Button>
  );
}

export function AnomalyDetector() {
  const [state, formAction] = useFormState(detectAnomaliesAction, initialState);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Detect Data Anomalies</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Experiment Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the experiment, e.g., 'Titration of HCl with NaOH to determine concentration.'"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experimentalData">Experimental Data</Label>
              <Textarea
                id="experimentalData"
                name="experimentalData"
                placeholder="Paste your experimental data here (e.g., in CSV or JSON format)."
                className="min-h-[200px]"
                required
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        {state.data ? (
          <Card>
            <CardContent className="pt-6">
              {state.data.hasAnomalies ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Anomalies Detected</AlertTitle>
                  <AlertDescription>
                    {state.data.anomaliesDescription}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <Bot className="h-4 w-4" />
                  <AlertTitle>No Anomalies Found</AlertTitle>
                  <AlertDescription>
                    {state.data.anomaliesDescription ||
                      'The AI model analyzed the data and found no significant anomalies.'}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="flex h-full items-center justify-center border-dashed">
            <div className="text-center text-muted-foreground">
              <p>Your analysis results will appear here.</p>
              <p className="text-sm">
                Submit data to begin anomaly detection.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
