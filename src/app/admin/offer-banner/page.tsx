'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import { OfferBannerItem } from '@/types/database';
import {
  Tag,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Trash2,
  RefreshCw,
  Eye,
  Check,
  X,
  FileCheck,
} from 'lucide-react';

export default function AdminOfferBannerPage() {
  const [banner, setBanner] = useState<OfferBannerItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Upload / Edit form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [optionalSubtitle, setOptionalSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT');
  const [linkUrl, setLinkUrl] = useState('#pricing-matrix');
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanner = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/offer-banner', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Failed to load offer banner from database.');
      const data = await res.json();
      if (data.banner) {
        setBanner(data.banner);
        setTitle(data.banner.title || '');
        setOptionalSubtitle(data.banner.optionalSubtitle || '');
        setBadgeText(data.banner.badgeText || 'LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT');
        setLinkUrl(data.banner.linkUrl || '#pricing-matrix');
        setIsActive(data.banner.isActive);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Database connection error.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBanner();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setFormError('File size exceeds 10MB limit. Please upload an optimized banner image.');
      return;
    }

    // Validate type or extension
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    const isAllowedExt = /\.(png|jpe?g|webp|svg|gif)$/i.test(file.name);
    const isAllowedMime = validTypes.includes(file.type) || file.type.startsWith('image/');

    if (!isAllowedMime && !isAllowedExt) {
      setFormError('Invalid file type. Allowed formats: PNG, JPG, JPEG, WEBP, SVG, GIF.');
      return;
    }

    setSelectedFile(file);
    setFormError('');
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUploadBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !banner?.imageUrl && !previewUrl) {
      setFormError('Please select a promotional banner image or enter an image URL.');
      return;
    }

    setIsUploading(true);
    setFormError('');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (previewUrl && !previewUrl.startsWith('blob:')) {
        formData.append('imageUrl', previewUrl);
      } else if (banner?.imageUrl) {
        formData.append('imageUrl', banner.imageUrl);
      }
      formData.append('title', title);
      formData.append('optionalSubtitle', optionalSubtitle);
      formData.append('badgeText', badgeText);
      formData.append('linkUrl', linkUrl);
      formData.append('isActive', String(isActive));

      const res = await fetch('/api/admin/offer-banner', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save offer banner.');

      setSuccessMessage('Offer banner updated successfully and active on public Plans page.');
      setTimeout(() => setSuccessMessage(''), 4000);
      setSelectedFile(null);
      setPreviewUrl('');
      fetchBanner();
    } catch (err: any) {
      setFormError(err.message || 'Error uploading banner.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const res = await fetch('/api/admin/offer-banner/toggle', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner?.isActive }),
      });

      if (!res.ok) throw new Error('Failed to update banner status.');
      const data = await res.json();

      setBanner((prev) => (prev ? { ...prev, isActive: data.isActive } : null));
      setSuccessMessage(`Offer banner is now ${data.isActive ? 'Active on website' : 'Hidden from public'}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Status update error.');
    }
  };

  const handleRemoveBanner = async () => {
    if (!confirm('Are you sure you want to remove the promotional offer banner from the public website?')) {
      return;
    }

    try {
      const res = await fetch('/api/admin/offer-banner', {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      if (!res.ok) throw new Error('Failed to remove banner.');

      setBanner((prev) => (prev ? { ...prev, isActive: false } : null));
      setSuccessMessage('Offer banner removed from public Plans page.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error removing banner.');
    }
  };

  const currentDisplayImage = previewUrl || banner?.imageUrl || '/plans-offer-banner.png';

  return (
    <AdminLayoutWrapper
      title="Offer Banner CMS"
      subtitle="Single exclusive promotional banner management for the public Plans & Pricing page."
      onRefresh={handleRefresh}
      isRefreshing={isRefreshing}
    >
      <div className="space-y-8 max-w-5xl animate-fade-in">
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

        {/* Rule Notice Card */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-lg flex items-start gap-4">
          <div className="p-3 bg-core-red/10 rounded-xl border border-core-red/30 text-core-red shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wide">
              Single Banner Architecture
            </h3>
            <p className="text-slate-400 font-sans leading-relaxed">
              Only <span className="text-white font-semibold">ONE</span> promotional offer banner exists for the public Plans page. When you upload or replace this banner, it replaces the current graphic and immediately appears at the exact fixed offer section beneath the membership pricing cards.
            </p>
          </div>
        </div>

        {/* Live Banner Preview Card */}
        <div className="bg-[#0D1117] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-core-red">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase font-heading">
                  Live Banner Preview
                </h2>
                <p className="text-xs text-slate-400">
                  {selectedFile ? 'Showing unsaved local preview' : 'Active production graphic'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {banner && (
                <button
                  onClick={handleToggleStatus}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                    banner.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${banner.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span>{banner.isActive ? 'Active on Website' : 'Hidden from Website'}</span>
                </button>
              )}

              {banner?.isActive && (
                <button
                  onClick={handleRemoveBanner}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors border border-rose-500/20"
                  title="Remove Banner from Website"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Render in exact same frame as public plans page */}
          <div className="relative p-2 sm:p-4 rounded-2xl bg-core-void/90 border border-white/10 flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient Red Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-32 bg-core-red/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-core-dark relative z-10">
              <Image
                src={currentDisplayImage}
                alt={title || 'Core X Fitness Exclusive Offer'}
                width={996}
                height={300}
                className="w-full h-auto object-contain"
                unoptimized={Boolean(previewUrl || currentDisplayImage?.startsWith('data:'))}
              />
            </div>

            <span className="mt-3 text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase flex items-center gap-1.5 text-center">
              <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse" />
              {badgeText || 'LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT'}
            </span>
          </div>

          {banner?.updatedAt && (
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pt-2">
              <span>IMAGE PATH: {banner.imageUrl}</span>
              <span>UPDATED: {new Date(banner.updatedAt).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        {/* Upload / Replace Banner Card */}
        <div className="bg-[#0D1117] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="p-2.5 rounded-xl bg-core-red/10 border border-core-red/20 text-core-red">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase font-heading">
                Upload & Replace Offer Banner
              </h2>
              <p className="text-xs text-slate-400">
                Upload a high-resolution banner graphic (recommended 1920×580 or 1200×360 PNG / WEBP)
              </p>
            </div>
          </div>

          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleUploadBanner} className="space-y-6 text-xs font-sans">
            {/* Quick-Pick Preset Banner Assets */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Quick-Pick Preset Banner Asset (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('/plans-offer-banner.png');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    previewUrl === '/plans-offer-banner.png'
                      ? 'bg-core-red text-white font-bold shadow-glow-red'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Default Plans Offer Banner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('/gymlogo1.png');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    previewUrl === '/gymlogo1.png'
                      ? 'bg-core-red text-white font-bold shadow-glow-red'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Core X Brand Mark
                </button>
              </div>
            </div>

            {/* File Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 hover:border-core-red/50 rounded-2xl p-6 sm:p-10 text-center cursor-pointer bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-core-red/10 border border-white/10 group-hover:border-core-red/30 flex items-center justify-center text-slate-400 group-hover:text-core-red transition-colors">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                    {selectedFile ? selectedFile.name : 'Click to Select Banner Image'}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1 font-mono">
                    PNG, WEBP, JPG up to 10MB
                  </p>
                </div>

                {selectedFile && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>File Selected: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                  Banner Title / Accessibility Alt Text
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Core X Fitness Exclusive Membership Offer - Get Up To 20% Off"
                  className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                  Bottom Caption / Badge Text
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="e.g. LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT"
                  className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono uppercase"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Make Active on Website Immediately</span>
                <span className="text-[10px] text-slate-400">Replaces current banner on public Plans page without downtime</span>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded bg-[#050607] border-white/20 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isUploading || (!selectedFile && !title)}
                className="px-6 py-3 rounded-xl bg-red-gradient text-white font-heading text-xs uppercase font-bold tracking-widest shadow-glow-red hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2 border border-core-red/50"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading Banner...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Save & Replace Banner</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
