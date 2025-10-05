
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { type Role } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { getApp, getApps, initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";


const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    roleId: z.string().min(1, "Please assign a role."),
});

type FormData = z.infer<typeof formSchema>;

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
  roles: Role[];
}

export function CreateUserDialog({ isOpen, onClose, onUserCreated, roles }: CreateUserDialogProps) {
  const { toast } = useToast();
  const { laboratoryId } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
    },
  });
  
  // This function securely creates a user on the client-side
  // by using a temporary, secondary Firebase app instance.
  // This prevents the admin's session from being replaced by the new user's session.
  const createIsolatedUser = async (data: FormData) => {
    const tempAppName = `user-creation-${Date.now()}`;
    let tempApp;
    try {
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        };
        
        // Initialize a temporary Firebase app
        tempApp = initializeApp(firebaseConfig, tempAppName);
        const tempAuth = getAuth(tempApp);

        // Create the user with this temporary auth instance
        const userCredential = await createUserWithEmailAndPassword(tempAuth, data.email, data.password);
        const user = userCredential.user;

        // At this point, the user is created in Firebase Auth backend,
        // but the admin's session in the main app is unaffected.

        if (!laboratoryId) throw new Error("Laboratory ID not found");

        // Now, create the user's profile in Firestore using the main app's db instance
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            name: data.name,
            email: data.email,
            photoURL: `https://picsum.photos/seed/${data.email}/40/40`,
            roleId: data.roleId,
            laboratoryId: laboratoryId,
            status: 'active',
            createdAt: new Date().toISOString(),
        });
        
        return { success: true, userId: user.uid };

    } catch (error: any) {
        console.error("Isolated user creation error:", error);
        // Map Firebase auth errors to user-friendly messages
        if (error.code === 'auth/email-already-in-use') {
            throw new Error("This email address is already in use by another account.");
        }
        throw new Error("An unexpected error occurred during user creation.");
    } finally {
        // Clean up the temporary app instance
        if (tempApp) {
            await deleteApp(tempApp);
        }
    }
  }


  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    if (!laboratoryId) {
        toast({ variant: "destructive", title: "Error", description: "No laboratory context found."});
        setIsSubmitting(false);
        return;
    }

    try {
        const response = await createIsolatedUser(data);

        if (response.success) {
            toast({
                title: "User Created",
                description: `The user ${data.name} has been created successfully.`,
            });
            onUserCreated(); // Refresh the user list
            onClose(); // Close the dialog
            form.reset(); // Reset form for next time
        }
    } catch (error: any) {
        console.error("Error creating user:", error);
        toast({
            variant: "destructive",
            title: "Creation Failed",
            description: error.message || "Could not create the user. Check the console for details.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Enter the details for the new user and assign them a role.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
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
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role to assign" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

