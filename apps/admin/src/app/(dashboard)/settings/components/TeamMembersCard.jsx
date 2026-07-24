"use client";

import React from "react";
import { Users, Plus, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TeamMembersCard({
  teamMembers,
  addTeamMember,
  removeTeamMember,
  handleTeamMemberChange,
  handleTeamImageChange,
}) {
  return (
    <div className="p-4 md:p-6 rounded-2xl md:rounded-4xl bg-card border border-border/40 shadow-sm space-y-4 md:space-y-6">
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
          <div
            key={index}
            className="p-4 rounded-2xl border border-border/40 bg-muted/10 relative group"
          >
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
                        src={
                          member.image.startsWith("blob:") ||
                          member.image.startsWith("http")
                            ? member.image
                            : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${member.image}`
                        }
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
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                      Name
                    </label>
                    <Input
                      value={member.name}
                      onChange={(e) =>
                        handleTeamMemberChange(index, "name", e.target.value)
                      }
                      placeholder="e.g. John Doe"
                      className="h-10 rounded-xl bg-muted/40 border border-border/40 px-4 text-xs focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                      Role
                    </label>
                    <Input
                      value={member.role}
                      onChange={(e) =>
                        handleTeamMemberChange(index, "role", e.target.value)
                      }
                      placeholder="e.g. Founder & CEO"
                      className="h-10 rounded-xl bg-muted/40 border border-border/40 px-4 text-xs focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                    Description
                  </label>
                  <textarea
                    value={member.description}
                    onChange={(e) =>
                      handleTeamMemberChange(
                        index,
                        "description",
                        e.target.value,
                      )
                    }
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
            <p className="text-sm font-medium text-muted-foreground">
              No team members added yet.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Click the button above to add members to your about page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
