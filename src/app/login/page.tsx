
'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

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
      <div className="hidden bg-muted lg:flex items-center justify-center p-8">
        <div className="relative w-full h-full max-w-4xl max-h-[600px] rounded-2xl overflow-hidden shadow-2xl">
             <Image
                src="https://placehold.co/1200x800/87CEEB/F0F0F0?text=TestMate"
                alt="Lab technicians working"
                data-ai-hint="lab technicians working"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
                <h2 className="text-4xl font-bold">Precision Meets Intelligence</h2>
                <p className="text-xl mt-2 max-w-xl">Streamline your lab operations with TestMate, the AI-powered LIMS designed for accuracy and efficiency.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
