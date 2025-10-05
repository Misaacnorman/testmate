
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, updateProfile, AuthError } from "firebase/auth";
import { collection, setDoc, doc, writeBatch, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { PERMISSION_GROUPS } from "@/lib/permissions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Loader2 } from "lucide-react";


const formSchema = z.object({
  adminName: z.string().min(2, "Your name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormData = z.infer<typeof formSchema>;

export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            adminName: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            // Use a batch write to ensure atomicity
            const batch = writeBatch(db);

            // 1. Create the new laboratory document
            const labRef = doc(collection(db, "laboratories"));
            batch.set(labRef, {
                name: '', // name will be set during onboarding
                ownerUid: user.uid,
                createdAt: new Date().toISOString(),
            });

            // 2. Create a default "Admin" role for this new lab with all permissions
            const adminRoleRef = doc(collection(db, "roles"));
            const allPermissions = PERMISSION_GROUPS.flatMap(group => group.permissions.map(p => p.id));
            batch.set(adminRoleRef, {
                name: "Admin",
                laboratoryId: labRef.id,
                permissions: allPermissions,
                memberIds: [user.uid],
            });

            // 3. Update Firebase Auth user profile
            await updateProfile(user, {
                displayName: data.adminName,
                photoURL: `https://picsum.photos/seed/${data.email}/40/40`
            });

            // 4. Create the user document in Firestore, linking it to the lab and the new Admin role
            const userRef = doc(db, "users", user.uid);
            batch.set(userRef, {
                email: data.email,
                name: data.adminName,
                photoURL: `https://picsum.photos/seed/${data.email}/40/40`,
                uid: user.uid,
                status: 'active',
                createdAt: new Date().toISOString(),
                laboratoryId: labRef.id,
                roleId: adminRoleRef.id,
            });

            await batch.commit();
            
        } catch (error) {
            console.error("Signup error:", error);
            const authError = error as AuthError;
            let description = "An unexpected error occurred. Please try again.";
            if (authError.code === "auth/email-already-in-use") {
                description = "This email is already associated with an account.";
            }
            toast({
                variant: "destructive",
                title: "Signup Failed",
                description,
            });
        } finally {
            setIsSubmitting(false);
        }
    };


  return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Create Admin Account</CardTitle>
          <CardDescription>
            Enter your information to create an administrator account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                   <FormField
                      control={form.control}
                      name="adminName"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                  <Input placeholder="Jane Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Your Email</FormLabel>
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
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                  </Button>
              </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm">
          Already have an account?{" "}
          <Button asChild variant="link">
              <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
  );
}
