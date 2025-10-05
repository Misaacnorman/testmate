
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { Loader2, Pencil, Plus, MapPin, Briefcase, GraduationCap, FileText, Trash2, Upload, Signature, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ProfileExperience, ProfileEducation, AcademicDocument, Role, User } from '@/lib/types';
import { format } from 'date-fns';
import { EditProfileDialog } from '@/app/profile/components/edit-profile-dialog';
import { AddDocumentDialog } from '@/app/profile/components/add-document-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { ProfileCV } from '@/app/profile/components/profile-cv';
import { AddExperienceDialog } from '@/app/profile/components/add-experience-dialog';
import { AddEducationDialog } from '@/app/profile/components/add-education-dialog';
import { usePathname, useRouter } from 'next/navigation';
import { Phone, Building } from 'lucide-react';
import { HasPermission } from '@/components/auth/has-permission';

export default function UserProfilePage() {
    const { user: currentUser, refresh, laboratoryId } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const userId = pathname.split('/')[2];

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    
    const isOwnProfile = currentUser?.uid === userId;
    
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDocOpen, setIsDocOpen] = useState(false);
    const [isExperienceOpen, setIsExperienceOpen] = useState(false);
    const [isEducationOpen, setIsEducationOpen] = useState(false);

    const [deletingDoc, setDeletingDoc] = useState<AcademicDocument | null>(null);
    const [roleName, setRoleName] = useState<string>('No role assigned');
    const photoInputRef = React.useRef<HTMLInputElement>(null);
    const signatureInputRef = React.useRef<HTMLInputElement>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
      const fetchUserData = async () => {
        if (!userId) return;
        setLoading(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            
            if (userData.roleId && laboratoryId) {
              const roleDoc = await getDoc(doc(db, 'roles', userData.roleId));
              if (roleDoc.exists()) {
                setRoleName(roleDoc.data().name);
              }
            }

          } else {
            toast({ variant: 'destructive', title: 'User not found.' });
            router.push('/personnel');
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast({ variant: 'destructive', title: 'Failed to load profile.' });
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }, [userId, laboratoryId, toast, router]);
    
    useEffect(() => {
        if (isPrinting) {
          setTimeout(() => {
            window.print();
            setIsPrinting(false);
          }, 100);
        }
    }, [isPrinting]);

    const handleProfileUpdate = async (updatedData: { [key: string]: any }) => {
        if (!user) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, updatedData);
            setUser(prev => prev ? { ...prev, ...updatedData } : null);
            if(isOwnProfile) await refresh();
            toast({ title: "Profile Updated" });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({ variant: 'destructive', title: "Update Failed" });
        } finally {
            setIsEditOpen(false);
        }
    };
    
     const handleDocumentAdd = async (docData: Omit<AcademicDocument, 'id' | 'uploadedAt'>) => {
        if (!user) return;
        const newDocument: AcademicDocument = {
            ...docData,
            id: `doc_${Date.now()}`,
            uploadedAt: new Date().toISOString(),
        }
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                academicDocuments: arrayUnion(newDocument)
            });
            setUser(prev => prev ? { ...prev, academicDocuments: [...(prev.academicDocuments || []), newDocument] } : null);
             if(isOwnProfile) await refresh();
            toast({ title: "Document Added" });
        } catch (error) {
            console.error("Error adding document:", error);
            toast({ variant: 'destructive', title: "Failed to add document" });
        } finally {
            setIsDocOpen(false);
        }
    };
    
    const handleDocumentDelete = async () => {
        if (!user || !deletingDoc) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                academicDocuments: arrayRemove(deletingDoc)
            });
            setUser(prev => prev ? { ...prev, academicDocuments: (prev.academicDocuments || []).filter(d => d.id !== deletingDoc.id) } : null);
            if(isOwnProfile) await refresh();
            toast({ title: "Document Removed" });
        } catch (error) {
             console.error("Error removing document:", error);
             toast({ variant: 'destructive', title: "Failed to remove document" });
        } finally {
            setDeletingDoc(null);
        }
    }
    
    const handleExperienceAdd = async (expData: Omit<ProfileExperience, 'id'>) => {
        if (!user) return;
        const newExperience: ProfileExperience = {
            ...expData,
            id: `exp_${Date.now()}`,
        }
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                experience: arrayUnion(newExperience)
            });
            setUser(prev => prev ? { ...prev, experience: [...(prev.experience || []), newExperience] } : null);
            if(isOwnProfile) await refresh();
            toast({ title: "Experience Added" });
        } catch (error) {
            console.error("Error adding experience:", error);
            toast({ variant: 'destructive', title: "Failed to add experience" });
        } finally {
            setIsExperienceOpen(false);
        }
    };

    const handleEducationAdd = async (eduData: Omit<ProfileEducation, 'id'>) => {
        if (!user) return;
        const newEducation: ProfileEducation = {
            ...eduData,
            id: `edu_${Date.now()}`,
        }
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                education: arrayUnion(newEducation)
            });
            setUser(prev => prev ? { ...prev, education: [...(prev.education || []), newEducation] } : null);
             if(isOwnProfile) await refresh();
            toast({ title: "Education Added" });
        } catch (error) {
            console.error("Error adding education:", error);
            toast({ variant: 'destructive', title: "Failed to add education" });
        } finally {
            setIsEducationOpen(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: 'photoURL' | 'signatureURL') => {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          if (file.size > 2 * 1024 * 1024) { // 2MB limit
              toast({ variant: "destructive", title: "File too large", description: "Image must be under 2MB." });
              return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            handleProfileUpdate({ [fieldName]: dataUrl });
          };
          reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!user) {
        return <div className="text-center">Could not load user profile.</div>;
    }
    
    if (isPrinting) {
        return <ProfileCV user={user} roleName={roleName} />;
    }

    const nameInitial = user.name?.charAt(0) || user.email?.charAt(0) || "?";

    return (
        <div className="space-y-6">
             <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                        <div className="relative group">
                            <Avatar className="h-28 w-28 border-2 border-primary">
                                <AvatarImage src={user.photoURL || undefined} />
                                <AvatarFallback className="text-4xl">{nameInitial}</AvatarFallback>
                            </Avatar>
                             {isOwnProfile && (
                                <>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="absolute bottom-1 right-1 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => photoInputRef.current?.click()}
                                    >
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                    <input 
                                        type="file" 
                                        ref={photoInputRef} 
                                        className="hidden" 
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => handleImageUpload(e, 'photoURL')}
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold">{user.name}</h1>
                                    <p className="text-lg text-muted-foreground">{user.headline || roleName}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{user.location || 'No location set'}</span>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <Button variant="outline" onClick={() => setIsPrinting(true)}>
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print CV
                                    </Button>
                                    {isOwnProfile && (
                                        <Button variant="outline" size="icon" onClick={() => setIsEditOpen(true)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{user.bio || 'No bio provided.'}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Experience</CardTitle>
                            {isOwnProfile && <Button variant="ghost" size="icon" onClick={() => setIsExperienceOpen(true)}><Plus className="h-4 w-4" /></Button>}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(user.experience || []).map(exp => (
                                <div key={exp.id} className="flex gap-4">
                                     <Avatar className="h-12 w-12 rounded-md">
                                        <AvatarImage src={exp.logo || 'https://picsum.photos/seed/company/48/48'} data-ai-hint="logo" />
                                        <AvatarFallback><Briefcase className="h-6 w-6" /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{exp.title}</h3>
                                        <p className="text-sm">{exp.company}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(exp.startDate), 'MMM yyyy')} - {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}</p>
                                    </div>
                                </div>
                            ))}
                             {(!user.experience || user.experience.length === 0) && <p className="text-sm text-muted-foreground">No experience added yet.</p>}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Education</CardTitle>
                            {isOwnProfile && <Button variant="ghost" size="icon" onClick={() => setIsEducationOpen(true)}><Plus className="h-4 w-4" /></Button>}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(user.education || []).map(edu => (
                                <div key={edu.id} className="flex gap-4">
                                    <Avatar className="h-12 w-12 rounded-md">
                                        <AvatarImage src={edu.logo || 'https://picsum.photos/seed/school/48/48'} data-ai-hint="logo building" />
                                        <AvatarFallback><GraduationCap className="h-6 w-6" /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{edu.institution}</h3>
                                        <p className="text-sm">{edu.degree}, {edu.fieldOfStudy}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(edu.startDate), 'yyyy')} - {edu.endDate ? format(new Date(edu.endDate), 'yyyy') : 'Present'}</p>
                                    </div>
                                </div>
                            ))}
                            {(!user.education || user.education.length === 0) && <p className="text-sm text-muted-foreground">No education added yet.</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Academic Documents</CardTitle>
                             {isOwnProfile && <Button variant="ghost" size="icon" onClick={() => setIsDocOpen(true)}><Plus className="h-4 w-4" /></Button>}
                        </CardHeader>
                         <CardContent>
                            {(user.academicDocuments || []).length > 0 ? (
                                <ul className="space-y-3">
                                {user.academicDocuments?.map(doc => (
                                    <li key={doc.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-sm group-hover:underline">{doc.name}</p>
                                                <p className="text-xs text-muted-foreground">Uploaded on {format(new Date(doc.uploadedAt), 'PP')}</p>
                                            </div>
                                        </a>
                                        {isOwnProfile && 
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeletingDoc(doc)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        }
                                    </li>
                                ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No academic documents uploaded yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                             {(user.skills || []).map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                             {(!user.skills || user.skills.length === 0) && <p className="text-sm text-muted-foreground">No skills added yet.</p>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Signature</CardTitle>
                        </CardHeader>
                        <CardContent className="relative group flex items-center justify-center h-24 rounded-md border-2 border-dashed">
                             {user.signatureURL ? (
                                <img src={user.signatureURL} alt="Signature" className="max-h-full max-w-full" />
                            ) : (
                                <p className="text-sm text-muted-foreground">No signature uploaded</p>
                            )}
                             {isOwnProfile && (
                                <>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => signatureInputRef.current?.click()}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {user.signatureURL ? 'Change' : 'Upload'}
                                    </Button>
                                    <input 
                                        type="file" 
                                        ref={signatureInputRef} 
                                        className="hidden" 
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => handleImageUpload(e, 'signatureURL')}
                                    />
                                </>
                             )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="font-semibold">{user.email}</p>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{user.contact?.phone || 'Not provided'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {isOwnProfile && user && (
                <EditProfileDialog 
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    user={user}
                    onSave={handleProfileUpdate}
                />
            )}
             <AddDocumentDialog 
                isOpen={isDocOpen}
                onClose={() => setIsDocOpen(false)}
                onSave={handleDocumentAdd}
             />
             <AddExperienceDialog
                isOpen={isExperienceOpen}
                onClose={() => setIsExperienceOpen(false)}
                onSave={handleExperienceAdd}
             />
             <AddEducationDialog
                isOpen={isEducationOpen}
                onClose={() => setIsEducationOpen(false)}
                onSave={handleEducationAdd}
             />
             <AlertDialog open={!!deletingDoc} onOpenChange={(open) => !open && setDeletingDoc(null)}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This will permanently remove the document "{deletingDoc?.name}". This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDocumentDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
