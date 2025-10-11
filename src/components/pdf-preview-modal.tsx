"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  fileName: string;
  onDownload: () => void;
}

export function PDFPreviewModal({ 
  isOpen, 
  onClose, 
  pdfUrl, 
  fileName, 
  onDownload 
}: PDFPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>PDF Preview - {fileName}</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={onDownload} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={onClose} variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-[70vh] border-0"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-[70vh] text-gray-500">
              Loading PDF preview...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}