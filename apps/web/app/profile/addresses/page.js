"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Home,
  Briefcase,
  Map,
  Phone,
  Star,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AddressModal from "@/components/AddressModal";
import {
  selectAddresses,
  selectUserError,
  addAddress,
  updateAddress,
  deleteAddress,
  clearError,
} from "@/features/user/userSlice";

function LabelIcon({ label }) {
  if (label === "Work") return <Briefcase className="w-4 h-4" />;
  if (label === "Other") return <Map className="w-4 h-4" />;
  return <Home className="w-4 h-4" />;
}

export default function AddressesPage() {
  const dispatch = useDispatch();
  const addresses = useSelector(selectAddresses);
  const serverError = useSelector(selectUserError);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const openAdd = () => {
    setEditing(null);
    setModalError("");
    setModalOpen(true);
  };
  const openEdit = (addr) => {
    setEditing(addr);
    setModalError("");
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setModalError("");
  };

  const handleSubmit = async (formData) => {
    setModalLoading(true);
    setModalError("");
    try {
      const result = editing?._id
        ? await dispatch(
            updateAddress({ addressId: editing._id, updates: formData }),
          )
        : await dispatch(addAddress(formData));

      if (result.error) {
        setModalError(result.payload || "Failed to save address");
      } else {
        closeModal();
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await dispatch(deleteAddress(id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-foreground/30 mb-1">
            Saved Locations
          </p>
          <h1 className="text-2xl font-black font-heading tracking-tight">
            Delivery Addresses
          </h1>
        </div>
        <Button
          onClick={openAdd}
          className="h-10 px-5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New
        </Button>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {serverError}
          <button onClick={() => dispatch(clearError())} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty state */}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 bg-foreground/2 border border-border/50 border-dashed rounded-4xl">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <MapPin className="w-8 h-8 text-primary/50" />
          </div>
          <div className="text-center">
            <p className="text-sm font-black font-heading uppercase tracking-widest mb-2">
              No Addresses Yet
            </p>
            <p className="text-[10px] text-foreground/40 max-w-[240px] leading-relaxed">
              Add your first delivery address so we can send your snacks
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="h-11 px-8 rounded-full text-[10px] font-black tracking-widest uppercase"
          >
            <Plus className="w-3.5 h-3.5 mr-2" /> Add First Address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {addresses.map((addr) => (
              <motion.div
                key={addr._id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`relative p-6 sm:p-7 border rounded-[1.75rem] transition-all group ${
                  addr.isDefault
                    ? "bg-primary/4 border-primary/25"
                    : "bg-foreground/2 border-border/50 hover:border-border"
                }`}
              >
                {/* Label row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        addr.isDefault
                          ? "bg-primary/20 text-primary"
                          : "bg-foreground/5 text-foreground/40"
                      }`}
                    >
                      <LabelIcon label={addr.label} />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        addr.isDefault ? "text-primary" : "text-foreground/60"
                      }`}
                    >
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <div className="flex items-center gap-1 bg-primary/15 border border-primary/20 rounded-full px-2.5 py-0.5">
                        <Star className="w-2.5 h-2.5 text-primary" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary">
                          Default
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => openEdit(addr)}
                      className="w-8 h-8 rounded-xl border border-border/50 bg-foreground/3 flex items-center justify-center text-foreground/40 hover:text-primary hover:border-primary/30 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="w-8 h-8 rounded-xl border border-border/50 bg-foreground/3 flex items-center justify-center text-foreground/40 hover:text-red-500 hover:border-red-500/30 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <Separator className="opacity-20 mb-4" />

                {/* Address details */}
                <div className="space-y-1">
                  <p className="text-sm font-bold">{addr.fullName}</p>
                  <p className="text-[11px] text-foreground/50 leading-relaxed">
                    {addr.line1}
                    {addr.line2 && `, ${addr.line2}`}
                  </p>
                  <p className="text-[11px] text-foreground/50">
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Phone className="w-3 h-3 text-foreground/30" />
                    <span className="text-[10px] font-bold text-foreground/40">
                      {addr.mobile}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AddressModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={editing}
        loading={modalLoading}
        error={modalError}
      />
    </motion.div>
  );
}
