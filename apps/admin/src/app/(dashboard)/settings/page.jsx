"use client";
import React, { useEffect, useState } from "react";
import { Save, Store } from "lucide-react";
import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/store/settingApi";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";

import BrandIdentityCard from "./components/BrandIdentityCard";
import ContactSocialCard from "./components/ContactSocialCard";
import TeamMembersCard from "./components/TeamMembersCard";

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
        i === index ? { ...member, [field]: value } : member,
      ),
    );
  };

  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      { name: "", role: "", description: "", image: "", file: null },
    ]);
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
            : member,
        ),
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
    <form onSubmit={onSubmit} className="space-y-6 md:space-y-8 pb-10">
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

      <div className="space-y-6 md:space-y-8 px-0">
        <BrandIdentityCard
          formData={formData}
          handleChange={handleChange}
          previewUrl={previewUrl}
          handleImageChange={handleImageChange}
          logoUrl={logoUrl}
          handleLogoChange={handleLogoChange}
        />

        <ContactSocialCard
          formData={formData}
          handleChange={handleChange}
        />

        <TeamMembersCard
          teamMembers={teamMembers}
          addTeamMember={addTeamMember}
          removeTeamMember={removeTeamMember}
          handleTeamMemberChange={handleTeamMemberChange}
          handleTeamImageChange={handleTeamImageChange}
        />
      </div>
    </form>
  );
}
