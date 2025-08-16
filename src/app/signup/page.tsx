
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

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      await signup(data.email, data.password, {
        displayName: `${data.firstName} ${data.lastName}`,
      });
      toast({
        title: 'Signup Successful',
        description: 'Your account has been created.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
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
            <div className="mx-auto grid w-[380px] gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
                        <CardDescription>
                            Enter your information to create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Max" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Robinson" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create an account
                            </Button>
                        </form>
                      </Form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="underline">
                            Log in
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
                    alt="Scientist looking at data on a screen"
                    data-ai-hint="scientist data screen"
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 hover:scale-105"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h2 className="text-4xl font-bold">Automated Reporting, Instantly.</h2>
                    <p className="text-xl mt-2 max-w-xl">Let our AI generate comprehensive preliminary reports, so you can focus on the science.</p>
                </div>
            </div>
      </div>
    </div>
  );
}
