'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGetUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation } from '@/store/userApi';
import { Loader2, User, Mail, Phone, Shield, Save, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function CustomerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { data: userResponse, isLoading: isUserLoading, refetch } = useGetUserByIdQuery(id, { skip: !id });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const user = userResponse?.data || userResponse || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    isActive: true,
  });

  useEffect(() => {
    if (user && user._id) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        isActive: user.isActive !== false,
      });
    }
  }, [userResponse]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Name is required.');
      return;
    }
    
    try {
      await updateUser({
        id,
        body: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive
        }
      }).unwrap();
      
      toast.success('Ambassador profile updated');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to terminate this identity?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('Identity purged successfully');
        router.push('/customers');
      } catch (err) {
        toast.error(err?.data?.message || 'Purge failed');
      }
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/customers')}
          className="h-10 w-10 rounded-full border border-border/40 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-serif font-light tracking-tight text-foreground">
            Identity <span className="text-primary italic font-black font-sans">Blueprint</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage Ambassador details, access scopes, and activation.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border/40 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 border-b border-border/20 pb-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-black text-2xl">
              {formData.name ? formData.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{formData.name || 'Unknown User'}</h3>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-0.5">{formData.role} Registry</p>
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

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone Number (Read-only)
              </label>
              <Input
                type="text"
                value={formData.phone}
                readOnly
                className="bg-muted border-border/40 rounded-xl cursor-not-allowed opacity-70"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Registry Scope
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full h-11 bg-background border border-border/60 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border/20 pt-6">
            <div>
              <h4 className="text-sm font-bold text-foreground">Ambassador Active Status</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle whether this account can access system modules.</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`w-12 h-6 rounded-full transition-colors flex items-center p-0.5 ${formData.isActive ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex justify-between items-center border-t border-border/20 pt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={handleDelete}
              className="rounded-full px-5 h-11 text-xs font-bold uppercase tracking-wider text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Terminate Identity
            </Button>
            
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
              Save Blueprint
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
