
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, updateProfile, AuthError } from "firebase/auth";
import { collection, setDoc, doc, writeBatch, addDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
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
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormData = z.infer<typeof formSchema>;

export default function SignupPage() {
        const router = useRouter();
        const { toast } = useToast();
        const { handleAuthError, showSuccess, handleError } = useErrorHandler();
        const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

  const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
      // Create user with email and password first
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
      
      // Wait a moment for auth token to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));

            // Use a batch write to ensure atomicity
            const batch = writeBatch(db);

            // 1. Create the new laboratory document
            const labRef = doc(collection(db, "laboratories"));
      const labData = {
                name: '', // name will be set during onboarding
                ownerUid: user.uid,
                createdAt: new Date().toISOString(),
      };
      batch.set(labRef, labData);

            // 2. Create a default "Admin" role for this new lab with all permissions
            const adminRoleRef = doc(collection(db, "roles"));
            const allPermissions = PERMISSION_GROUPS.flatMap(group => group.permissions.map(p => p.id));
      const roleData = {
                name: "Admin",
                laboratoryId: labRef.id,
                permissions: allPermissions,
                memberIds: [user.uid],
      };
      batch.set(adminRoleRef, roleData);

            // 3. Update Firebase Auth user profile
      const fullName = `${data.firstName} ${data.lastName}`;
      const profileData = {
                displayName: fullName,
                photoURL: `https://picsum.photos/seed/${data.email}/40/40`
      };
      await updateProfile(user, profileData);

            // 4. Create the user document in Firestore, linking it to the lab and the new Admin role
            const userRef = doc(db, "users", user.uid);
      const userData = {
                email: data.email,
                name: fullName,
                photoURL: `https://picsum.photos/seed/${data.email}/40/40`,
                uid: user.uid,
                status: 'active',
                createdAt: new Date().toISOString(),
                laboratoryId: labRef.id,
                roleId: adminRoleRef.id,
      };
      batch.set(userRef, userData);

          await batch.commit();

          // Wait a moment for Firestore to index the new documents
          await new Promise(resolve => setTimeout(resolve, 1000));

          showSuccess("Account Created Successfully", "Your laboratory account has been created. Please complete your company profile setup.");
          router.push("/welcome/company-profile");

            } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Signup error:", error);
                const authError = error as AuthError;
                
                // Handle specific signup errors
                if (authError.code === "auth/email-already-in-use") {
                    handleAuthError(authError);
                } else if (authError.code === "auth/weak-password") {
                    handleAuthError(authError);
                } else if (authError.code === "auth/invalid-email") {
                    handleAuthError(authError);
                } else {
                    // Handle other errors (Firestore, network, etc.)
                    handleError(error, "signup");
                }
            } finally {
                setIsSubmitting(false);
            }
    };


    return (
      <>
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
                      name="firstName"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                  <Input placeholder="Jane" {...field} />
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
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                  <Input placeholder="Doe" {...field} />
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
      </>
  );
}
