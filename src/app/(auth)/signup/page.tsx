
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
  const [debugOpen, setDebugOpen] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([]);

  const log = React.useCallback((message: string, meta?: unknown) => {
    const line = meta ? `${message} :: ${JSON.stringify(meta)}` : message;
    // Keep last 100 lines
    setLogs(prev => [...prev.slice(-99), `${new Date().toISOString()} - ${line}`]);
    // Also emit to console for browser devtools
    // eslint-disable-next-line no-console
    console.debug("[signup]", message, meta ?? "");
  }, []);

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
      log("starting signup", { email: data.email });
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
      log("auth created", { uid: user.uid });

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
      log("prepared lab doc", { labId: labRef.id, labData });

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
      log("prepared role doc", { roleId: adminRoleRef.id, countPermissions: allPermissions.length });

            // 3. Update Firebase Auth user profile
      const profileData = {
                displayName: data.adminName,
                photoURL: `https://picsum.photos/seed/${data.email}/40/40`
      };
      await updateProfile(user, profileData);
      log("updated profile");

            // 4. Create the user document in Firestore, linking it to the lab and the new Admin role
            const userRef = doc(db, "users", user.uid);
      const userData = {
                email: data.email,
                name: data.adminName,
                photoURL: `https://picsum.photos/seed/${data.email}/40/40`,
                uid: user.uid,
                status: 'active',
                createdAt: new Date().toISOString(),
                laboratoryId: labRef.id,
                roleId: adminRoleRef.id,
      };
      batch.set(userRef, userData);
      log("prepared user doc", { userId: user.uid, laboratoryId: labRef.id });

      await batch.commit();
      log("batch committed");
      toast({ title: "Account created" });
      router.push("/welcome/company-profile");
            
        } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Signup error:", error);
            const authError = error as AuthError;
            let description = "An unexpected error occurred. Please try again.";
            if (authError.code === "auth/email-already-in-use") {
                description = "This email is already associated with an account.";
            }
      // Capture more detail for debugging (non-user-facing)
      log("error", { code: (authError as any)?.code, message: (authError as any)?.message });
      setDebugOpen(true);
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
      {process.env.NODE_ENV !== 'production' && (
        <div className="fixed bottom-4 right-4 z-50 w-[28rem] max-w-[90vw]">
          <Button variant="outline" className="mb-2" onClick={() => setDebugOpen(v => !v)}>
            {debugOpen ? 'Hide' : 'Show'} Debug Console
          </Button>
          {debugOpen && (
            <div className="rounded-md border bg-background p-3 shadow-lg max-h-72 overflow-auto text-xs">
              <div className="mb-2 font-semibold">Signup Debug Console</div>
              <pre className="whitespace-pre-wrap break-words">{logs.join('\n')}</pre>
            </div>
          )}
        </div>
      )}
      </>
  );
}
