'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, AlertCircle } from "lucide-react";

export function LogoutConfirmDialog({ isOpen, onOpenChange, onConfirm }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-6 rounded-3xl border border-border/40 bg-card/90 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center gap-2 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-2">
            <AlertCircle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold font-serif text-foreground">
            Sign Out
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to end your active session?
          </DialogDescription>
        </DialogHeader>
        
        <p className="text-sm text-muted-foreground text-center mb-6">
          You will need to sign in again to access any administrative panels or metrics.
        </p>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="flex-1 rounded-xl h-11 text-xs font-bold uppercase tracking-wider"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            className="flex-1 rounded-xl h-11 text-xs font-bold uppercase tracking-wider bg-destructive text-white hover:bg-destructive/90"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

