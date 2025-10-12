"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Upload, Plus, Trash2, ArrowUp, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
// ColorPickerRow component will be defined inline
const ColorPickerRow = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}</Label>
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-16 p-1 border rounded"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 flex-1"
        placeholder="#000000"
      />
    </div>
  </div>
);

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

export default function CompanyProfileOnboardingPage() {
  const { laboratory, laboratoryId, refresh, user, permissions } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = React.useState(emptyCompanyProfile);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { handleError, showSuccess } = useErrorHandler();

  React.useEffect(() => {
    if (laboratory) {
        setProfile({
            logo: laboratory.logo || "",
            // Legacy fields
            name: laboratory.name || "",
            location: laboratory.location || "",
            email: laboratory.email || "",
            address: laboratory.address || "",
            bio: laboratory.bio || "",
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
        setIsLoading(false);
    } else if (laboratoryId) {
        setIsLoading(false);
    } else {
        setIsLoading(false);
    }
  }, [laboratory, laboratoryId, refresh, user, permissions]);

  // Scroll to top when component mounts
  React.useEffect(() => {
    // Scroll to the very top when the page loads
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleNestedInputChange = (
    section: keyof typeof profile,
    field: string,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
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
        [field]: prev[section][field].map((item, i) => (i === index ? value : item)),
      },
    }));
  };

  const addArrayItem = (
    section: 'contactDetails',
    field: 'officePhones' | 'mobilePhones' | 'emails',
    maxItems: number
  ) => {
    setProfile((prev) => {
      const currentItems = prev[section][field];
      if (currentItems.length < maxItems) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: [...currentItems, ""],
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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

  const updateCustomSection = (sectionId: string, updates: Partial<{ title: string; fields: Array<{ id: string; label: string; value: string; required?: boolean; }> }>) => {
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
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [colorKey]: value,
    }));
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
        toast({ variant: "destructive", title: "Error", description: "No laboratory context found." });
        return;
    }
    
    setIsSaving(true);
    try {
        await setDoc(doc(db, "laboratories", laboratoryId), {
            logo: profile.logo,
            // Legacy fields for backward compatibility
            name: profile.companyDetails.name,
            email: profile.contactDetails.emails[0] || "",
            address: profile.addressDetails.streetNameVillage,
            bio: profile.companyDetails.slogan,
            location: profile.addressDetails.countyMunicipality,
            // Theme colors
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

        // Explicitly refresh the auth context to get the latest lab data
        await refresh();

        showSuccess("Profile Updated Successfully", "Your laboratory profile has been saved and you're ready to start using the platform!");
        router.push('/');
    } catch (error) {
        console.error("Error saving company profile:", error);
        handleError(error, "company profile save");
    } finally {
        setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-muted/40">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading your laboratory profile...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-muted/40 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-center mb-2">Create Company Profile</h1>
              <p className="text-center text-muted-foreground">Complete your company information to get started</p>
            </div>
            <div className="ml-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Theme Colors</h4>
                      <p className="text-xs text-muted-foreground">Customize your application colors</p>
                    </div>
                    <div className="space-y-4">
                      <ColorPickerRow label="Sidebar" value={profile.sidebarBg} onChange={(v: string) => handleColorChange('sidebarBg', v)}/>
                      <ColorPickerRow label="Content" value={profile.contentBg} onChange={(v: string) => handleColorChange('contentBg', v)}/>
                      <ColorPickerRow label="Top Bar" value={profile.topbarBg} onChange={(v: string) => handleColorChange('topbarBg', v)}/>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Optimized Grid Layout - Better Space Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Company Identity - Takes 1 column */}
          <div className="space-y-6">
            {/* Logo Section */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Company Logo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20 border-2 border-dashed border-gray-300">
                    <AvatarImage src={profile.logo || undefined} alt="Company Logo" />
                    <AvatarFallback className="text-sm">LOGO</AvatarFallback>
                  </Avatar>
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
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving}
                    className="w-full h-9"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">PNG, JPG, GIF up to 5MB</p>
                </div>
              </CardContent>
            </Card>

            {/* Company Details */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-sm font-medium">Company Name *</Label>
                  <Input 
                    id="company-name" 
                    value={profile.companyDetails.name} 
                    onChange={(e) => handleNestedInputChange('companyDetails', 'name', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slogan" className="text-sm font-medium">Slogan</Label>
                  <Input 
                    id="slogan" 
                    value={profile.companyDetails.slogan} 
                    onChange={(e) => handleNestedInputChange('companyDetails', 'slogan', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trade" className="text-sm font-medium">Trade</Label>
                  <Input 
                    id="trade" 
                    value={profile.companyDetails.trade} 
                    onChange={(e) => handleNestedInputChange('companyDetails', 'trade', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address Information - Takes 1 column */}
          <div className="space-y-6">
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="plot-no" className="text-sm font-medium">Plot No</Label>
                    <Input 
                      id="plot-no" 
                      value={profile.addressDetails.plotNo} 
                      onChange={(e) => handleNestedInputChange('addressDetails', 'plotNo', e.target.value)} 
                      disabled={isSaving}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street-name" className="text-sm font-medium">Village *</Label>
                    <Input 
                      id="street-name" 
                      value={profile.addressDetails.streetNameVillage} 
                      onChange={(e) => handleNestedInputChange('addressDetails', 'streetNameVillage', e.target.value)} 
                      disabled={isSaving}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parish-town" className="text-sm font-medium">Parish / Town</Label>
                  <Input 
                    id="parish-town" 
                    value={profile.addressDetails.parishTown} 
                    onChange={(e) => handleNestedInputChange('addressDetails', 'parishTown', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub-county" className="text-sm font-medium">Sub-County</Label>
                  <Input 
                    id="sub-county" 
                    value={profile.addressDetails.subCountyTownCouncil} 
                    onChange={(e) => handleNestedInputChange('addressDetails', 'subCountyTownCouncil', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="county" className="text-sm font-medium">County</Label>
                  <Input 
                    id="county" 
                    value={profile.addressDetails.countyMunicipality} 
                    onChange={(e) => handleNestedInputChange('addressDetails', 'countyMunicipality', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-sm font-medium">District</Label>
                    <Input 
                      id="district" 
                      value={profile.addressDetails.district} 
                      onChange={(e) => handleNestedInputChange('addressDetails', 'district', e.target.value)} 
                      disabled={isSaving}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                    <Input 
                      id="country" 
                      value={profile.addressDetails.country} 
                      onChange={(e) => handleNestedInputChange('addressDetails', 'country', e.target.value)} 
                      disabled={isSaving}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="post-office-box" className="text-sm font-medium">P.O. Box</Label>
                    <Input 
                      id="post-office-box" 
                      value={profile.addressDetails.postOfficeBoxNo} 
                      onChange={(e) => handleNestedInputChange('addressDetails', 'postOfficeBoxNo', e.target.value)} 
                      disabled={isSaving}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="box-office-location" className="text-sm font-medium">Box Location</Label>
                    <Input 
                      id="box-office-location" 
                      value={profile.addressDetails.boxOfficeLocation} 
                      onChange={(e) => handleNestedInputChange('addressDetails', 'boxOfficeLocation', e.target.value)} 
                      disabled={isSaving}
                      className="h-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information - Takes 1 column */}
          <div className="space-y-6">
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </div>

          {/* Regulatory Information - Takes 1 column */}
          <div className="space-y-6">
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Regulatory Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-reg-number" className="text-sm font-medium">Business Registration Number</Label>
                  <Input 
                    id="business-reg-number" 
                    value={profile.regulatoryDetails.businessRegistrationNumber} 
                    onChange={(e) => handleNestedInputChange('regulatoryDetails', 'businessRegistrationNumber', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year-of-registration" className="text-sm font-medium">Year of Registration</Label>
                  <Input 
                    id="year-of-registration" 
                    type="number"
                    value={profile.regulatoryDetails.yearOfRegistration} 
                    onChange={(e) => handleNestedInputChange('regulatoryDetails', 'yearOfRegistration', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tin" className="text-sm font-medium">TIN</Label>
                  <Input 
                    id="tin" 
                    value={profile.regulatoryDetails.tin} 
                    onChange={(e) => handleNestedInputChange('regulatoryDetails', 'tin', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat-reg-number" className="text-sm font-medium">VAT Reg Number</Label>
                  <Input 
                    id="vat-reg-number" 
                    value={profile.regulatoryDetails.vatRegNumber} 
                    onChange={(e) => handleNestedInputChange('regulatoryDetails', 'vatRegNumber', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat-rate" className="text-sm font-medium">VAT Rate</Label>
                  <Input 
                    id="vat-rate" 
                    value={profile.regulatoryDetails.vatRate} 
                    onChange={(e) => handleNestedInputChange('regulatoryDetails', 'vatRate', e.target.value)} 
                    disabled={isSaving}
                    placeholder="e.g., 18%"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nssf-reg-no" className="text-sm font-medium">NSSF Reg No</Label>
                  <Input 
                    id="nssf-reg-no" 
                    value={profile.regulatoryDetails.nssfRegNo} 
                    onChange={(e) => handleNestedInputChange('regulatoryDetails', 'nssfRegNo', e.target.value)} 
                    disabled={isSaving}
                    className="h-9"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Custom Sections - Full Width */}
        {profile.customSections.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <h2 className="text-xl font-semibold">Additional Information</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {profile.customSections.map((section, sectionIndex) => (
                <Card key={section.id} className="h-fit">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-medium">
                          {sectionIndex + 5}
                        </div>
                        <Input
                          value={section.title}
                          onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                          className="h-8 font-semibold border-none p-0 bg-transparent"
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
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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
                            className="flex-1 h-9"
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
                            className="flex-1 h-9"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFieldFromSection(section.id, field.id)}
                            disabled={isSaving}
                            className="px-2 h-9"
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
                        className="w-full h-9"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Field
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Section */}
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={addCustomSection}
            disabled={isSaving}
            className="w-full h-12 border-dashed border-2 hover:border-solid"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Section
          </Button>
        </div>


        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pb-6">
          <Button
            variant="outline"
            onClick={scrollToTop}
            className="h-10"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Scroll to Top
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving} className="h-10 px-8">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save and Continue
                </Button>
        </div>
      </div>
    </div>
  );
}