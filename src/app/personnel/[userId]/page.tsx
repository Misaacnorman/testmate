
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { Loader2, Pencil, Plus, MapPin, Briefcase, GraduationCap, FileText, Trash2, Upload, Signature, Printer, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ProfileExperience, ProfileEducation, AcademicDocument, WorkDocument, Role, User } from '@/lib/types';
import { format } from 'date-fns';
import { EditProfileDialog } from '@/app/profile/components/edit-profile-dialog';
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
import { EditExperienceDialog } from '@/app/profile/components/edit-experience-dialog';
import { EditEducationDialog } from '@/app/profile/components/edit-education-dialog';
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
    const [isExperienceOpen, setIsExperienceOpen] = useState(false);
    const [isEducationOpen, setIsEducationOpen] = useState(false);
    const [isEditExperienceOpen, setIsEditExperienceOpen] = useState(false);
    const [isEditEducationOpen, setIsEditEducationOpen] = useState(false);

    const [deletingDoc, setDeletingDoc] = useState<AcademicDocument | null>(null);
    const [deletingWorkDoc, setDeletingWorkDoc] = useState<WorkDocument | null>(null);
    const [deletingExperience, setDeletingExperience] = useState<ProfileExperience | null>(null);
    const [deletingEducation, setDeletingEducation] = useState<ProfileEducation | null>(null);
    const [editingExperience, setEditingExperience] = useState<ProfileExperience | null>(null);
    const [editingEducation, setEditingEducation] = useState<ProfileEducation | null>(null);
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
            if(isOwnProfile) {
                console.log("Refreshing auth context for profile update...");
                await refresh();
                console.log("Auth context refreshed successfully");
            }
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
            // Document add functionality removed - documents now uploaded with education
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
    
    const handleExperienceAdd = async (expData: Omit<ProfileExperience, 'id'>, documents: File[]) => {
        if (!user) return;
        const newExperience: ProfileExperience = {
            ...expData,
            id: `exp_${Date.now()}`,
        }
        
        try {
            const userRef = doc(db, 'users', user.uid);
            
            // Handle document uploads if any
            const documentIds: string[] = [];
            if (documents.length > 0) {
                for (const file of documents) {
                    // Convert file to base64 for storage (in a real app, you'd upload to cloud storage)
                    const reader = new FileReader();
                    const dataUrl = await new Promise<string>((resolve) => {
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });
                    
                    const newDocument = {
                        id: `work_doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        name: file.name,
                        url: dataUrl,
                        uploadedAt: new Date().toISOString(),
                        company: expData.company,
                        title: expData.title,
                        location: expData.location,
                        experienceId: newExperience.id,
                    };
                    
                    documentIds.push(newDocument.id);
                    
                    // Add document to workDocuments array
                    await updateDoc(userRef, {
                        workDocuments: arrayUnion(newDocument)
                    });
                }
                
                // Update experience with document references
                newExperience.documents = documentIds;
            }
            
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

    const handleEducationAdd = async (eduData: Omit<ProfileEducation, 'id'>, documents: File[]) => {
        if (!user) return;
        const newEducation: ProfileEducation = {
            ...eduData,
            id: `edu_${Date.now()}`,
        }
        
        try {
            const userRef = doc(db, 'users', user.uid);
            
            // Handle document uploads if any
            const documentIds: string[] = [];
            if (documents.length > 0) {
                for (const file of documents) {
                    // Convert file to base64 for storage (in a real app, you'd upload to cloud storage)
                    const reader = new FileReader();
                    const dataUrl = await new Promise<string>((resolve) => {
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });
                    
                    const newDocument = {
                        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        name: file.name,
                        url: dataUrl,
                        uploadedAt: new Date().toISOString(),
                        institution: eduData.institution,
                        degree: eduData.degree,
                        fieldOfStudy: eduData.fieldOfStudy,
                        educationId: newEducation.id,
                    };
                    
                    documentIds.push(newDocument.id);
                    
                    // Add document to academicDocuments array
                    await updateDoc(userRef, {
                        academicDocuments: arrayUnion(newDocument)
                    });
                }
                
                // Update education with document references
                newEducation.documents = documentIds;
            }
            
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

    const handleExperienceEdit = async (expData: ProfileExperience, documents: File[]) => {
        if (!user) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            
            // Handle new document uploads if any
            const documentIds: string[] = [...(expData.documents || [])];
            if (documents.length > 0) {
                for (const file of documents) {
                    // Convert file to base64 for storage (in a real app, you'd upload to cloud storage)
                    const reader = new FileReader();
                    const dataUrl = await new Promise<string>((resolve) => {
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });
                    
                    const newDocument = {
                        id: `work_doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        name: file.name,
                        url: dataUrl,
                        uploadedAt: new Date().toISOString(),
                        company: expData.company,
                        title: expData.title,
                        location: expData.location,
                        experienceId: expData.id,
                    };
                    
                    documentIds.push(newDocument.id);
                    
                    // Add document to workDocuments array
                    await updateDoc(userRef, {
                        workDocuments: arrayUnion(newDocument)
                    });
                }
                
                // Update experience with new document references
                expData.documents = documentIds;
            }
            
            const updatedExperience = user.experience?.map(exp => 
                exp.id === expData.id ? expData : exp
            ) || [];
            await updateDoc(userRef, {
                experience: updatedExperience
            });
            setUser(prev => prev ? { ...prev, experience: updatedExperience } : null);
            if(isOwnProfile) await refresh();
            toast({ title: "Experience Updated" });
        } catch (error) {
            console.error("Error updating experience:", error);
            toast({ variant: 'destructive', title: "Failed to update experience" });
        } finally {
            setIsEditExperienceOpen(false);
            setEditingExperience(null);
        }
    };

    const handleEducationEdit = async (eduData: ProfileEducation, documents: File[]) => {
        if (!user) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            
            // Handle new document uploads if any
            const documentIds: string[] = [...(eduData.documents || [])];
            if (documents.length > 0) {
                for (const file of documents) {
                    // Convert file to base64 for storage (in a real app, you'd upload to cloud storage)
                    const reader = new FileReader();
                    const dataUrl = await new Promise<string>((resolve) => {
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });
                    
                    const newDocument = {
                        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        name: file.name,
                        url: dataUrl,
                        uploadedAt: new Date().toISOString(),
                        institution: eduData.institution,
                        degree: eduData.degree,
                        fieldOfStudy: eduData.fieldOfStudy,
                        educationId: eduData.id,
                    };
                    
                    documentIds.push(newDocument.id);
                    
                    // Add document to academicDocuments array
                    await updateDoc(userRef, {
                        academicDocuments: arrayUnion(newDocument)
                    });
                }
                
                // Update education with new document references
                eduData.documents = documentIds;
            }
            
            const updatedEducation = user.education?.map(edu => 
                edu.id === eduData.id ? eduData : edu
            ) || [];
            await updateDoc(userRef, {
                education: updatedEducation
            });
            setUser(prev => prev ? { ...prev, education: updatedEducation } : null);
            if(isOwnProfile) await refresh();
            toast({ title: "Education Updated" });
        } catch (error) {
            console.error("Error updating education:", error);
            toast({ variant: 'destructive', title: "Failed to update education" });
        } finally {
            setIsEditEducationOpen(false);
            setEditingEducation(null);
        }
    };

    const handleExperienceDelete = async () => {
        if (!user || !deletingExperience) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            const updatedExperience = user.experience?.filter(exp => exp.id !== deletingExperience.id) || [];
            await updateDoc(userRef, {
                experience: updatedExperience
            });
            setUser(prev => prev ? { ...prev, experience: updatedExperience } : null);
            if(isOwnProfile) await refresh();
            toast({ title: "Experience Removed" });
        } catch (error) {
            console.error("Error removing experience:", error);
            toast({ variant: 'destructive', title: "Failed to remove experience" });
        } finally {
            setDeletingExperience(null);
        }
    };

    const handleEducationDelete = async () => {
        if (!user || !deletingEducation) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            
            // Remove associated documents
            if (deletingEducation.documents && deletingEducation.documents.length > 0) {
                const documentsToRemove = user.academicDocuments?.filter(doc => 
                    deletingEducation.documents?.includes(doc.id)
                ) || [];
                
                for (const docToRemove of documentsToRemove) {
                    await updateDoc(userRef, {
                        academicDocuments: arrayRemove(docToRemove)
                    });
                }
            }
            
            const updatedEducation = user.education?.filter(edu => edu.id !== deletingEducation.id) || [];
            await updateDoc(userRef, {
                education: updatedEducation
            });
            setUser(prev => prev ? { ...prev, education: updatedEducation } : null);
            if(isOwnProfile) await refresh();
            toast({ title: "Education Removed" });
        } catch (error) {
            console.error("Error removing education:", error);
            toast({ variant: 'destructive', title: "Failed to remove education" });
        } finally {
            setDeletingEducation(null);
        }
    };

    const handleDocumentView = (document: AcademicDocument) => {
        window.open(document.url, '_blank');
    };

    const handleDocumentDownload = (doc: AcademicDocument) => {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleWorkDocumentView = (document: WorkDocument) => {
        window.open(document.url, '_blank');
    };

    const handleWorkDocumentDownload = (doc: WorkDocument) => {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleWorkDocumentDelete = async () => {
        if (!user || !deletingWorkDoc) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                workDocuments: arrayRemove(deletingWorkDoc)
            });
            setUser(prev => prev ? { ...prev, workDocuments: (prev.workDocuments || []).filter(d => d.id !== deletingWorkDoc.id) } : null);
            if(isOwnProfile) await refresh();
            toast({ title: "Work Document Removed" });
        } catch (error) {
             console.error("Error removing work document:", error);
             toast({ variant: 'destructive', title: "Failed to remove work document" });
        } finally {
            setDeletingWorkDoc(null);
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

    const handleDeleteProfilePicture = async () => {
        if (!user) return;
        try {
            await handleProfileUpdate({ photoURL: null });
            toast({ title: "Profile picture removed" });
        } catch (error) {
            console.error("Error removing profile picture:", error);
            toast({ variant: 'destructive', title: "Failed to remove profile picture" });
        }
    };

    const handleDeleteSignature = async () => {
        if (!user) return;
        try {
            await handleProfileUpdate({ signatureURL: null });
            toast({ title: "Signature removed" });
        } catch (error) {
            console.error("Error removing signature:", error);
            toast({ variant: 'destructive', title: "Failed to remove signature" });
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
                                    <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => photoInputRef.current?.click()}
                                            title="Upload new photo"
                                        >
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                        {user.photoURL && (
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-8 w-8 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                onClick={handleDeleteProfilePicture}
                                                title="Delete photo"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
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
                            {(user.experience || [])
                                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                                .map(exp => (
                                <div key={exp.id} className="flex gap-4 group">
                                     <Avatar className="h-12 w-12 rounded-md">
                                        <AvatarImage src={exp.logo || 'https://picsum.photos/seed/company/48/48'} data-ai-hint="logo" />
                                        <AvatarFallback><Briefcase className="h-6 w-6" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{exp.title}</h3>
                                        <p className="text-sm">{exp.company}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(exp.startDate), 'MMM yyyy')} - {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}</p>
                                        {exp.description && <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>}
                                    </div>
                                    {isOwnProfile && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8" 
                                                onClick={() => {
                                                    setEditingExperience(exp);
                                                    setIsEditExperienceOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8" 
                                                onClick={() => setDeletingExperience(exp)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    )}
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
                            {(user.education || [])
                                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                                .map(edu => (
                                <div key={edu.id} className="flex gap-4 group">
                                    <Avatar className="h-12 w-12 rounded-md">
                                        <AvatarImage src={edu.logo || 'https://picsum.photos/seed/school/48/48'} data-ai-hint="logo building" />
                                        <AvatarFallback><GraduationCap className="h-6 w-6" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{edu.institution}</h3>
                                        <p className="text-sm">{edu.degree}, {edu.fieldOfStudy}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(edu.startDate), 'yyyy')} - {edu.endDate ? format(new Date(edu.endDate), 'yyyy') : 'Present'}</p>
                                    </div>
                                    {isOwnProfile && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8" 
                                                onClick={() => {
                                                    setEditingEducation(edu);
                                                    setIsEditEducationOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8" 
                                                onClick={() => setDeletingEducation(edu)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(!user.education || user.education.length === 0) && <p className="text-sm text-muted-foreground">No education added yet.</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Documents</CardTitle>
                            <CardDescription>View and manage your uploaded academic documents</CardDescription>
                        </CardHeader>
                         <CardContent>
                            {(user.academicDocuments || []).length > 0 ? (
                                <div className="space-y-4">
                                {user.academicDocuments?.map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="p-2 rounded-md bg-primary/10">
                                                <FileText className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Building className="h-3 w-3" />
                                                        {doc.institution}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <GraduationCap className="h-3 w-3" />
                                                        {doc.degree}
                                                    </span>
                                                    <span>{doc.fieldOfStudy}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Uploaded on {format(new Date(doc.uploadedAt), 'PP')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8" 
                                                onClick={() => handleDocumentView(doc)}
                                                title="View document"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8" 
                                                onClick={() => handleDocumentDownload(doc)}
                                                title="Download document"
                                            >
                                                <Upload className="h-4 w-4" />
                                            </Button>
                                            {isOwnProfile && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8" 
                                                    onClick={() => setDeletingDoc(doc)}
                                                    title="Delete document"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-sm text-muted-foreground">No academic documents uploaded yet.</p>
                                    <p className="text-xs text-muted-foreground mt-1">Upload documents when adding education entries.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Work Documents</CardTitle>
                            <CardDescription>View and manage your uploaded work-related documents</CardDescription>
                        </CardHeader>
                         <CardContent>
                            {(user.workDocuments || []).length > 0 ? (
                                <div className="space-y-4">
                                {user.workDocuments?.map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="p-2 rounded-md bg-primary/10">
                                                <FileText className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Building className="h-3 w-3" />
                                                        {doc.company}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase className="h-3 w-3" />
                                                        {doc.title}
                                                    </span>
                                                    {doc.location && <span>{doc.location}</span>}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Uploaded on {format(new Date(doc.uploadedAt), 'PP')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8" 
                                                onClick={() => handleWorkDocumentView(doc)}
                                                title="View document"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8" 
                                                onClick={() => handleWorkDocumentDownload(doc)}
                                                title="Download document"
                                            >
                                                <Upload className="h-4 w-4" />
                                            </Button>
                                            {isOwnProfile && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8" 
                                                    onClick={() => setDeletingWorkDoc(doc)}
                                                    title="Delete document"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-sm text-muted-foreground">No work documents uploaded yet.</p>
                                    <p className="text-xs text-muted-foreground mt-1">Upload documents when adding work experience entries.</p>
                                </div>
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
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => signatureInputRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            {user.signatureURL ? 'Change' : 'Upload'}
                                        </Button>
                                        {user.signatureURL && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                onClick={handleDeleteSignature}
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Delete
                                            </Button>
                                        )}
                                    </div>
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
             <EditExperienceDialog
                isOpen={isEditExperienceOpen}
                onClose={() => {
                    setIsEditExperienceOpen(false);
                    setEditingExperience(null);
                }}
                onSave={handleExperienceEdit}
                experience={editingExperience}
             />
             <EditEducationDialog
                isOpen={isEditEducationOpen}
                onClose={() => {
                    setIsEditEducationOpen(false);
                    setEditingEducation(null);
                }}
                onSave={handleEducationEdit}
                education={editingEducation}
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
            <AlertDialog open={!!deletingExperience} onOpenChange={(open) => !open && setDeletingExperience(null)}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This will permanently remove the experience "{deletingExperience?.title} at {deletingExperience?.company}". This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleExperienceDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={!!deletingEducation} onOpenChange={(open) => !open && setDeletingEducation(null)}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This will permanently remove the education "{deletingEducation?.degree} at {deletingEducation?.institution}". This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleEducationDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={!!deletingWorkDoc} onOpenChange={(open) => !open && setDeletingWorkDoc(null)}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This will permanently remove the work document "{deletingWorkDoc?.name}". This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleWorkDocumentDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
