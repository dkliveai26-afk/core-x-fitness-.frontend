'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import { PlanItem } from '@/types/database';
import { formatInrPrice, calculateDiscount } from '@/lib/plans-shared';
import {
  Dumbbell,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowUpDown,
  AlertCircle,
  Eye,
  Check,
  X,
  RefreshCw,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface PlanFormData {
  _id?: string;
  name: string;
  badge: string;
  shortDescription: string;
  duration: string;
  originalPrice: number | string;
  price: number | string;
  features: string[];
  ctaText: string;
  highlighted: boolean;
  displayOrder: number | string;
  isActive: boolean;
}

const emptyForm: PlanFormData = {
  name: '',
  badge: 'FOUNDATION TIER',
  shortDescription: '',
  duration: '/ MONTH',
  originalPrice: 2999,
  price: 1999,
  features: ['Full 18,500 sq ft main strength floor access', 'Eleiko Olympic platforms & Prime machined racks'],
  ctaText: 'Select Plan',
  highlighted: false,
  displayOrder: 1,
  isActive: true,
};

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<PlanFormData>(emptyForm);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [planToDelete, setPlanToDelete] = useState<PlanItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/plans', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Failed to load plans from database.');
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Database connection error.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPlans();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    const nextOrder = plans.length > 0 ? Math.max(...plans.map((p) => p.displayOrder || 0)) + 1 : 1;
    setFormData({
      ...emptyForm,
      displayOrder: nextOrder,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (plan: PlanItem) => {
    setIsEditMode(true);
    setFormData({
      _id: plan._id,
      name: plan.name,
      badge: plan.badge,
      shortDescription: plan.shortDescription,
      duration: plan.duration,
      originalPrice: plan.originalPrice,
      price: plan.price,
      features: [...plan.features],
      ctaText: plan.ctaText,
      highlighted: Boolean(plan.highlighted),
      displayOrder: plan.displayOrder,
      isActive: plan.isActive,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureInput.trim()],
    }));
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Plan Name is required.');
      return;
    }

    const priceNum = Number(formData.price);
    const originalPriceNum = Number(formData.originalPrice);

    if (isNaN(priceNum) || priceNum < 0) {
      setFormError('Current Price must be a valid non-negative number.');
      return;
    }
    if (isNaN(originalPriceNum) || originalPriceNum < 0) {
      setFormError('Original Price must be a valid non-negative number.');
      return;
    }
    if (formData.features.length === 0) {
      setFormError('Please add at least one benefit feature for this plan.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      const url = isEditMode && formData._id
        ? `/api/admin/plans/${formData._id}`
        : '/api/admin/plans';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          ...formData,
          price: priceNum,
          originalPrice: originalPriceNum,
          displayOrder: Number(formData.displayOrder) || 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save plan.');

      setSuccessMessage(isEditMode ? 'Plan updated successfully.' : 'New plan created and active on website.');
      setTimeout(() => setSuccessMessage(''), 4000);
      setIsModalOpen(false);
      fetchPlans();
    } catch (err: any) {
      setFormError(err.message || 'Error saving plan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (plan: PlanItem) => {
    try {
      const res = await fetch(`/api/admin/plans/${plan._id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ isActive: !plan.isActive }),
      });

      if (!res.ok) throw new Error('Failed to update plan status.');

      setPlans((prev) =>
        prev.map((p) => (p._id === plan._id ? { ...p, isActive: !p.isActive } : p))
      );
      setSuccessMessage(`Plan "${plan.name}" is now ${!plan.isActive ? 'Active' : 'Hidden'}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Status update error.');
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/plans/${planToDelete._id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      if (!res.ok) throw new Error('Failed to delete plan.');

      setPlans((prev) => prev.filter((p) => p._id !== planToDelete._id));
      setSuccessMessage(`Plan "${planToDelete.name}" deleted successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setPlanToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Deletion error.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPlans = plans.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePlansCount = plans.filter((p) => p.isActive).length;
  const inactivePlansCount = plans.filter((p) => !p.isActive).length;

  return (
    <AdminLayoutWrapper
      title="Membership Plans CMS"
      subtitle="Direct database management for public pricing tiers, features, badges, and card ordering."
      onRefresh={handleRefresh}
      isRefreshing={isRefreshing}
    >
      <div className="space-y-8 max-w-7xl animate-fade-in">
        {/* Success / Error Alerts */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm font-mono animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm font-mono">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-[#0D1117] border border-white/5 p-5 sm:p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold">
                TOTAL PLANS
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading mt-1">
                {isLoading ? '...' : plans.length}
              </h3>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-core-red">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0D1117] border border-white/5 p-5 sm:p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
                ACTIVE ON WEBSITE
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading mt-1">
                {isLoading ? '...' : activePlansCount}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0D1117] border border-white/5 p-5 sm:p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400 font-bold">
                HIDDEN / INACTIVE
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading mt-1">
                {isLoading ? '...' : inactivePlansCount}
              </h3>
            </div>
            <div className="p-3 bg-slate-500/10 rounded-xl border border-white/10 text-slate-400">
              <XCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0D1117] border border-white/5 p-5 sm:p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                CURRENCY STANDARD
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading mt-1">
                INR (₹)
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Action Header & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans by name, badge, description..."
              className="w-full bg-[#0D1117] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-core-red transition-all font-sans"
            />
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-gradient text-white text-xs font-heading font-bold uppercase tracking-wider shadow-glow-red hover:brightness-110 transition-all border border-core-red/50 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Plan</span>
          </button>
        </div>

        {/* Plans Management Table */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] font-mono text-slate-400 uppercase bg-white/[0.03] border-b border-white/5">
                <tr>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Plan Name & Badge</th>
                  <th className="px-5 py-4">Current Price</th>
                  <th className="px-5 py-4">Original Price</th>
                  <th className="px-5 py-4">Duration</th>
                  <th className="px-5 py-4">Features</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-xs font-mono text-slate-500">
                      Loading membership plans from MongoDB...
                    </td>
                  </tr>
                ) : filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-xs font-mono text-slate-500">
                      No plans found matching search query.
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan) => (
                    <tr
                      key={plan._id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Order */}
                      <td className="px-5 py-4">
                        <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                          {plan.displayOrder}
                        </span>
                      </td>

                      {/* Name & Badge */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-black text-white text-base uppercase tracking-tight">
                              {plan.name}
                            </span>
                            {plan.highlighted && (
                              <span className="px-2 py-0.5 rounded bg-core-red/15 border border-core-red/40 text-[9px] font-mono text-core-red font-bold uppercase tracking-wider">
                                SOUGHT AFTER
                              </span>
                            )}
                          </div>
                          <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {plan.badge}
                          </span>
                          <p className="text-xs text-slate-500 font-sans line-clamp-1 max-w-xs">
                            {plan.shortDescription}
                          </p>
                        </div>
                      </td>

                      {/* Current Price */}
                      <td className="px-5 py-4">
                        <span className="font-display font-black text-lg text-white">
                          {formatInrPrice(plan.price)}
                        </span>
                      </td>

                      {/* Original Price */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <span className="font-mono text-xs line-through text-slate-500 block">
                            {formatInrPrice(plan.originalPrice)}
                          </span>
                          {plan.originalPrice > plan.price && (
                            <span className="text-[10px] font-mono text-core-red font-bold block">
                              {calculateDiscount(plan.originalPrice, plan.price)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono text-slate-400">
                          {plan.duration}
                        </span>
                      </td>

                      {/* Features */}
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 text-xs font-mono border border-white/10">
                          {plan.features.length} Benefits
                        </span>
                      </td>

                      {/* Active Status */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleStatus(plan)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                            plan.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${plan.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          <span>{plan.isActive ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(plan)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
                            title="Edit Plan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setPlanToDelete(plan)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors border border-rose-500/20"
                            title="Delete Plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT PLAN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0D1117] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-core-red/10 border border-core-red/20 text-core-red text-[10px] font-mono uppercase tracking-widest font-bold">
                <Dumbbell className="w-3 h-3" />
                {isEditMode ? 'Modify Plan Data' : 'Add Membership Tier'}
              </div>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                {isEditMode ? `Edit ${formData.name} Plan` : 'Create New Plan'}
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Changes will automatically propagate to the public Plans page and booking allocation engine.
              </p>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs font-mono mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSavePlan} className="space-y-5 text-xs font-sans">
              {/* Row 1: Name & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. CORE, PERFORMANCE, HYPERTROPHY"
                    className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                    Badge / Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. FOUNDATION TIER, ATHLETIC STANDARD"
                    className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono uppercase"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. Essential Olympic strength & conditioning platform access."
                  className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red"
                />
              </div>

              {/* Row 2: Price, Original Price, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                    Current Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 1999"
                    className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono font-bold"
                  />
                  <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                    Display: {formatInrPrice(formData.price || 0)}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                    Original Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. 2999"
                    className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono"
                  />
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">
                    Display: {formatInrPrice(formData.originalPrice || 0)}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                    Duration Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. / MONTH, 3 Months"
                    className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono uppercase"
                  />
                </div>
              </div>

              {/* Row 3: CTA Button Text, Display Order, Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="e.g. Select Core Access"
                    className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                    Display Order (Sort Position)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    placeholder="e.g. 1"
                    className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono"
                  />
                </div>
              </div>

              {/* Checkboxes: Highlighted & Active */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.highlighted}
                    onChange={(e) => setFormData({ ...formData, highlighted: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#050607] border-white/20 text-core-red focus:ring-core-red"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Most Sought After</span>
                    <span className="text-[10px] text-slate-400">Renders elevated middle card with red neon gradient</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#050607] border-white/20 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Active on Website</span>
                    <span className="text-[10px] text-slate-400">Public visitors can view and book this plan</span>
                  </div>
                </label>
              </div>

              {/* Features Builder */}
              <div className="space-y-3">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Included Plan Benefits & Features ({formData.features.length})
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Type a benefit bullet point and click Add..."
                    className="flex-1 bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors border border-white/10"
                  >
                    Add Feature
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formData.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-core-red shrink-0" />
                        <span>{feature}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-red-gradient text-white font-heading text-xs uppercase font-bold tracking-wider shadow-glow-red hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Plan...</span>
                    </>
                  ) : (
                    <span>{isEditMode ? 'Update Plan' : 'Publish Plan'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {planToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D1117] border border-white/10 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white uppercase font-heading">
                Delete Plan "{planToDelete.name}"?
              </h3>
              <p className="text-xs text-slate-400">
                This will permanently delete the tier record from MongoDB. If you only want to hide it from visitors, use the Active/Hidden toggle instead.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setPlanToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlan}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
