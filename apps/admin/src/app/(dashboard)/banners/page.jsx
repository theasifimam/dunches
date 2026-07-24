/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element */
"use client";
import React from "react";
import dynamic from "next/dynamic";
import {
  Plus,
  Megaphone,
  Trash2,
  Edit2,
  Eye,
  TrendingUp,
  Clock,
  Layout,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/PageHeader";
const BannerDialog = dynamic(
  () =>
    import("@/components/admin/BannerDialog").then((mod) => mod.BannerDialog),
  { ssr: false },
);
import {
  useGetBannersQuery,
  useDeleteBannerMutation,
  useUpdateBannerMutation,
} from "@/store/bannerApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DUMMY_BANNERS } from "@/lib/dummyData";
import ViewSwitcher from "@/components/admin/ViewSwitcher";
// MongoDB ObjectId is exactly 24 hex characters
const isMongoId = (id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

export default function BannersPage() {
  const { data: result, isLoading: apiLoading } = useGetBannersQuery();
  const banners =
    result?.data && result.data.length > 0 ? result.data : DUMMY_BANNERS;
  const isLoading = apiLoading && !result;
  const isDemoMode = !result?.data || result.data.length === 0;
  const [deleteBanner] = useDeleteBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("card");
  React.useEffect(() => {
    const stored = localStorage.getItem("dunches_admin_view_banners");
    if (stored === "card" || stored === "list") {
      setViewMode(stored);
    }
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("dunches_admin_view_banners", mode);
  };

  const [editingBanner, setEditingBanner] = React.useState(null);

  const handleToggleStatus = async (banner) => {
    if (!isMongoId(banner.id)) {
      toast.info(
        "This is demo data. Create a real banner to manage its status.",
      );
      return;
    }
    const newStatus = banner.status === "Active" ? "Inactive" : "Active";
    const formData = new FormData();
    formData.append("status", newStatus);
    try {
      await updateBanner({ id: banner.id, formData }).unwrap();
      toast.success(`Announcement ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!isMongoId(id)) {
      toast.info(
        "Demo banners can't be deleted. Create your own banners first.",
      );
      return;
    }
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success("Announcement removed successfully");
    } catch (error) {
      toast.error("Failed to delete announcement");
    }
  };

  const handleEdit = (banner) => {
    if (!isMongoId(banner.id)) {
      // Demo banner — open the dialog pre-filled but without an id so it submits as CREATE
      setEditingBanner({ ...banner, id: undefined, _isDemoPrefill: true });
    } else {
      setEditingBanner(banner);
    }
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingBanner(null);
    setIsDialogOpen(true);
  };

  const activeCampaigns = React.useMemo(
    () => banners.filter((b) => b.status === "Active").length,
    [banners],
  );

  const scheduledCampaigns = React.useMemo(
    () => banners.filter((b) => b.status === "Scheduled").length,
    [banners],
  );

  const totalInteractions = React.useMemo(
    () => banners.reduce((acc, b) => acc + (b.clicks || 0), 0),
    [banners],
  );

  const campaignStats = React.useMemo(
    () => [
      {
        label: "Live Announcements",
        value: `${activeCampaigns} Active`,
        icon: Sparkles,
        color: "primary",
      },
      {
        label: "Scheduled Offers",
        value: `${scheduledCampaigns} Banners`,
        icon: Clock,
        color: "blue",
      },
      {
        label: "Avg. Interaction Rate",
        value: "N/A",
        icon: TrendingUp,
        color: "purple",
      },
    ],
    [activeCampaigns, scheduledCampaigns],
  );

  return (
    <div className="space-y-6 md:space-y-12 pb-10">
      <BannerDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        banner={editingBanner}
      />
      <PageHeader
        badgeIcon={Megaphone}
        badgeText="Announcements & Offers"
        titleMain="Promo"
        titleAccent="Hub"
        description="Manage announcements, special offers, and featured promotions. Content published here appears live on the Hero Slider and mobile promo carousel."
      >
        <div className="h-16 md:h-20 px-6 md:px-8 rounded-2xl md:rounded-4xl bg-card/80 backdrop-blur-md border-2 border-primary/10 shadow-sm flex flex-col justify-center gap-0.5 md:gap-1 min-w-45 md:min-w-50 hover:border-primary/30 transition-all duration-500">
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
            Total Impressions
          </p>
          <div className="flex items-end justify-between">
            <h4 className="text-xl md:text-2xl font-black italic leading-none">
              {totalInteractions.toLocaleString()}
            </h4>
            <div className="flex items-center gap-1 text-primary text-[9px] md:text-[10px] font-black italic uppercase">
              <TrendingUp className="h-3 w-3" />
            </div>
          </div>
        </div>
        <Button
          variant="signature"
          size="xl"
          className="h-16 md:h-20 w-full sm:w-auto"
          onClick={handleCreateNew}
        >
          <div className="flex flex-col items-center gap-0.5 md:gap-1">
            <Plus className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:rotate-90 transition-transform duration-500" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">
              New Announcement
            </span>
          </div>
        </Button>
      </PageHeader>

      {/* Campaign Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-0">
        {campaignStats.map((stat, i) => (
          <div
            key={i}
            className="p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-card border shadow-sm border-primary/5 hover:border-primary/20 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div
                className={cn(
                  "h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                  stat.color === "primary"
                    ? "bg-primary text-primary-foreground shadow-primary/20"
                    : "bg-muted text-muted-foreground shadow-sm",
                )}
              >
                <stat.icon className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <h3 className="text-xl md:text-3xl font-black tracking-tighter italic">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Layout Toggle Actions */}
      <div className="flex justify-between items-center px-0">
        <h3 className="text-lg font-black uppercase tracking-tight italic">
          Announcements & Offers
        </h3>
        <ViewSwitcher
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </div>

      {/* Grid of Banners - Enhanced High-Fidelity Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 px-0">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-100 w-full rounded-[3rem]" />
          ))}
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 px-0">
          {/* Demo mode notice */}
          {isDemoMode && (
            <div className="lg:col-span-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <p className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Showing demo banners — no real banners in database yet. Click{" "}
                <span className="underline underline-offset-2">Edit</span> on
                any to use it as a template, or create a fresh one.
              </p>
            </div>
          )}
          {banners.map((banner) => {
            const isDemo = !isMongoId(banner.id);
            return (
              <div
                key={banner.id}
                className="group rounded-3xl bg-card border shadow-sm border-primary/5 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-700"
              >
                {/* Banner Preview Image */}
                <div className="relative h-72 overflow-hidden bg-muted">
                  <img
                    src={
                      banner.image.startsWith("http")
                        ? banner.image
                        : banner.image.startsWith("/")
                          ? banner.image
                          : `/${banner.image}`
                    }
                    alt={banner.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/20",
                          banner.status === "Active"
                            ? "bg-primary/20 text-primary border-primary/30"
                            : banner.status === "Scheduled"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-muted/20 text-muted-foreground",
                        )}
                      >
                        {banner.status}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                        <Layout className="h-3 w-3" /> {banner.placement}
                      </span>
                      {isDemo && (
                        <span className="px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest bg-amber-500/30 text-amber-300 border border-amber-400/30">
                          Demo
                        </span>
                      )}
                    </div>
                    <h4 className="text-2xl font-black text-white italic tracking-tight">
                      {banner.title}
                    </h4>
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 -translate-y-2.5 group-hover:translate-y-0 transition-all duration-500">
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      onClick={() => handleEdit(banner)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-destructive hover:border-destructive"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Banner Stats Footer */}
                <div className="p-4 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6 bg-card relative z-10">
                  <div className="flex items-center gap-4 md:gap-8">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Eye className="h-3 w-3" /> Interactions
                      </p>
                      <p className="text-xs md:text-sm font-black italic">
                        {banner.clicks.toLocaleString()} clicks
                      </p>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> Expiry
                      </p>
                      <p className="text-xs md:text-sm font-black italic">
                        {banner.expiry
                          ? new Date(banner.expiry).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-primary/5 sm:justify-end">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mr-auto sm:mr-0">
                      {isDemo ? (
                        <span className="text-amber-500">Demo — read only</span>
                      ) : (
                        "Visibility"
                      )}
                    </p>
                    <button
                      onClick={() => handleToggleStatus(banner)}
                      className={cn(
                        "h-6 w-12 rounded-full relative transition-all duration-500 p-1 shrink-0",
                        isDemo ? "opacity-40 cursor-not-allowed" : "",
                        banner.status === "Active"
                          ? "bg-primary shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                          : "bg-muted",
                      )}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-500 transform",
                          banner.status === "Active"
                            ? "translate-x-6"
                            : "translate-x-0",
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create New Campaign - Placeholder Card */}
          <div
            onClick={handleCreateNew}
            className="group rounded-[3rem] bg-muted/20 border border-dashed border-primary/20 overflow-hidden flex flex-col items-center justify-center p-10 hover:bg-primary/2 hover:border-primary/40 transition-all duration-500 cursor-pointer min-h-100"
          >
            <div className="h-20 w-20 rounded-4xl bg-card border shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              <Plus className="h-10 w-10" />
            </div>
            <div className="text-center mt-6">
              <h4 className="text-xl font-black uppercase tracking-tight italic">
                Create New Announcement
              </h4>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 max-w-50 mx-auto opacity-60 leading-relaxed">
                Publish an offer or announcement to the live storefront.
              </p>
            </div>
            <Button
              variant="ghost"
              className="mt-8 rounded-full font-black uppercase tracking-widest text-[9px] group-hover:text-primary"
            >
              Create
            </Button>
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="rounded-[2.5rem] bg-card border border-border/40 overflow-hidden shadow-sm mx-4 md:mx-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-6 py-4 w-28">Preview</th>
                  <th className="px-6 py-4">Title & Placement</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Expiry</th>
                  <th className="px-6 py-4 hidden md:table-cell">
                    Interactions
                  </th>
                  <th className="px-6 py-4 text-center">Visibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {banners.map((banner) => (
                  <tr
                    key={banner.id}
                    className="group hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="relative h-12 w-20 rounded-xl overflow-hidden border border-border/30 shadow-sm bg-muted shrink-0">
                        <img
                          src={
                            banner.image.startsWith("http")
                              ? banner.image
                              : banner.image.startsWith("/")
                                ? banner.image
                                : `/${banner.image}`
                          }
                          alt={banner.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-sm text-foreground mb-0.5 leading-tight">
                          {banner.title}
                        </p>
                        <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {banner.placement}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          banner.status === "Active"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : banner.status === "Scheduled"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-muted text-muted-foreground border-border/20",
                        )}
                      >
                        {banner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-xs font-bold text-muted-foreground">
                      {banner.expiry
                        ? new Date(banner.expiry).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-xs font-black italic">
                      {banner.clicks.toLocaleString()} clicks
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleToggleStatus(banner)}
                          className={cn(
                            "h-5 w-9 rounded-full relative transition-all duration-300 p-0.5 shrink-0",
                            banner.status === "Active"
                              ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                              : "bg-muted",
                          )}
                        >
                          <div
                            className={cn(
                              "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 transform",
                              banner.status === "Active"
                                ? "translate-x-4"
                                : "translate-x-0",
                            )}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                          onClick={() => handleEdit(banner)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
