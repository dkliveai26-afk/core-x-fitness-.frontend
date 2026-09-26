'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { inquiryTopics } from '@/data/contact';
import {
  Send,
  CheckCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { playSuccessSound } from '@/lib/sound';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: inquiryTopics[0],
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleTopicSelect = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      topic,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch inquiry.');
      }

      playSuccessSound();
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Transmission error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      topic: inquiryTopics[0],
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl bg-core-dark/85 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden">
      {/* Ambient Red Glow in Card Corner */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-core-red/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Header cluster */}
            <div className="space-y-2 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-core-red animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/80">
                  DISPATCH PROTOCOL // 01
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white">
                DIRECT ATHLETIC DISPATCH
              </h3>
              <p className="text-xs font-mono text-core-muted uppercase tracking-wider">
                TRANSMIT YOUR ATHLETIC GOALS DIRECTLY TO OUR CONCIERGE.
              </p>
            </div>

            {/* Topic Selection Pills */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono tracking-widest uppercase text-white/70 block">
                INQUIRY TOPIC
              </label>
              <div className="flex flex-wrap gap-2">
                {inquiryTopics.map((topic) => {
                  const isSelected = formData.topic === topic;
                  return (
                    <button
                      type="button"
                      key={topic}
                      onClick={() => handleTopicSelect(topic)}
                      className={`text-xs font-mono tracking-wider uppercase px-3 py-1.5 rounded-full transition-all duration-300 border ${
                        isSelected
                          ? 'bg-core-red/20 text-white border-core-red/60 shadow-glow-red'
                          : 'bg-white/[0.03] text-core-muted border-white/10 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Essential Contact Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="text-[11px] font-mono tracking-widest uppercase text-white/70 block"
                >
                  FULL NAME *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm font-sans focus:outline-none focus:border-core-red/60 focus:ring-2 focus:ring-core-red/20 transition-all"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="text-[11px] font-mono tracking-widest uppercase text-white/70 block"
                >
                  EMAIL ADDRESS *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. athlete@domain.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm font-sans focus:outline-none focus:border-core-red/60 focus:ring-2 focus:ring-core-red/20 transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label
                htmlFor="contact-phone"
                className="text-[11px] font-mono tracking-widest uppercase text-white/70 block"
              >
                TELEPHONE NUMBER *
              </label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98300 00000"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm font-sans focus:outline-none focus:border-core-red/60 focus:ring-2 focus:ring-core-red/20 transition-all"
              />
            </div>

            {/* Message Area */}
            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="text-[11px] font-mono tracking-widest uppercase text-white/70 block"
              >
                ATHLETIC TARGETS & INQUIRY *
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your training background, preferred training hours, or specific facility requirements..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/30 text-sm font-sans focus:outline-none focus:border-core-red/60 focus:ring-2 focus:ring-core-red/20 transition-all resize-none"
              />
            </div>

            {/* Error Message if Any */}
            {errorMsg && (
              <p className="text-xs font-mono text-core-red tracking-wider uppercase font-semibold">
                {errorMsg}
              </p>
            )}

            {/* Submit Action Cluster */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
                rightIcon={
                  isSubmitting ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )
                }
              >
                {isSubmitting ? 'Transmitting Dispatch...' : 'Transmit Dispatch'}
              </Button>

              <span className="text-[10px] font-mono text-core-muted uppercase tracking-widest text-center sm:text-right">
                STRICT CONFIDENTIALITY GUARANTEED
              </span>
            </div>
          </motion.form>
        ) : (
          /* Success Confirmation Card */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="py-12 sm:py-16 text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.35)]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-400 font-bold">
                TRANSMISSION VERIFIED // DISPATCH RECEIVED
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white">
                WE HAVE YOUR DISPATCH.
              </h3>
              <p className="text-xs sm:text-sm font-sans text-core-muted max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-bold">{formData.name}</span>. Our executive concierge board has received your dispatch regarding <span className="text-white font-semibold">{formData.topic}</span>. We will establish direct contact via phone or email within 2 hours.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 text-xs font-mono tracking-widest text-white uppercase transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Send Another Dispatch</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
