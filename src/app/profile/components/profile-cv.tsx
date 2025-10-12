
"use client";

import React from 'react';
import { User } from '@/lib/types';
import { format } from 'date-fns';
import { Mail, Phone, MapPin, FileText, Building, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ProfileCVProps {
  user: User;
  roleName: string;
}

export function ProfileCV({ user, roleName }: ProfileCVProps) {
  return (
    <>
      <div className="print:p-0 print:m-0">
        <div className="cv-paper bg-white shadow-lg mx-auto print:shadow-none print:border-none">
          {/* Header */}
          <header className="text-center p-8 border-b-2 border-gray-200">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800">{user.name}</h1>
            <p className="text-lg text-primary mt-1">{user.headline || roleName}</p>
          </header>

          <div className="grid grid-cols-12">
            {/* Left Column */}
            <aside className="col-span-4 bg-gray-50 p-6 border-r-2 border-gray-200">
              <section className="mb-8">
                <h2 className="cv-section-title">Contact</h2>
                <div className="space-y-3 mt-3 text-sm">
                  {user.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.contact?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{user.contact.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </section>
              
              {user.skills && user.skills.length > 0 && (
                <section className="mb-8">
                    <h2 className="cv-section-title">Skills</h2>
                    <div className="flex flex-wrap gap-2 mt-3">
                    {user.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                    </div>
                </section>
              )}
              
              {user.academicDocuments && user.academicDocuments.length > 0 && (
                 <section>
                    <h2 className="cv-section-title">Documents</h2>
                    <div className="space-y-3 mt-3">
                    {user.academicDocuments.map(doc => (
                        <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-primary hover:underline">
                            <FileText className="h-4 w-4" />
                            <span>{doc.name}</span>
                        </a>
                    ))}
                    </div>
                </section>
              )}
            </aside>

            {/* Right Column */}
            <main className="col-span-8 p-6">
              {user.bio && (
                <section className="mb-8">
                    <h2 className="cv-section-title">Profile</h2>
                    <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{user.bio}</p>
                </section>
              )}

              {user.experience && user.experience.length > 0 && (
                 <section className="mb-8">
                    <h2 className="cv-section-title">Experience</h2>
                    <div className="mt-3 space-y-6">
                        {user.experience
                            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                            .map(exp => (
                             <div key={exp.id} className="relative pl-6">
                                <div className="absolute left-0 top-1 h-full w-px bg-gray-200"></div>
                                <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-white"></div>
                                <p className="text-xs text-gray-500">{format(new Date(exp.startDate), 'MMM yyyy')} - {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}</p>
                                <h3 className="font-semibold text-base text-gray-800">{exp.title}</h3>
                                <p className="text-sm text-gray-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
                                {exp.description && <p className="text-xs text-gray-500 mt-1">{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                 </section>
              )}

              {user.education && user.education.length > 0 && (
                 <section>
                    <h2 className="cv-section-title">Education</h2>
                    <div className="mt-3 space-y-6">
                        {user.education
                            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                            .map(edu => (
                            <div key={edu.id} className="relative pl-6">
                                <div className="absolute left-0 top-1 h-full w-px bg-gray-200"></div>
                                <div className="absolute left-[-5px] top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-white"></div>
                                <p className="text-xs text-gray-500">{format(new Date(edu.startDate), 'yyyy')} - {edu.endDate ? format(new Date(edu.endDate), 'yyyy') : 'Present'}</p>
                                <h3 className="font-semibold text-base text-gray-800">{edu.institution}</h3>
                                <p className="text-sm text-gray-600">{edu.degree}, {edu.fieldOfStudy}</p>
                           </div>
                        ))}
                    </div>
                 </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
