
'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Beaker, BrainCircuit, FileText, Bot } from 'lucide-react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading || user) {
    return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
  }


  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel>Password</FormLabel>
                              <Link
                                href="#"
                                className="ml-auto inline-block text-sm underline"
                              >
                                Forgot your password?
                              </Link>
                            </div>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                      </Button>
                      <Button variant="outline" className="w-full" type="button">
                        Login with Google
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="underline">
                      Sign up
                    </Link>
                  </div>
                </CardContent>
            </Card>
        </div>
      </div>
       <div className="hidden bg-muted lg:flex items-center justify-center p-12">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                 <Bot className="mx-auto h-16 w-16 text-primary" />
                <h1 className="mt-4 text-4xl font-bold tracking-tighter text-foreground">
                    TestMate
                </h1>
                <p className="mt-2 text-xl text-muted-foreground">
                    The AI-Powered Laboratory Information System
                </p>
            </div>
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Intelligent Analysis</h3>
                        <p className="text-muted-foreground">Leverage AI for anomaly detection and automated report generation, turning data into decisions.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Beaker className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Seamless Tracking</h3>
                        <p className="text-muted-foreground">Monitor samples in real-time, from accession to analysis, with a complete, immutable audit trail.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Effortless Reporting</h3>
                        <p className="text-muted-foreground">Generate comprehensive, compliant reports with the click of a button, freeing up your valuable time.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
