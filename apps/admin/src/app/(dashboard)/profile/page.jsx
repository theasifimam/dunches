'use client';

import React, { useState, useEffect } from 'react';
import { useGetProfileQuery } from '@/store/authApi';
import { useUpdateUserMutation } from '@/store/userApi';
import { Loader2, User, Mail, Phone, Shield, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: profileResponse, isLoading: isProfileLoading, refetch } = useGetProfileQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const user = profileResponse?.data || profileResponse || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    if (user && user._id) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        password: '',
      });
    }
  }, [profileResponse]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Name is required.');
      return;
    }
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      
      await updateUser({
        id: user._id,
        body: payload
      }).unwrap();
      
      toast.success('Profile updated successfully');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif font-light tracking-tight text-foreground">
          My <span className="text-primary italic font-black font-sans">Profile</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage your personal administrator account details.
        </p>
      </div>

      <div className="bg-card border border-border/40 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 border-b border-border/20 pb-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-2xl">
              {formData.name ? formData.name[0].toUpperCase() : 'A'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{formData.name || 'Admin User'}</h3>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-0.5">{formData.role} Account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Full Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-background border-border/60 rounded-xl focus:ring-2 focus:ring-primary/20"
                placeholder="Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-background border-border/60 rounded-xl focus:ring-2 focus:ring-primary/20"
                placeholder="Email"
              />
            </div>

            <div className="space-y-2 opacity-70">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone Number (Read-only)
              </label>
              <Input
                type="text"
                value={formData.phone}
                readOnly
                className="bg-muted border-border/40 rounded-xl cursor-not-allowed"
              />
            </div>

            <div className="space-y-2 opacity-70">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Account Role (Read-only)
              </label>
              <Input
                type="text"
                value={formData.role.toUpperCase()}
                readOnly
                className="bg-muted border-border/40 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-border/20 pt-6">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Change Password (Leave empty to keep current)
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="bg-background border-border/60 rounded-xl focus:ring-2 focus:ring-primary/20 max-w-md"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isUpdating}
              className="rounded-full px-6 h-11 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-2"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
