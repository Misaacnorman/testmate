'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Bot, FileText, Loader, Rocket, TestTube } from 'lucide-react';
import { generateReportAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from './ui/separator';

const initialState = {
  message: '',
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Generating Report...
        </>
      ) : (
        'Generate Preliminary Report'
      )}
    </Button>
  );
}

export function ReportGenerator() {
  const [state, formAction] = useFormState(generateReportAction, initialState);

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>
              Input experimental data to auto-generate a report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experimentalData">Experimental Data</Label>
                <Textarea
                  id="experimentalData"
                  name="experimentalData"
                  placeholder="Paste your experimental data here (e.g., in CSV or JSON format)."
                  className="min-h-[250px] font-mono text-xs"
                  required
                />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Generated Report</h2>
        {state.data ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Preliminary Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{state.data.report}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <TestTube className="h-5 w-5" />
                <CardTitle>Conclusions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{state.data.conclusions}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Rocket className="h-5 w-5" />
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{state.data.nextSteps}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="flex h-full min-h-[400px] items-center justify-center border-dashed">
            <div className="text-center text-muted-foreground">
              <Bot className="mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">
                Your report will be generated here
              </h3>
              <p className="mt-2 text-sm">
                Submit data to automatically generate a preliminary report.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
