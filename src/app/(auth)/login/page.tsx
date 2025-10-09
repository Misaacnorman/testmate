
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { auth } from "@/lib/firebase";

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { handleAuthError, showSuccess } = useErrorHandler();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [loginAttempts, setLoginAttempts] = React.useState(0);
    const [isBlocked, setIsBlocked] = React.useState(false);
    
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        // Check if user is temporarily blocked
        if (isBlocked) {
            toast({
                variant: "destructive",
                title: "Account Temporarily Blocked",
                description: "Too many failed login attempts. Please wait 5 minutes before trying again.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            
            // Reset login attempts on successful login
            setLoginAttempts(0);
            showSuccess("Login Successful", "Welcome back! Redirecting to your dashboard...");
            
            // The AuthGuard will handle redirection
        } catch (error) {
            console.error("Login error:", error);
            const authError = error as AuthError;
            
            // Handle too many requests
            if (authError.code === "auth/too-many-requests") {
                setLoginAttempts(5);
                setIsBlocked(true);
                // Unblock after 5 minutes
                setTimeout(() => {
                    setIsBlocked(false);
                    setLoginAttempts(0);
                }, 5 * 60 * 1000);
            } else {
                // Increment failed attempts
                setLoginAttempts(prev => prev + 1);
            }
            
            // Show user-friendly error message
            handleAuthError(authError);
        } finally {
            setIsSubmitting(false);
        }
    };


  return (
    <div className="flex items-center justify-center py-12">
        <Card className="mx-auto max-w-sm">
            <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
                {isBlocked ? <AlertCircle className="h-5 w-5 text-destructive" /> : <CheckCircle className="h-5 w-5 text-green-500" />}
                Login
            </CardTitle>
            <CardDescription>
                {isBlocked 
                    ? "Your account is temporarily blocked due to too many failed attempts"
                    : "Enter your email below to login to your account"
                }
            </CardDescription>
            {loginAttempts > 0 && !isBlocked && (
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    Failed attempts: {loginAttempts}/5
                </div>
            )}
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="user@example.com" {...field} />
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
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting || isBlocked}
                        variant={isBlocked ? "secondary" : "default"}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isBlocked ? "Account Blocked" : "Login"}
                    </Button>
                </form>
            </Form>
            </CardContent>
            <CardFooter className="text-sm">
                Don't have an account?{" "}
                <Button asChild variant="link">
                    <Link href="/signup">Register Laboratory</Link>
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
