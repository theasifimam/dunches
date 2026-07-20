/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { Search, Edit2, Trash2, ArrowUpDown, XCircle, Layers, Tag, Image as ImageIcon, TrendingUp, Loader2, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
const CategoryDialog = dynamic(() => import('@/components/admin/CategoryDialog').then(mod => mod.CategoryDialog), { ssr: false });
import { useGetCategoriesQuery, useDeleteCategoryMutation, useUpdateCategoryMutation } from '@/store/categoryApi';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import ViewSwitcher from '@/components/admin/ViewSwitcher';
export default function CategoriesPage() {
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const { data: categoriesData, isLoading, isError, error } = useGetCategoriesQuery({ all: true });
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
    const categories = categoriesData?.data || [];
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const [viewMode, setViewMode] = useState("list");
    React.useEffect(() => {
        const stored = localStorage.getItem("dunches_admin_view_categories");
        if (stored === "card" || stored === "list") {
            setViewMode(stored);
        }
    }, []);

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem("dunches_admin_view_categories", mode);
    };

    const handleToggleStatus = async (category) => {
        try {
            await updateCategory({
                id: category._id,
                body: { isActive: !category.isActive }
            }).unwrap();
            toast.success(`Category ${!category.isActive ? 'activated' : 'hidden'} successfully`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update category status');
        }
    };
    const openAddCategoryDialog = () => {
        setEditingCategory(null);
        setIsCategoryDialogOpen(true);
    };
    const openEditCategoryDialog = (category) => {
        setEditingCategory(category);
        setIsCategoryDialogOpen(true);
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id).unwrap();
                toast.success('Category deleted successfully');
            }
            catch (err) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                toast.error(err?.data?.message || 'Failed to delete category');
            }
        }
    };
    if (isLoading) {
        return (<div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            </div>);
    }
    if (isError) {
        return (<div className="flex h-[400px] flex-col items-center justify-center gap-4 text-destructive">
                <XCircle className="h-12 w-12"/>
                <p className="font-bold uppercase tracking-widest text-[10px]">Failed to load categories</p>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <p className="text-sm font-medium">{error?.data?.message || 'Something went wrong'}</p>
            </div>);
    }
    const filteredCategories = categories.filter(cat => cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(categorySearchTerm.toLowerCase()));
    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 bg-card border border-border/40 px-5 py-3 rounded-2xl shadow-sm">
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Categories:</div>
            <div className="text-xl font-black text-primary font-serif leading-none">{categories.length}</div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={openAddCategoryDialog}
              variant="signature"
              className="rounded-full px-5 h-11 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/95"
            >
              + Draft Collection
            </Button>
          </div>
        </div>

        {/* Taxonomy Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Active Clusters', value: '12 Active', icon: Layers, color: 'primary' },
            { label: 'Deepest Hierarchy', value: '4 Levels', icon: ArrowUpDown, color: 'blue' },
            { label: 'Hidden Blueprints', value: '2 Hidden', icon: XCircle, color: 'destructive' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-card border border-border/40 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon className="h-16 w-16 text-primary" />
                </div>
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4", 
                  stat.color === 'primary' ? "bg-primary/10 text-primary" : 
                  stat.color === 'destructive' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">{stat.label}</p>
                <h4 className="text-2xl font-bold text-foreground leading-none">{stat.value}</h4>
              </div>
            );
          })}
        </div>

        {/* Filters Bar */}
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
          <div className="relative group flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors"/>
            <Input 
              placeholder="Search by collection name or slug..." 
              className="h-12 w-full pl-12 pr-4 bg-card border border-border/60 rounded-2xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
              value={categorySearchTerm} 
              onChange={(e) => setCategorySearchTerm(e.target.value)}
            />
          </div>
          <ViewSwitcher viewMode={viewMode} onViewModeChange={handleViewModeChange} />
        </div>

        {/* Categories Table / Cards */}
        <div className="rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm">
          {viewMode === "list" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-4 w-16 text-center hidden xs:table-cell">Visual</th>
                  <th className="px-4 py-4">Collection Identity</th>
                  <th className="px-4 py-4 hidden sm:table-cell">Registry Slug</th>
                  <th className="px-4 py-4 hidden md:table-cell">Parent Nexus</th>
                  <th className="px-4 py-4 text-center">Manifest Count</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="group hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-4 hidden xs:table-cell">
                      <div className="relative h-11 w-11 mx-auto">
                        <div className="relative h-full w-full rounded-xl overflow-hidden border border-border/30 shadow-sm bg-muted shrink-0 z-10 flex items-center justify-center">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="h-full w-full object-cover"/>
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground/40"/>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-sm text-foreground mb-0.5 leading-tight truncate">{cat.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[120px] opacity-70">{cat._id}</p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                        /{cat.slug}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary italic">
                        {cat.parent ? (typeof cat.parent === 'object' ? cat.parent.name : cat.parent) : 'Root level'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-sm">
                      {cat.productsCount || 0}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-12">
                          {cat.isActive ? "Active" : "Hidden"}
                        </span>
                        <button
                          onClick={() => handleToggleStatus(cat)}
                          disabled={isUpdating}
                          className={cn(
                            "h-5 w-9 rounded-full relative transition-all duration-300 p-0.5 shrink-0",
                            cat.isActive
                              ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                              : "bg-muted"
                          )}
                        >
                          <div
                            className={cn(
                              "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 transform",
                              cat.isActive ? "translate-x-4" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-1.5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => openEditCategoryDialog(cat)} className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all">
                          <Edit2 className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" disabled={isDeleting} onClick={() => handleDelete(cat._id)} className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all">
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-muted/5">
            {filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className="group rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Image Header */}
                  <div className="relative aspect-video w-full bg-muted overflow-hidden border-b border-border/20 flex items-center justify-center">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">No Image</span>
                      </div>
                    )}
                    
                    {/* Active Toggle Status Button */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/40 shadow-sm">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        {cat.isActive ? "Active" : "Hidden"}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        disabled={isUpdating}
                        className={cn(
                          "h-5 w-9 rounded-full relative transition-all duration-300 p-0.5 shrink-0",
                          cat.isActive
                            ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                            : "bg-muted"
                        )}
                      >
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 transform",
                            cat.isActive ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1 mb-1" title={cat.name}>
                        {cat.name}
                      </h4>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                        ID: {cat._id}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-medium">
                        <span>Registry Slug</span>
                        <span className="text-foreground bg-muted px-2 py-0.5 rounded">/{cat.slug}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-medium">
                        <span>Parent Nexus</span>
                        <span className="text-primary italic">
                          {cat.parent ? (typeof cat.parent === 'object' ? cat.parent.name : cat.parent) : 'Root level'}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-medium">
                        <span>Manifest Count</span>
                        <span className="font-black text-foreground">{cat.productsCount || 0} products</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-5 border-t border-border/10 flex justify-end gap-2 bg-muted/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditCategoryDialog(cat)}
                    className="h-8 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all font-bold uppercase text-[9px] tracking-wider px-3 flex items-center gap-1"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => handleDelete(cat._id)}
                    className="h-8 rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all font-bold uppercase text-[9px] tracking-wider px-3 flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <CategoryDialog isOpen={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen} category={editingCategory} categories={categories.map(c => ({ id: c._id, name: c.name }))}/>
      </div>
    );
}
