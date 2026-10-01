'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import { EmailCampaign, MarketingContact, EmailLogEntry } from '@/types/email';
import {
  Mail,
  Send,
  Plus,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  UserCheck,
  UserX,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Smartphone,
  Monitor,
  ExternalLink,
  ShieldCheck,
  Filter,
  Search,
  Check,
  X,
  Radio,
  FileCheck,
} from 'lucide-react';

export default function AdminCampaignsPage() {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'CREATE' | 'SUBSCRIBERS' | 'LOGS'>('CAMPAIGNS');

  // Data states
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<MarketingContact[]>([]);
  const [logs, setLogs] = useState<EmailLogEntry[]>([]);
  const [stats, setStats] = useState({
    totalContacts: 0,
    optedIn: 0,
    unsubscribed: 0,
    notOptedIn: 0,
    bookingsCount: 0,
    contactsCount: 0,
  });
  const [providerInfo, setProviderInfo] = useState<{
    provider: string;
    isConfigured: boolean;
    fromAddress: string;
    fromName: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filters
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberFilter, setSubscriberFilter] = useState('ALL');

  // Available Plans for Pricing Card insertion
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);

  // Campaign Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formPreheader, setFormPreheader] = useState('');
  const [formHeading, setFormHeading] = useState('');
  const [formBodyMessage, setFormBodyMessage] = useState('');
  const [formOfferBadge, setFormOfferBadge] = useState('EXCLUSIVE VIP ATHLETE ACCESS');
  const [formImageUrl, setFormImageUrl] = useState('/plans-offer-banner.png');
  const [formCtaText, setFormCtaText] = useState('Claim Exclusive Offer');
  const [formCtaUrl, setFormCtaUrl] = useState('https://core-x-fitness-frontend.vercel.app/plans?plan=performance#pricing-matrix');
  const [formFooterNote, setFormFooterNote] = useState('Offer valid for registered athletes and VIP admissions applicants.');
  const [formAudience, setFormAudience] = useState<'ALL_OPTED_IN' | 'BOOKINGS_ONLY' | 'CONTACTS_ONLY'>('ALL_OPTED_IN');
  
  // Pricing Card in Campaign State
  const [formIncludePricingCard, setFormIncludePricingCard] = useState(true);
  const [formSelectedPlanId, setFormSelectedPlanId] = useState('performance');
  
  // Image Upload State
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Preview & Action Modals
  const [previewCampaign, setPreviewCampaign] = useState<Partial<EmailCampaign> | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [testEmailModalCampaignId, setTestEmailModalCampaignId] = useState<string | null>(null);
  const [testEmailInput, setTestEmailInput] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/plans');
      if (res.ok) {
        const data = await res.json();
        if (data.plans && data.plans.length > 0) {
          setAvailablePlans(data.plans);
          if (!formSelectedPlanId && data.plans[0]) {
            setFormSelectedPlanId(data.plans[0].name.toLowerCase());
          }
        }
      }
    } catch (e) {
      console.warn('Notice: Plans fetch fallback');
    }
  }, [formSelectedPlanId]);

  const fetchCampaignsAndStats = useCallback(async () => {
    try {
      setErrorMsg('');
      const res = await fetch('/api/admin/campaigns', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Failed to load campaigns.');
      const data = await res.json();
      setCampaigns(data.campaigns || []);
      if (data.stats) setStats(data.stats);
      if (data.providerInfo) setProviderInfo(data.providerInfo);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error fetching campaigns.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const fetchSubscribers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (subscriberSearch) params.append('search', subscriberSearch);
      if (subscriberFilter !== 'ALL') params.append('filter', subscriberFilter);

      const res = await fetch(`/api/admin/campaigns/subscribers?${params.toString()}`, { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Failed to load subscribers.');
      const data = await res.json();
      setSubscribers(data.subscribers || []);
      if (data.stats) setStats(data.stats);
    } catch (err: any) {
      console.error(err);
    }
  }, [subscriberSearch, subscriberFilter]);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/campaigns/logs?limit=50', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Failed to load logs.');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCampaignsAndStats();
    fetchPlans();
  }, [fetchCampaignsAndStats, fetchPlans]);

  useEffect(() => {
    if (activeTab === 'SUBSCRIBERS') fetchSubscribers();
    if (activeTab === 'LOGS') fetchLogs();
  }, [activeTab, fetchSubscribers, fetchLogs]);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    fetchCampaignsAndStats();
    if (activeTab === 'SUBSCRIBERS') fetchSubscribers();
    if (activeTab === 'LOGS') fetchLogs();
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File exceeds 5MB limit.');
      return;
    }

    setSelectedImageFile(file);
    const localUrl = URL.createObjectURL(file);
    setImagePreviewUrl(localUrl);

    // Auto upload image to server
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/admin/campaigns/upload-image', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image.');

      setFormImageUrl(data.imageUrl);
      setSuccessMsg('Campaign banner uploaded successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Image upload failed.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSubject.trim() || !formHeading.trim() || !formBodyMessage.trim()) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      setIsLoading(true);

      const selectedPlanObj = availablePlans.find(
        (p) =>
          p.name.toLowerCase() === formSelectedPlanId.toLowerCase() ||
          p._id === formSelectedPlanId
      ) || availablePlans[0];

      const pricingPlanDetails =
        formIncludePricingCard && selectedPlanObj
          ? {
              name: selectedPlanObj.name,
              badge: selectedPlanObj.badge || 'MEMBERSHIP TIER',
              price: selectedPlanObj.price,
              originalPrice: selectedPlanObj.originalPrice,
              duration: selectedPlanObj.duration || '/ MONTH',
              features: selectedPlanObj.features || [],
              shortDescription: selectedPlanObj.shortDescription || '',
              discount: selectedPlanObj.discount || '',
            }
          : undefined;

      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          title: formTitle,
          subject: formSubject,
          preheader: formPreheader,
          heading: formHeading,
          bodyMessage: formBodyMessage,
          offerBadge: formOfferBadge,
          imageUrl: formImageUrl,
          ctaText: formCtaText,
          ctaUrl: formCtaUrl,
          footerNote: formFooterNote,
          targetAudience: formAudience,
          includePricingCard: formIncludePricingCard,
          pricingPlanId: formSelectedPlanId,
          pricingPlanDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save campaign.');

      setSuccessMsg('Campaign created successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);

      // Reset Form
      setFormTitle('');
      setFormSubject('');
      setFormPreheader('');
      setFormHeading('');
      setFormBodyMessage('');
      setFormImageUrl('');
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      setActiveTab('CAMPAIGNS');
      fetchCampaignsAndStats();
    } catch (err: any) {
      alert(err.message || 'Error saving campaign.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailModalCampaignId || !testEmailInput.trim()) {
      alert('Please enter a destination email address.');
      return;
    }

    try {
      setIsSendingTest(true);
      const res = await fetch(`/api/admin/campaigns/${testEmailModalCampaignId}/send-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ testEmail: testEmailInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Test email failed.');

      setSuccessMsg(`Test preview dispatched to ${testEmailInput}`);
      setTimeout(() => setSuccessMsg(''), 4000);
      setTestEmailModalCampaignId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to send test email.');
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleBroadcastCampaign = async (campaign: EmailCampaign) => {
    const recipientCount = stats.optedIn;
    if (!confirm(`Are you sure you want to broadcast "${campaign.title}" to ${recipientCount} eligible opted-in recipients now?`)) {
      return;
    }

    try {
      setSendingCampaignId(campaign._id);
      const res = await fetch(`/api/admin/campaigns/${campaign._id}/send`, {
        method: 'POST',
        credentials: 'same-origin',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize broadcast.');

      setSuccessMsg('Campaign broadcast started in background. Real-time metrics will update.');
      setTimeout(() => setSuccessMsg(''), 4000);

      // Update local status to SENDING
      setCampaigns((prev) =>
        prev.map((c) => (c._id === campaign._id ? { ...c, status: 'SENDING' } : c))
      );

      // Trigger periodic refreshes
      setTimeout(fetchCampaignsAndStats, 2000);
      setTimeout(fetchCampaignsAndStats, 5000);
    } catch (err: any) {
      alert(err.message || 'Broadcast error.');
    } finally {
      setSendingCampaignId(null);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Failed to delete campaign.');

      setCampaigns((prev) => prev.filter((c) => c._id !== id));
      setSuccessMsg('Campaign deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Delete error.');
    }
  };

  const handleToggleConsent = async (email: string, currentConsent: boolean) => {
    try {
      const newConsent = !currentConsent;
      const res = await fetch('/api/admin/campaigns/subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, marketingOptIn: newConsent }),
      });

      if (!res.ok) throw new Error('Failed to update consent.');

      setSubscribers((prev) =>
        prev.map((s) => (s.email === email ? { ...s, marketingOptIn: newConsent } : s))
      );
      fetchCampaignsAndStats();
    } catch (err: any) {
      alert(err.message || 'Consent update error.');
    }
  };

  const handleSyncSubscribers = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/admin/campaigns/subscribers', {
        method: 'POST',
        credentials: 'same-origin',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed.');

      setSuccessMsg(data.message || 'Database synchronized.');
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchSubscribers();
      fetchCampaignsAndStats();
    } catch (err: any) {
      alert(err.message || 'Sync error.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AdminLayoutWrapper
      title="Email Marketing & Campaigns"
      subtitle="Broadcast promotional offers, announcements, and track athlete email telemetry."
      onRefresh={handleRefreshAll}
      isRefreshing={isRefreshing}
    >
      <div className="space-y-8 max-w-7xl animate-fade-in">
        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm font-mono animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm font-mono">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Top Telemetry & Audience Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">TOTAL CONTACTS</span>
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-2xl font-display font-bold text-white">{stats.totalContacts}</p>
            <p className="text-[11px] font-mono text-slate-500">Registry Normalized</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">ELIGIBLE SUBSCRIBERS</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-display font-bold text-emerald-400">{stats.optedIn}</p>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] font-mono text-emerald-500/80">Consent Verified</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">UNSUBSCRIBED</span>
              <UserX className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-display font-bold text-slate-300">{stats.unsubscribed}</p>
            <p className="text-[11px] font-mono text-slate-500">Opted Out (Skipped)</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">EMAIL ENGINE</span>
              <ShieldCheck className="w-4 h-4 text-core-red" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-white uppercase truncate">
                {providerInfo?.provider || 'SIMULATED'}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                providerInfo?.isConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {providerInfo?.isConfigured ? 'LIVE' : 'SIMULATED'}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 truncate">{providerInfo?.fromAddress || 'concierge@corexfitness.com'}</p>
          </div>
        </div>

        {/* Tab Navigation Navigation Controls */}
        <div className="border-b border-white/10 flex flex-wrap gap-2 sm:gap-6 text-xs font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('CAMPAIGNS')}
            className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'CAMPAIGNS'
                ? 'border-core-red text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-core-red" />
            <span>Campaigns ({campaigns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CREATE')}
            className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'CREATE'
                ? 'border-core-red text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4 text-core-red" />
            <span>Create Campaign</span>
          </button>

          <button
            onClick={() => setActiveTab('SUBSCRIBERS')}
            className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'SUBSCRIBERS'
                ? 'border-core-red text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-core-red" />
            <span>Audience & Consent ({stats.totalContacts})</span>
          </button>

          <button
            onClick={() => setActiveTab('LOGS')}
            className={`pb-3.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'LOGS'
                ? 'border-core-red text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-core-red" />
            <span>Delivery Logs</span>
          </button>
        </div>

        {/* TAB 1: CAMPAIGNS LIST */}
        {activeTab === 'CAMPAIGNS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-bold text-white uppercase">Marketing Campaigns</h2>
                <p className="text-xs text-slate-400">Broadcast offers, seasonal discounts, and private club invitations.</p>
              </div>

              <button
                onClick={() => setActiveTab('CREATE')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-gradient text-white text-xs font-heading font-bold uppercase tracking-widest shadow-glow-red hover:brightness-110 transition-all border border-core-red/40"
              >
                <Plus className="w-4 h-4" />
                <span>New Campaign</span>
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="bg-[#0D1117] border border-white/5 rounded-3xl p-16 text-center space-y-4">
                <Mail className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="text-base font-bold text-slate-300 uppercase font-heading">No Email Campaigns Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Create your first offer campaign (e.g. &quot;Durga Puja Special Offer&quot; or &quot;Apex VIP Pass&quot;) to broadcast directly to opted-in athlete subscribers.
                </p>
                <button
                  onClick={() => setActiveTab('CREATE')}
                  className="px-6 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-mono text-xs uppercase tracking-wider"
                >
                  Create First Campaign
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {campaigns.map((c) => (
                  <div
                    key={c._id}
                    className="bg-[#0D1117] border border-white/5 hover:border-white/15 rounded-2xl p-5 sm:p-6 transition-all space-y-4 shadow-lg"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            c.status === 'SENT'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : c.status === 'SENDING'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                              : c.status === 'FAILED'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                          }`}>
                            {c.status}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            Created: {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white font-heading">{c.title}</h3>
                        <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                          <span>Subject:</span>
                          <span className="text-slate-200 font-semibold">{c.subject}</span>
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Preview Button */}
                        <button
                          onClick={() => setPreviewCampaign(c)}
                          className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 text-white text-xs font-mono uppercase flex items-center gap-1.5 transition-colors"
                          title="Preview live email layout"
                        >
                          <Eye className="w-3.5 h-3.5 text-core-red" />
                          <span>Preview</span>
                        </button>

                        {/* Send Test Email Button */}
                        <button
                          onClick={() => {
                            setTestEmailModalCampaignId(c._id);
                            setTestEmailInput(providerInfo?.fromAddress || 'dilkhushdeveloper@gmail.com');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-mono uppercase flex items-center gap-1.5 transition-colors"
                          title="Send test email to your inbox"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" />
                          <span>Send Test</span>
                        </button>

                        {/* Broadcast Send Button */}
                        {c.status !== 'SENDING' && (
                          <button
                            onClick={() => handleBroadcastCampaign(c)}
                            disabled={sendingCampaignId === c._id}
                            className="px-4 py-2 rounded-xl bg-core-red/20 hover:bg-core-red/30 border border-core-red/40 text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5 text-core-red" />
                            <span>{c.status === 'SENT' ? 'Re-send' : 'Broadcast'}</span>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteCampaign(c._id)}
                          className="p-2 rounded-xl bg-white/[0.02] hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-white/5 transition-colors"
                          title="Delete campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress & Metrics */}
                    <div className="pt-3 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase">Eligible Recipients:</span>
                        <span className="text-white font-bold">{c.totalEligibleRecipients || stats.optedIn}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase">Delivered:</span>
                        <span className="text-emerald-400 font-bold">{c.sentCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase">Failed:</span>
                        <span className="text-rose-400 font-bold">{c.failedCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase">Last Dispatched:</span>
                        <span className="text-slate-300">{c.sentAt ? new Date(c.sentAt).toLocaleString() : 'Not sent yet'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CREATE CAMPAIGN */}
        {activeTab === 'CREATE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Form: Col 7 */}
            <div className="lg:col-span-7 bg-[#0D1117] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <div className="p-2.5 rounded-xl bg-core-red/10 border border-core-red/20 text-core-red">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase font-heading">
                    Compose Email Offer Campaign
                  </h2>
                  <p className="text-xs text-slate-400">
                    Draft, preview, and broadcast custom offers with banners and CTA buttons.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-5 text-xs font-sans">
                {/* Campaign Title & Audience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                      Internal Campaign Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Durga Puja 20% Off Apex Tier"
                      className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                      Target Audience *
                    </label>
                    <select
                      value={formAudience}
                      onChange={(e: any) => setFormAudience(e.target.value)}
                      className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red cursor-pointer"
                    >
                      <option value="ALL_OPTED_IN">All Opted-in Athletes ({stats.optedIn})</option>
                      <option value="BOOKINGS_ONLY">Booked Members Only</option>
                      <option value="CONTACTS_ONLY">Contact Inquiries Only</option>
                    </select>
                  </div>
                </div>

                {/* Email Subject & Offer Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                      Email Subject Line *
                    </label>
                    <input
                      type="text"
                      required
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="e.g. Exclusive Offer: Claim Your 20% Membership Pass"
                      className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                      Top Offer Badge / Ribbon
                    </label>
                    <input
                      type="text"
                      value={formOfferBadge}
                      onChange={(e) => setFormOfferBadge(e.target.value)}
                      placeholder="e.g. LIMITED VIP ATHLETE ACCESS"
                      className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono uppercase"
                    />
                  </div>
                </div>

                {/* Email Heading */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    Email Main Heading *
                  </label>
                  <input
                    type="text"
                    required
                    value={formHeading}
                    onChange={(e) => setFormHeading(e.target.value)}
                    placeholder="e.g. Elevate Your Athletic Performance with Apex Tier Access"
                    className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red"
                  />
                </div>

                {/* Message Body Content */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    Offer Details / Body Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formBodyMessage}
                    onChange={(e) => setFormBodyMessage(e.target.value)}
                    placeholder="Describe the offer details, included biometric tests, coaching access, and validity..."
                    className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red resize-y"
                  />
                  <span className="text-[10px] font-mono text-slate-500">
                    Paragraphs separated by line breaks will render cleanly in all email clients.
                  </span>
                </div>

                {/* Campaign Image / Banner Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Campaign Banner Graphic (Optional)
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">Zero Server Storage / Serverless Safe</span>
                  </div>

                  {/* Preset Banner Quick-Picks */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('/plans-offer-banner.png')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        formImageUrl === '/plans-offer-banner.png'
                          ? 'bg-core-red text-white font-bold shadow-glow-red'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      Plans Offer Banner
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('/gymlogo1.png')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        formImageUrl === '/gymlogo1.png'
                          ? 'bg-core-red text-white font-bold shadow-glow-red'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      Core X Brand Mark
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        !formImageUrl
                          ? 'bg-slate-700 text-white font-bold'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      No Banner (Text Only)
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs uppercase flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
                    >
                      <Upload className="w-4 h-4 text-core-red" />
                      <span>{selectedImageFile ? 'Change File' : 'Upload File'}</span>
                    </button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />

                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="Or enter image URL (e.g. /plans-offer-banner.png or https://...)"
                      className="w-full sm:flex-1 bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono"
                    />
                  </div>

                  {isUploadingImage && (
                    <p className="text-[11px] font-mono text-amber-400 animate-pulse">Processing banner in memory...</p>
                  )}

                  {formImageUrl && (
                    <div className="p-2 rounded-xl bg-black border border-white/10 max-h-40 overflow-hidden flex items-center justify-center">
                      <Image
                        src={formImageUrl}
                        alt="Campaign Preview Banner"
                        width={600}
                        height={200}
                        className="max-h-36 w-auto object-contain rounded"
                        unoptimized
                      />
                    </div>
                  )}
                </div>

                {/* NEW FEATURE: INCLUDE PRICING CARD */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#161B22] to-[#0D1117] border border-core-red/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-core-red" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                        Include Membership Pricing Card in Email
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIncludePricingCard}
                        onChange={(e) => setFormIncludePricingCard(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-core-red"></div>
                    </label>
                  </div>

                  {formIncludePricingCard && (
                    <div className="space-y-3 pt-2 border-t border-white/5">
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        Select an existing plan from the Plans CMS. The email will render a luxury responsive pricing card with live rates, features, and an automatic deep-link directly to that specific plan card on the website.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {availablePlans.map((p) => {
                          const isSelected = formSelectedPlanId.toLowerCase() === p.name.toLowerCase() || formSelectedPlanId === p._id;
                          return (
                            <div
                              key={p._id || p.name}
                              onClick={() => {
                                setFormSelectedPlanId(p.name.toLowerCase());
                                setFormCtaUrl(`https://core-x-fitness-frontend.vercel.app/plans?plan=${p.name.toLowerCase()}#pricing-matrix`);
                              }}
                              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-core-red/15 border-core-red shadow-[0_0_20px_rgba(255,42,42,0.2)]'
                                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-core-red font-bold uppercase block">{p.badge || 'TIER'}</span>
                                <h4 className="text-sm font-bold text-white uppercase">{p.name}</h4>
                              </div>
                              <div className="mt-2 pt-2 border-t border-white/5 flex items-baseline justify-between">
                                <span className="text-sm font-black text-white">₹{p.price.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] font-mono text-slate-400">{p.duration || '/mo'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>CTA automatically configured: Clicking &quot;Claim Offer&quot; will auto-scroll & highlight this card on the website.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Button Text & URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                      Call-to-Action (CTA) Button Text
                    </label>
                    <input
                      type="text"
                      value={formCtaText}
                      onChange={(e) => setFormCtaText(e.target.value)}
                      placeholder="e.g. Claim Your 20% Membership Pass"
                      className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                      CTA Button Link / URL (Deep-Link)
                    </label>
                    <input
                      type="text"
                      value={formCtaUrl}
                      onChange={(e) => setFormCtaUrl(e.target.value)}
                      placeholder="https://core-x-fitness-frontend.vercel.app/plans?plan=performance#pricing-matrix"
                      className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono"
                    />
                  </div>
                </div>

                {/* Footer Note */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-bold">
                    Terms / Disclaimer Footer Note
                  </label>
                  <input
                    type="text"
                    value={formFooterNote}
                    onChange={(e) => setFormFooterNote(e.target.value)}
                    placeholder="e.g. Valid until next Sunday. Terms and conditions apply."
                    className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red"
                  />
                </div>

                {/* Submit Controls */}
                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      const selectedPlanObj = availablePlans.find(
                        (p) =>
                          p.name.toLowerCase() === formSelectedPlanId.toLowerCase() ||
                          p._id === formSelectedPlanId
                      ) || availablePlans[0];

                      setPreviewCampaign({
                        heading: formHeading || 'Sample Offer Heading',
                        bodyMessage: formBodyMessage || 'Sample offer body message...',
                        offerBadge: formOfferBadge,
                        imageUrl: formImageUrl,
                        ctaText: formCtaText,
                        ctaUrl: formCtaUrl,
                        footerNote: formFooterNote,
                        subject: formSubject,
                        includePricingCard: formIncludePricingCard,
                        pricingPlanDetails: formIncludePricingCard && selectedPlanObj ? {
                          name: selectedPlanObj.name,
                          badge: selectedPlanObj.badge,
                          price: selectedPlanObj.price,
                          originalPrice: selectedPlanObj.originalPrice,
                          duration: selectedPlanObj.duration,
                          features: selectedPlanObj.features,
                          shortDescription: selectedPlanObj.shortDescription,
                          discount: selectedPlanObj.discount,
                        } : undefined,
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs uppercase flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-core-red" />
                    <span>Live Preview</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-red-gradient text-white font-heading font-bold text-xs uppercase tracking-widest shadow-glow-red hover:brightness-110 transition-all border border-core-red/50"
                  >
                    Save Campaign Draft
                  </button>
                </div>
              </form>
            </div>

            {/* Right Interactive Preview: Col 5 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#0D1117] border border-white/5 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-core-red" />
                    <span>Real-time Email Preview</span>
                  </span>

                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-core-red text-white' : 'text-slate-400'}`}
                      title="Desktop view"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-core-red text-white' : 'text-slate-400'}`}
                      title="Mobile view"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Email Box Simulation */}
                <div className={`mx-auto bg-[#050607] rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all ${
                  previewDevice === 'mobile' ? 'max-w-[320px]' : 'w-full'
                }`}>
                  {/* Top Red Bar */}
                  <div className="h-1 bg-core-red" />

                  {/* Brand Header */}
                  <div className="p-4 text-center border-b border-white/5">
                    <h1 className="text-sm font-black font-display text-white tracking-widest uppercase">
                      CORE <span className="text-core-red">X</span> FITNESS
                    </h1>
                    {formOfferBadge && (
                      <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-core-red/15 border border-core-red/30 text-[8px] font-mono text-core-red font-bold uppercase tracking-wider">
                        {formOfferBadge}
                      </span>
                    )}
                  </div>

                  {/* Banner Image */}
                  {formImageUrl && (
                    <div className="p-3 bg-black">
                      <Image
                        src={formImageUrl}
                        alt="Offer Graphic"
                        width={400}
                        height={160}
                        className="w-full h-auto rounded object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-xs font-bold text-white font-heading leading-tight">
                      {formHeading || 'Your Offer Heading Appears Here'}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                      {formBodyMessage || 'Your campaign offer text and message content will be formatted here beautifully across all email clients.'}
                    </p>

                    {/* Interactive Embedded Pricing Card Preview */}
                    {formIncludePricingCard && (() => {
                      const selectedPlanObj = availablePlans.find(
                        (p) => p.name.toLowerCase() === formSelectedPlanId.toLowerCase() || p._id === formSelectedPlanId
                      ) || availablePlans[0];
                      if (!selectedPlanObj) return null;
                      return (
                        <div className="my-3 p-3.5 rounded-xl bg-gradient-to-b from-[#1C0F12] to-[#12151B] border-2 border-core-red shadow-[0_4px_20px_rgba(255,42,42,0.2)] text-left space-y-2">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-core-red/20 text-core-red text-[8px] font-mono font-bold uppercase">
                            {selectedPlanObj.badge || 'MEMBERSHIP TIER'}
                          </span>
                          <div className="flex items-baseline justify-between">
                            <h4 className="text-sm font-black text-white uppercase">{selectedPlanObj.name} TIER</h4>
                            <span className="text-base font-black text-white">₹{selectedPlanObj.price.toLocaleString('en-IN')}<span className="text-[9px] font-mono text-slate-400 font-normal">{selectedPlanObj.duration || '/mo'}</span></span>
                          </div>
                          {selectedPlanObj.shortDescription && (
                            <p className="text-[10px] text-slate-300 font-sans">{selectedPlanObj.shortDescription}</p>
                          )}
                          {selectedPlanObj.features && selectedPlanObj.features.length > 0 && (
                            <div className="pt-2 border-t border-white/5 space-y-1">
                              {selectedPlanObj.features.slice(0, 3).map((f: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-200">
                                  <span className="text-core-red font-bold">✓</span>
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {formCtaText && (
                      <div className="pt-2 text-center">
                        <span className="inline-block px-4 py-2 rounded-lg bg-core-red text-white text-[11px] font-heading font-bold uppercase tracking-wider shadow-[0_4px_15px_rgba(255,42,42,0.3)]">
                          {formCtaText}
                        </span>
                      </div>
                    )}

                    {formFooterNote && (
                      <div className="p-2 rounded bg-white/[0.02] border border-white/5 text-[9px] text-slate-400">
                        {formFooterNote}
                      </div>
                    )}
                  </div>

                  {/* Footer & Unsubscribe */}
                  <div className="p-3 bg-[#090C10] border-t border-white/5 text-center text-[8px] font-mono text-slate-500 space-y-1">
                    <p>CORE X FITNESS // NOIDA, UP</p>
                    <p className="text-slate-600">
                      You are receiving this because you opted in. <span className="underline text-slate-400">Unsubscribe</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIBERS & CONSENT */}
        {activeTab === 'SUBSCRIBERS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-bold text-white uppercase">Athlete Audience & Consent</h2>
                <p className="text-xs text-slate-400">Unified normalized contacts registry with GDPR/CAN-SPAM compliant opt-in/opt-out status.</p>
              </div>

              <button
                onClick={handleSyncSubscribers}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-mono uppercase"
              >
                <RefreshCw className="w-3.5 h-3.5 text-core-red" />
                <span>Sync From Bookings/Inquiries</span>
              </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-[#0D1117] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  placeholder="Search by email, name, phone..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-core-red"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {['ALL', 'OPTED_IN', 'NOT_OPTED_IN', 'UNSUBSCRIBED'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSubscriberFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                      subscriberFilter === f
                        ? 'bg-core-red text-white shadow-glow-red'
                        : 'bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-[#0D1117] border border-white/5 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-[11px] font-mono text-slate-400 uppercase bg-white/[0.02] border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Athlete / Contact</th>
                      <th className="px-6 py-4">Source Channels</th>
                      <th className="px-6 py-4">Last Active</th>
                      <th className="px-6 py-4">Marketing Consent</th>
                      <th className="px-6 py-4 text-right">Consent Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {subscribers.map((sub) => (
                      <tr key={sub.email} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-white text-xs">{sub.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{sub.email}</p>
                            {sub.phone && <p className="text-[10px] text-slate-500 font-mono">{sub.phone}</p>}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {sub.sources?.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-slate-300">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs font-mono text-slate-400">
                          {sub.lastActiveAt ? new Date(sub.lastActiveAt).toLocaleDateString() : 'N/A'}
                        </td>

                        <td className="px-6 py-4">
                          {sub.marketingOptIn ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>OPTED IN</span>
                            </span>
                          ) : sub.marketingOptOutAt ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <span>UNSUBSCRIBED</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
                              <span>NOT OPTED IN</span>
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleConsent(sub.email, sub.marketingOptIn)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                              sub.marketingOptIn
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {sub.marketingOptIn ? 'Revoke Consent' : 'Grant Opt-In'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DELIVERY LOGS */}
        {activeTab === 'LOGS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-display font-bold text-white uppercase">Email Dispatch Logs</h2>
                <p className="text-xs text-slate-400">Complete telemetry of all booking confirmations, admin alerts, and campaigns.</p>
              </div>
            </div>

            <div className="bg-[#0D1117] border border-white/5 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-[11px] font-mono text-slate-400 uppercase bg-white/[0.02] border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Recipient</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Provider</th>
                      <th className="px-6 py-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {logs.map((log, idx) => (
                      <tr key={log._id || idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-white font-semibold">
                          {log.recipient}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-slate-300">
                            {log.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300 max-w-xs truncate">
                          {log.subject}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'SENT' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {log.provider}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-[11px]">
                          {log.sentAt ? new Date(log.sentAt).toLocaleString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Live HTML Preview */}
        {previewCampaign && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0D1117] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Preview: {previewCampaign.subject || 'Email Campaign'}
                </span>
                <button
                  onClick={() => setPreviewCampaign(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-[#050607]">
                <div className="max-w-lg mx-auto bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="h-1 bg-core-red" />
                  <div className="p-5 text-center border-b border-white/5">
                    <h2 className="text-base font-black font-display text-white tracking-widest uppercase">
                      CORE <span className="text-core-red">X</span> FITNESS
                    </h2>
                    {previewCampaign.offerBadge && (
                      <span className="mt-1 inline-block px-2.5 py-0.5 rounded-full bg-core-red/15 border border-core-red/30 text-[9px] font-mono text-core-red font-bold uppercase">
                        {previewCampaign.offerBadge}
                      </span>
                    )}
                  </div>

                  {previewCampaign.imageUrl && (
                    <div className="p-3 bg-black">
                      <Image
                        src={previewCampaign.imageUrl}
                        alt="Offer Graphic"
                        width={600}
                        height={200}
                        className="w-full h-auto rounded object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-white font-heading">
                      {previewCampaign.heading}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                      {previewCampaign.bodyMessage}
                    </p>

                    {/* Embedded Pricing Card in Modal */}
                    {previewCampaign.includePricingCard && previewCampaign.pricingPlanDetails && (
                      <div className="my-4 p-4 rounded-2xl bg-gradient-to-b from-[#1C0F12] to-[#12151B] border-2 border-core-red shadow-[0_4px_25px_rgba(255,42,42,0.25)] text-left space-y-2.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-core-red/20 text-core-red text-[9px] font-mono font-bold uppercase">
                          {previewCampaign.pricingPlanDetails.badge || 'MEMBERSHIP TIER'}
                        </span>
                        <div className="flex items-baseline justify-between">
                          <h4 className="text-base font-black text-white uppercase">{previewCampaign.pricingPlanDetails.name} TIER</h4>
                          <span className="text-lg font-black text-white">
                            ₹{previewCampaign.pricingPlanDetails.price.toLocaleString('en-IN')}
                            <span className="text-[10px] font-mono text-slate-400 font-normal">{previewCampaign.pricingPlanDetails.duration || '/mo'}</span>
                          </span>
                        </div>
                        {previewCampaign.pricingPlanDetails.shortDescription && (
                          <p className="text-xs text-slate-300 font-sans">{previewCampaign.pricingPlanDetails.shortDescription}</p>
                        )}
                        {previewCampaign.pricingPlanDetails.features && previewCampaign.pricingPlanDetails.features.length > 0 && (
                          <div className="pt-2 border-t border-white/5 space-y-1.5">
                            {previewCampaign.pricingPlanDetails.features.slice(0, 4).map((f: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                                <span className="text-core-red font-bold">✓</span>
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {previewCampaign.ctaText && (
                      <div className="pt-2 text-center">
                        <span className="inline-block px-6 py-3 rounded-xl bg-core-red text-white text-xs font-heading font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(255,42,42,0.4)]">
                          {previewCampaign.ctaText}
                        </span>
                      </div>
                    )}

                    {previewCampaign.footerNote && (
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-slate-400">
                        {previewCampaign.footerNote}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-[#090C10] border-t border-white/5 text-center text-[10px] font-mono text-slate-500 space-y-1">
                    <p>CORE X FITNESS // SECTOR 14, NOIDA, UP</p>
                    <p className="text-slate-600">
                      You are receiving this because you opted in. <span className="underline text-slate-400">Unsubscribe</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Send Test Email */}
        {testEmailModalCampaignId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0D1117] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white font-heading uppercase">Send Test Email</h3>
                <button
                  onClick={() => setTestEmailModalCampaignId(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-mono uppercase text-slate-400 font-bold">
                  Destination Email Address
                </label>
                <input
                  type="email"
                  value={testEmailInput}
                  onChange={(e) => setTestEmailInput(e.target.value)}
                  placeholder="e.g. yourname@example.com"
                  className="w-full bg-[#050607] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-core-red font-mono"
                />
                <p className="text-[11px] text-slate-500 font-mono">
                  Sends a real rendered email with [TEST PREVIEW] prefix so you can inspect mobile appearance and formatting.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTestEmailModalCampaignId(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-slate-300 font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSendingTest || !testEmailInput}
                  onClick={handleSendTestEmail}
                  className="px-5 py-2 rounded-xl bg-red-gradient text-white font-heading font-bold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
                >
                  {isSendingTest ? 'Dispatching...' : 'Send Test Email'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
