"use client";
import React, { useEffect, useState } from "react";
import {
  Save,
  Store,
  Palette,
  Type,
  AlignLeft,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
  Link as LinkIcon,
  MessageCircle,
  Users,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/store/settingApi";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";

export default function SettingsPage() {
  const { data, isLoading } = useGetSettingQuery();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();
  const [previewImage, setPreviewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [logoImage, setLogoImage] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");

  const [formData, setFormData] = useState({
    homePageHeadingTitle: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    instagramUrl: "",
    facebookUrl: "",
    whatsappNumber: "",
  });

  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    if (data?.success && data?.data) {
      setFormData({
        homePageHeadingTitle: data.data.homePageHeadingTitle || "",
        description: data.data.description || "",
        contactEmail: data.data.contactEmail || "",
        contactPhone: data.data.contactPhone || "",
        address: data.data.address || "",
        instagramUrl: data.data.instagramUrl || "",
        facebookUrl: data.data.facebookUrl || "",
        whatsappNumber: data.data.whatsappNumber || "",
      });
      setPreviewUrl(data.data.previewImage || "");
      setLogoUrl(data.data.logo || "");
      setTeamMembers(data.data.teamMembers || []);
    }
  }, [data]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoImage(file);
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTeamMemberChange = (index, field, value) => {
    setTeamMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", role: "", description: "", image: "", file: null }]);
  };

  const removeTeamMember = (index) => {
    const updated = [...teamMembers];
    updated.splice(index, 1);
    setTeamMembers(updated);
  };

  const handleTeamImageChange = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamMembers((prev) =>
        prev.map((member, i) =>
          i === index
            ? { ...member, file, image: URL.createObjectURL(file) }
            : member
        )
      );
    }
  };

  const onSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    try {
      const submitData = new FormData();
      submitData.append("homePageHeadingTitle", formData.homePageHeadingTitle);
      submitData.append("description", formData.description);
      submitData.append("contactEmail", formData.contactEmail);
      submitData.append("contactPhone", formData.contactPhone);
      submitData.append("address", formData.address);
      submitData.append("instagramUrl", formData.instagramUrl);
      submitData.append("facebookUrl", formData.facebookUrl);
      submitData.append("whatsappNumber", formData.whatsappNumber);
      if (previewImage) {
        submitData.append("previewImage", previewImage);
      }
      if (logoImage) {
        submitData.append("logo", logoImage);
      }

      const teamToSubmit = [];
      let fileIndex = 0;
      teamMembers.forEach((member) => {
        if (member.file) {
          submitData.append("teamImages", member.file);
          teamToSubmit.push({
            name: member.name,
            role: member.role,
            description: member.description,
            image: `FILE:${fileIndex}`,
          });
          fileIndex++;
        } else {
          teamToSubmit.push({
            name: member.name,
            role: member.role,
            description: member.description,
            image: member.image || "",
          });
        }
      });
      submitData.append("teamMembers", JSON.stringify(teamToSubmit));

      const res = await updateSetting(submitData).unwrap();
      if (res.success) {
        toast.success("Website settings updated successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 pb-10">
      <PageHeader
        badgeIcon={Store}
        badgeText="Website Configuration"
        titleMain="Storefront"
        titleAccent="Settings"
        description="Configure the visual identity, meta information, and global appearance of your customer-facing web application."
        actionIcon={Save}
        actionLabel={isUpdating ? "Saving..." : "Commit Changes"}
        onAction={onSubmit}
        showAction={true}
      />

      <div className="space-y-8 px-4 md:px-0">
        {/* Brand Identity Card */}
        <div className="p-6 rounded-[2rem] bg-card border border-border/40 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/20">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                Brand Identity & Assets
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Store logo, headings & hero metadata
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                Home Page Heading
              </label>
              <Input
                name="homePageHeadingTitle"
                value={formData.homePageHeadingTitle}
                onChange={handleChange}
                placeholder="e.g. See The World Clearly"
                className="h-12 rounded-xl bg-muted/40 border border-border/40 px-4 text-xs font-bold focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                Website Description (SEO & Hero)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your store..."
                className="w-full h-32 p-4 rounded-xl bg-muted/40 border border-border/40 text-xs font-medium focus:ring-primary/20 focus:border-primary outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                  Website Preview / Hero Image
                </label>
                <label className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border hover:border-primary/50 rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all overflow-hidden relative">
                  {previewUrl ? (
                    <div className="absolute inset-0">
                      <img
                        src={previewUrl.startsWith("blob:") ? previewUrl : previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" /> Change Image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-muted-foreground hover:text-primary transition-colors">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-60" />
                      <p className="text-xs font-bold">Click to upload preview image</p>
                      <p className="text-[9px] uppercase tracking-widest opacity-60 mt-1">PNG, JPG or WEBP</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                  Store Logo
                </label>
                <label className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border hover:border-primary/50 rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all overflow-hidden relative">
                  {logoUrl ? (
                    <div className="absolute inset-0 p-4 flex items-center justify-center">
                      <img
                        src={logoUrl.startsWith("blob:") ? logoUrl : logoUrl}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" /> Change Logo
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-muted-foreground hover:text-primary transition-colors">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-60" />
                      <p className="text-xs font-bold">Upload Logo</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Store Information Card */}
        <div className="p-6 rounded-[2rem] bg-card border border-border/40 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/20">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                Store Information
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Contact methods & physical location
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                Contact Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="pl-12 h-12 rounded-xl bg-muted/40 border border-border/40 text-xs font-bold focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                Contact Phone
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                </div>
                <Input
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  className="pl-12 h-12 rounded-xl bg-muted/40 border border-border/40 text-xs font-bold focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                WhatsApp Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <Input
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  className="pl-12 h-12 rounded-xl bg-muted/40 border border-border/40 text-xs font-bold focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                Store Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Street Name, City, Country"
                className="w-full h-24 p-4 rounded-xl bg-muted/40 border border-border/40 text-xs font-medium focus:ring-primary/20 focus:border-primary outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className="p-6 rounded-[2rem] bg-card border border-border/40 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/20">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <LinkIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                Social Links
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Connect channels for user navigation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                Instagram URL
              </label>
              <Input
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="h-12 rounded-xl bg-muted/40 border border-border/40 px-4 text-xs font-bold focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                Facebook URL
              </label>
              <Input
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="h-12 rounded-xl bg-muted/40 border border-border/40 px-4 text-xs font-bold focus-visible:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Team Members Card */}
        <div className="p-6 rounded-[2rem] bg-card border border-border/40 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                  Team Members
                </h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Manage team for the About page
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={addTeamMember}
              variant="outline"
              size="sm"
              className="h-9 px-4 rounded-xl border-border/40 text-xs font-bold"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Member
            </Button>
          </div>

          <div className="space-y-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="p-4 rounded-2xl border border-border/40 bg-muted/10 relative group">
                <button
                  type="button"
                  onClick={() => removeTeamMember(index)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Image Column */}
                  <div className="md:col-span-3">
                    <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-border hover:border-primary/50 rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all overflow-hidden relative">
                      {member.image ? (
                        <div className="absolute inset-0">
                          <img
                            src={member.image.startsWith("blob:") || member.image.startsWith("http") ? member.image : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${member.image}`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" /> Change Image
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-muted-foreground hover:text-primary transition-colors text-center">
                          <ImageIcon className="w-6 h-6 mb-2 opacity-60" />
                          <p className="text-[10px] font-bold">Upload Photo</p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleTeamImageChange(index, e)}
                      />
                    </label>
                  </div>
                  {/* Info Column */}
                  <div className="md:col-span-9 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">Name</label>
                        <Input
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                          placeholder="e.g. John Doe"
                          className="h-10 rounded-xl bg-muted/40 border border-border/40 px-4 text-xs focus-visible:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">Role</label>
                        <Input
                          value={member.role}
                          onChange={(e) => handleTeamMemberChange(index, "role", e.target.value)}
                          placeholder="e.g. Founder & CEO"
                          className="h-10 rounded-xl bg-muted/40 border border-border/40 px-4 text-xs focus-visible:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">Description</label>
                      <textarea
                        value={member.description}
                        onChange={(e) => handleTeamMemberChange(index, "description", e.target.value)}
                        placeholder="Brief bio or description..."
                        className="w-full h-20 p-3 rounded-xl bg-muted/40 border border-border/40 text-xs focus:ring-primary/20 focus:border-primary outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {teamMembers.length === 0 && (
              <div className="text-center p-8 border border-dashed border-border/60 rounded-2xl bg-muted/5">
                <Users className="w-8 h-8 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">No team members added yet.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Click the button above to add members to your about page.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
