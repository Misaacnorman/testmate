
"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface RejectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => Promise<void>;
}

export function RejectionDialog({ isOpen, onClose, onSubmit }: RejectionDialogProps) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) return;
        setIsSubmitting(true);
        await onSubmit(reason);
        setIsSubmitting(false);
        setReason(''); // Reset for next time
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Certificate</DialogTitle>
                    <DialogDescription>Please provide a reason for rejecting this certificate. This will be sent back to the responsible party.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="rejection-reason" className="sr-only">Rejection Reason</Label>
                    <Textarea
                        id="rejection-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Type your comments here..."
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !reason.trim()} variant="destructive">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Rejection
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

    