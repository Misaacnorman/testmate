
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Settings, Plus, Trash2, ArrowUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { ColorPickerRow } from "@/components/dashboard/color-picker-row";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const emptyCompanyProfile = {
    logo: "",
    // Legacy fields for backward compatibility
    name: "",
    email: "",
    address: "",
    bio: "",
    location: "",
    // Theme colors
    sidebarBg: "#111827",
    contentBg: "#f0f9ff",
    topbarBg: "#ffffff",
    // New comprehensive profile structure
    companyDetails: {
        name: "",
        slogan: "",
        trade: "",
    },
    addressDetails: {
        plotNo: "",
        streetNameVillage: "",
        parishTown: "",
        subCountyTownCouncil: "",
        countyMunicipality: "",
        district: "",
        country: "",
        postOfficeBoxNo: "",
        boxOfficeLocation: "",
    },
    contactDetails: {
        officePhones: [""],
        mobilePhones: [""],
        emails: [""],
        website: "",
    },
    regulatoryDetails: {
        businessRegistrationNumber: "",
        yearOfRegistration: "",
        tin: "",
        vatRegNumber: "",
        vatRate: "",
        nssfRegNo: "",
    },
    customSections: [] as Array<{
        id: string;
        title: string;
        fields: Array<{
            id: string;
            label: string;
            value: string;
            required?: boolean;
        }>;
    }>,
};

export function CompanyProfile() {
  const { laboratory, laboratoryId, loading, refresh } = useAuth();
  const [profile, setProfile] = React.useState(emptyCompanyProfile);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setIsLoading(loading);
    if (laboratory) {
        setProfile({
            logo: laboratory.logo || "",
            // Legacy fields
            name: laboratory.name || "",
            email: laboratory.email || "",
            address: laboratory.address || "",
            bio: laboratory.bio || "",
            location: laboratory.location || "",
            // Theme colors
            sidebarBg: laboratory.themeColors?.sidebarBg || "#111827",
            contentBg: laboratory.themeColors?.contentBg || "#f0f9ff",
            topbarBg: laboratory.themeColors?.topbarBg || "#ffffff",
            // New comprehensive structure
            companyDetails: {
                name: laboratory.companyDetails?.name || laboratory.name || "",
                slogan: laboratory.companyDetails?.slogan || "",
                trade: laboratory.companyDetails?.trade || "",
            },
            addressDetails: {
                plotNo: laboratory.addressDetails?.plotNo || "",
                streetNameVillage: laboratory.addressDetails?.streetNameVillage || laboratory.address || "",
                parishTown: laboratory.addressDetails?.parishTown || "",
                subCountyTownCouncil: laboratory.addressDetails?.subCountyTownCouncil || "",
                countyMunicipality: laboratory.addressDetails?.countyMunicipality || "",
                district: laboratory.addressDetails?.district || "",
                country: laboratory.addressDetails?.country || "",
                postOfficeBoxNo: laboratory.addressDetails?.postOfficeBoxNo || "",
                boxOfficeLocation: laboratory.addressDetails?.boxOfficeLocation || "",
            },
            contactDetails: {
                officePhones: laboratory.contactDetails?.officePhones || [""],
                mobilePhones: laboratory.contactDetails?.mobilePhones || [""],
                emails: laboratory.contactDetails?.emails || [laboratory.email || ""],
                website: laboratory.contactDetails?.website || "",
            },
            regulatoryDetails: {
                businessRegistrationNumber: laboratory.regulatoryDetails?.businessRegistrationNumber || "",
                yearOfRegistration: laboratory.regulatoryDetails?.yearOfRegistration || "",
                tin: laboratory.regulatoryDetails?.tin || "",
                vatRegNumber: laboratory.regulatoryDetails?.vatRegNumber || "",
                vatRate: laboratory.regulatoryDetails?.vatRate || "",
                nssfRegNo: laboratory.regulatoryDetails?.nssfRegNo || "",
            },
            customSections: laboratory.customSections || [],
        });
    }
  }, [laboratory, loading]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleNestedInputChange = (
    section: 'companyDetails' | 'addressDetails' | 'contactDetails' | 'regulatoryDetails',
    field: string,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayInputChange = (
    section: 'contactDetails',
    field: 'officePhones' | 'mobilePhones' | 'emails',
    index: number,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) => i === index ? value : item),
      },
    }));
  };

  const addArrayItem = (
    section: 'contactDetails',
    field: 'officePhones' | 'mobilePhones' | 'emails',
    maxItems: number
  ) => {
    setProfile((prev) => {
      const currentArray = prev[section][field];
      if (currentArray.length < maxItems) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: [...currentArray, ""],
          },
        };
      }
      return prev;
    });
  };

  const removeArrayItem = (
    section: 'contactDetails',
    field: 'officePhones' | 'mobilePhones' | 'emails',
    index: number
  ) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index),
      },
    }));
  };

  const addCustomSection = () => {
    setProfile((prev) => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        {
          id: Date.now().toString(),
          title: `Section ${prev.customSections.length + 5}`,
          fields: [{ id: Date.now().toString(), label: "Field 1", value: "", required: false }],
        },
      ],
    }));
  };

  const updateCustomSection = (sectionId: string, updates: any) => {
    setProfile((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  };

  const addFieldToSection = (sectionId: string) => {
    setProfile((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: [
                ...section.fields,
                { id: Date.now().toString(), label: `Field ${section.fields.length + 1}`, value: "", required: false },
              ],
            }
          : section
      ),
    }));
  };

  const removeFieldFromSection = (sectionId: string, fieldId: string) => {
    setProfile((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.filter((field) => field.id !== fieldId),
            }
          : section
      ),
    }));
  };

  const removeCustomSection = (sectionId: string) => {
    setProfile((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((section) => section.id !== sectionId),
    }));
  };

  const scrollToTop = () => {
    // Scroll to the very top of the page, accounting for any fixed headers
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    // Also try scrolling the document element as a fallback
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
          toast({ variant: "destructive", title: "File too large", description: "Logo image must be under 5MB." });
          return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => ({ ...prev, logo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    // Validate required fields based on new requirements
    const requiredFields = [
      { value: profile.companyDetails.name, field: "Company Name" },
      { value: profile.addressDetails.streetNameVillage, field: "Village" },
    ];

    const missingFields = requiredFields.filter(field => !field.value.trim());
    
    if (missingFields.length > 0) {
        toast({
            variant: "destructive",
            title: "Missing Required Information",
            description: `Please fill in: ${missingFields.map(f => f.field).join(", ")}`,
        });
        return;
    }

    // Validate contact requirements: at least one phone number and email
    const hasPhone = profile.contactDetails.officePhones.some(phone => phone.trim()) || 
                    profile.contactDetails.mobilePhones.some(phone => phone.trim());
    const hasEmail = profile.contactDetails.emails.some(email => email.trim());
    
    if (!hasPhone || !hasEmail) {
        toast({
            variant: "destructive",
            title: "Missing Contact Information",
            description: "Please provide at least one phone number and email address.",
        });
        return;
    }

    // Section 4 (Regulatory Requirements) - Nothing is mandatory, so no validation needed

    if (!laboratoryId) {
        toast({ variant: "destructive", title: "Authentication Error", description: "Cannot find laboratory ID." });
        return;
    }
    
    setIsSaving(true);
    try {
        const docRef = doc(db, "laboratories", laboratoryId);
        // We use merge: true to avoid overwriting fields not managed here like themeColors
        await setDoc(docRef, { 
            // Legacy fields for backward compatibility
            name: profile.companyDetails.name || profile.name,
            logo: profile.logo,
            location: profile.location,
            address: profile.addressDetails.streetNameVillage || profile.address,
            email: profile.contactDetails.emails[0] || profile.email,
            bio: profile.bio,
            themeColors: {
                sidebarBg: profile.sidebarBg,
                contentBg: profile.contentBg,
                topbarBg: profile.topbarBg,
            },
            // New comprehensive structure
            companyDetails: profile.companyDetails,
            addressDetails: profile.addressDetails,
            contactDetails: profile.contactDetails,
            regulatoryDetails: profile.regulatoryDetails,
            customSections: profile.customSections,
         }, { merge: true });
        
        await refresh(); // Refresh auth context to reflect changes immediately
        
        toast({
            title: "Success!",
            description: "Your company profile has been updated.",
        });
    } catch (error) {
        console.error("Error saving company profile:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save company profile to the database.",
        });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
      return (
          <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>
                  Update your company's profile information. Fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
          </Card>
      )
  }

  return (
    <div className="space-y-6">
      {/* Header with Settings */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Company Profile</h1>
          <p className="text-muted-foreground">Complete your company information</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Theme
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Theme Colors</h4>
              <div className="grid grid-cols-1 gap-3">
                <ColorPickerRow label="Sidebar" value={profile.sidebarBg} onChange={(v) => setProfile(prev => ({ ...prev, sidebarBg: v }))}/>
                <ColorPickerRow label="Content" value={profile.contentBg} onChange={(v) => setProfile(prev => ({ ...prev, contentBg: v }))}/>
                <ColorPickerRow label="Top Bar" value={profile.topbarBg} onChange={(v) => setProfile(prev => ({ ...prev, topbarBg: v }))}/>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

    <Card>
        <CardContent className="p-6 space-y-6">
          {/* Logo Section */}
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.logo || undefined} alt="Company Logo" />
            <AvatarFallback>LOGO</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
              <Label htmlFor="logo-upload" className="text-sm font-medium">Company Logo</Label>
            <Input
              id="logo-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />
            <Button
              variant="outline"
                size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
            >
                <Upload className="mr-2 h-3 w-3" />
              Upload Logo
            </Button>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>

          {/* Section 1: Company Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                1
              </div>
              <h3 className="font-semibold">Company Details</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="company-name" className="text-sm">Name *</Label>
                <Input 
                  id="company-name" 
                  value={profile.companyDetails.name} 
                  onChange={(e) => handleNestedInputChange('companyDetails', 'name', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="slogan" className="text-sm">Slogan</Label>
                <Input 
                  id="slogan" 
                  value={profile.companyDetails.slogan} 
                  onChange={(e) => handleNestedInputChange('companyDetails', 'slogan', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="trade" className="text-sm">Trade</Label>
                <Input 
                  id="trade" 
                  value={profile.companyDetails.trade} 
                  onChange={(e) => handleNestedInputChange('companyDetails', 'trade', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
          </div>
        </div>

          {/* Section 2: Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                2
              </div>
              <h3 className="font-semibold">Address</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="plot-no" className="text-sm">Plot No</Label>
                <Input 
                  id="plot-no" 
                  value={profile.addressDetails.plotNo} 
                  onChange={(e) => handleNestedInputChange('addressDetails', 'plotNo', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="street-name" className="text-sm">Village *</Label>
                <Input 
                  id="street-name" 
                  value={profile.addressDetails.streetNameVillage} 
                  onChange={(e) => handleNestedInputChange('addressDetails', 'streetNameVillage', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="parish-town" className="text-sm">Parish / Town</Label>
                <Input 
                  id="parish-town" 
                  value={profile.addressDetails.parishTown} 
                  onChange={(e) => handleNestedInputChange('addressDetails', 'parishTown', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sub-county" className="text-sm">Sub-County</Label>
                <Input 
                  id="sub-county" 
                  value={profile.addressDetails.subCountyTownCouncil} 
                  onChange={(e) => handleNestedInputChange('addressDetails', 'subCountyTownCouncil', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="county" className="text-sm">County</Label>
                <Input 
                  id="county" 
                  value={profile.addressDetails.countyMunicipality} 
                  onChange={(e) => handleNestedInputChange('addressDetails', 'countyMunicipality', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="district" className="text-sm">District</Label>
                <Input 
                  id="district" 
                  value={profile.addressDetails.district} 
                  onChange={(e) => handleNestedInputChange('addressDetails', 'district', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="country" className="text-sm">Country</Label>
                <Input 
                  id="country" 
                  value={profile.addressDetails.country} 
                  onChange={(e) => handleNestedInputChange('addressDetails', 'country', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="post-office-box" className="text-sm">P.O. Box</Label>
                <Input 
                  id="post-office-box" 
                  value={profile.addressDetails.postOfficeBoxNo} 
                  onChange={(e) => handleNestedInputChange('addressDetails', 'postOfficeBoxNo', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="box-office-location" className="text-sm">Box Location</Label>
                <Input 
                  id="box-office-location" 
                  value={profile.addressDetails.boxOfficeLocation} 
                  onChange={(e) => handleNestedInputChange('addressDetails', 'boxOfficeLocation', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
              </div>
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Office Phones */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Office Phones</Label>
                  {profile.contactDetails.officePhones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={phone}
                        onChange={(e) => handleArrayInputChange('contactDetails', 'officePhones', index, e.target.value)}
                        disabled={isSaving}
                        placeholder={`Office Phone ${index + 1}`}
                        className="h-9"
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('contactDetails', 'officePhones', index)}
                          disabled={isSaving}
                          className="px-2 h-9"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {profile.contactDetails.officePhones.length < 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('contactDetails', 'officePhones', 2)}
                      disabled={isSaving}
                      className="w-full h-9"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Office Phone
                    </Button>
                  )}
                </div>

                {/* Mobile Phones */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Mobile Phones</Label>
                  {profile.contactDetails.mobilePhones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={phone}
                        onChange={(e) => handleArrayInputChange('contactDetails', 'mobilePhones', index, e.target.value)}
                        disabled={isSaving}
                        placeholder={`Mobile ${index + 1}`}
                        className="h-9"
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('contactDetails', 'mobilePhones', index)}
                          disabled={isSaving}
                          className="px-2 h-9"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {profile.contactDetails.mobilePhones.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('contactDetails', 'mobilePhones', 3)}
                      disabled={isSaving}
                      className="w-full h-9"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Mobile
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Emails */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email Addresses *</Label>
                  {profile.contactDetails.emails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => handleArrayInputChange('contactDetails', 'emails', index, e.target.value)}
                        disabled={isSaving}
                        placeholder={`Email ${index + 1}`}
                        className="h-9"
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('contactDetails', 'emails', index)}
                          disabled={isSaving}
                          className="px-2 h-9"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {profile.contactDetails.emails.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('contactDetails', 'emails', 3)}
                      disabled={isSaving}
                      className="w-full h-9"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Email
                    </Button>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                  <Input 
                    id="website" 
                    value={profile.contactDetails.website} 
                    onChange={(e) => handleNestedInputChange('contactDetails', 'website', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Regulatory Requirements */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                4
              </div>
              <h3 className="font-semibold">Regulatory Requirements</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="business-reg-number" className="text-sm">Business Registration Number</Label>
                <Input 
                  id="business-reg-number" 
                  value={profile.regulatoryDetails.businessRegistrationNumber} 
                  onChange={(e) => handleNestedInputChange('regulatoryDetails', 'businessRegistrationNumber', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="year-of-registration" className="text-sm">Year of Registration</Label>
                <Input 
                  id="year-of-registration" 
                  type="number"
                  value={profile.regulatoryDetails.yearOfRegistration} 
                  onChange={(e) => handleNestedInputChange('regulatoryDetails', 'yearOfRegistration', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="tin" className="text-sm">TIN</Label>
                <Input 
                  id="tin" 
                  value={profile.regulatoryDetails.tin} 
                  onChange={(e) => handleNestedInputChange('regulatoryDetails', 'tin', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vat-reg-number" className="text-sm">VAT Reg Number</Label>
                <Input 
                  id="vat-reg-number" 
                  value={profile.regulatoryDetails.vatRegNumber} 
                  onChange={(e) => handleNestedInputChange('regulatoryDetails', 'vatRegNumber', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vat-rate" className="text-sm">VAT Rate</Label>
                <Input 
                  id="vat-rate" 
                  value={profile.regulatoryDetails.vatRate} 
                  onChange={(e) => handleNestedInputChange('regulatoryDetails', 'vatRate', e.target.value)} 
                  disabled={isSaving}
                  placeholder="e.g., 18%"
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="nssf-reg-no" className="text-sm">NSSF Reg No</Label>
                <Input 
                  id="nssf-reg-no" 
                  value={profile.regulatoryDetails.nssfRegNo} 
                  onChange={(e) => handleNestedInputChange('regulatoryDetails', 'nssfRegNo', e.target.value)} 
                  disabled={isSaving}
                  className="h-8"
                />
              </div>
            </div>
        </div>

          {/* Custom Sections */}
          {profile.customSections.map((section, sectionIndex) => (
            <div key={section.id} className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                    {sectionIndex + 5}
                  </div>
                  <Input
                    value={section.title}
                    onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                    className="h-8 font-semibold border-none p-0"
                    placeholder="Section Title"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeCustomSection(section.id)}
                  disabled={isSaving}
                  className="h-8 px-2"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
        <div className="space-y-2">
                {section.fields.map((field, fieldIndex) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      value={field.label}
                      onChange={(e) => {
                        const updatedFields = section.fields.map((f, i) => 
                          i === fieldIndex ? { ...f, label: e.target.value } : f
                        );
                        updateCustomSection(section.id, { fields: updatedFields });
                      }}
                      placeholder="Field Label"
                      className="h-8 flex-1"
                    />
                    <Input
                      value={field.value}
                      onChange={(e) => {
                        const updatedFields = section.fields.map((f, i) => 
                          i === fieldIndex ? { ...f, value: e.target.value } : f
                        );
                        updateCustomSection(section.id, { fields: updatedFields });
                      }}
                      placeholder="Field Value"
                      className="h-8 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFieldFromSection(section.id, field.id)}
                      disabled={isSaving}
                      className="h-8 px-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFieldToSection(section.id)}
                  disabled={isSaving}
                  className="h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Field
                </Button>
              </div>
            </div>
          ))}

          {/* Add Custom Section */}
          <Button
            type="button"
            variant="outline"
            onClick={addCustomSection}
            disabled={isSaving}
            className="w-full h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Section
          </Button>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={scrollToTop}
              className="h-9"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Scroll to Top
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSaving} className="h-9">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
