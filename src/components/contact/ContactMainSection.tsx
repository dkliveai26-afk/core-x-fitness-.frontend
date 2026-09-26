'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Layers,
  MessageSquare,
  CheckCircle,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';

export function ContactMainSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Membership Admissions',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const services = [
    'Membership Admissions',
    'Private Coaching & VBT',
    'Biometric Assessment (₹1,999)',
    'Athletic Day Pass (₹999)',
    'Facility Walkthrough',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMsg) setErrorMsg('');
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

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Dispatch transmission error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'Membership Admissions',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <section className="relative w-full py-4 sm:py-8 bg-core-void select-none overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Compact, Unified Contact Card Container */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl bg-core-dark/85 backdrop-blur-2xl border border-white/10 p-5 sm:p-7 lg:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden">

          {/* Background Ambient Red Flare */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-radial from-core-red/15 via-transparent to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* Left Column: Compact "Get In Touch!" Form (col-span-7) */}
            <div className="lg:col-span-7 w-full z-10">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    onSubmit={handleSubmit}
                    className="space-y-3.5 max-w-lg"
                  >
                    {/* Heading Cluster */}
                    <div className="space-y-1">
                      <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white leading-tight">
                        Get In Touch!
                      </h2>
                      <p className="text-xs font-sans text-core-muted leading-relaxed font-light">
                        Transmit your athletic goals or admissions inquiry directly to our board.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {/* Your Name */}
                      <div className="relative">
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your Name"
                          className="w-full px-4 py-2.5 pl-11 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/35 text-sm font-sans focus:outline-none focus:border-core-red/60 focus:ring-2 focus:ring-core-red/20 transition-all"
                        />
                        <User className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Your Email */}
                      <div className="relative">
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Your Email"
                          className="w-full px-4 py-2.5 pl-11 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/35 text-sm font-sans focus:outline-none focus:border-core-red/60 focus:ring-2 focus:ring-core-red/20 transition-all"
                        />
                        <Mail className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Phone Number */}
                      <div className="relative">
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          className="w-full px-4 py-2.5 pl-11 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/35 text-sm font-sans focus:outline-none focus:border-core-red/60 focus:ring-2 focus:ring-core-red/20 transition-all"
                        />
                        <Phone className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Select Service Dropdown */}
                      <div className="relative">
                        <select
                          id="contact-service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 pl-11 pr-10 rounded-xl bg-[#0D1016] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-core-red/60 focus:ring-2 focus:ring-core-red/20 transition-all appearance-none cursor-pointer"
                        >
                          {services.map((item) => (
                            <option key={item} value={item} className="bg-core-dark text-white">
                              {item}
                            </option>
                          ))}
                        </select>
                        <Layers className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <ChevronDown className="w-4 h-4 text-white/40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Write Message Area */}
                      <div className="relative">
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={3}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Write Message..."
                          className="w-full px-4 py-2.5 pl-11 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/35 text-sm font-sans focus:outline-none focus:border-core-red/60 focus:ring-2 focus:ring-core-red/20 transition-all resize-none"
                        />
                        <MessageSquare className="w-4 h-4 text-white/40 absolute left-4 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {errorMsg && (
                      <p className="text-xs font-mono text-core-red uppercase tracking-wider font-semibold">
                        {errorMsg}
                      </p>
                    )}

                    {/* Red Submit Button matching reference */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-xl bg-core-red hover:bg-[#E61E1E] text-white font-display font-black text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_10px_30px_rgba(255,42,42,0.4)] hover:shadow-[0_15px_40px_rgba(255,42,42,0.6)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <span>SEND MESSAGE NOW</span>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  /* Success Confirmation Screen */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="py-10 text-left space-y-5 max-w-xl"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-core-red/15 border border-core-red/40 flex items-center justify-center text-core-red shadow-glow-red">
                      <CheckCircle className="w-7 h-7" />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-mono tracking-[0.3em] uppercase text-core-red font-bold block">
                        DISPATCH RECORDED // RESPONSE &lt; 2 HOURS
                      </span>
                      <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white">
                        MESSAGE DELIVERED.
                      </h3>
                      <p className="text-xs font-sans text-core-muted leading-relaxed">
                        Thank you, <span className="text-white font-bold">{formData.name}</span>. Our admissions board has received your dispatch regarding <span className="text-white font-semibold">{formData.service}</span> and will establish contact shortly.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 hover:border-core-red/40 text-xs font-mono tracking-widest text-white uppercase transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-core-red" />
                      <span>Send Another Message</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Second Bodybuilder Image (Large Visual filling green marked reference box) (col-span-5) */}
            <div className="lg:col-span-5 w-full flex items-center justify-center relative min-h-[260px] xs:min-h-[320px] sm:min-h-[400px] lg:min-h-[460px] overflow-visible">
              {/* Intense Red Halo Lighting behind the Athlete */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-gradient-radial from-core-red/40 via-core-crimson/18 to-transparent rounded-full blur-[90px] pointer-events-none" />

              {/* The Athlete Image with Prominent Scale matching marked reference */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src="/manimage2forcontactpage.png"
                  alt="Core X Fitness Athlete Training with Battle Ropes"
                  width={547}
                  height={456}
                  priority
                  className="object-contain w-full h-auto max-h-[300px] xs:max-h-[380px] sm:max-h-[450px] lg:max-h-[500px] filter contrast-120 brightness-100 drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)] scale-105 sm:scale-115 lg:scale-125 origin-center select-none"
                />

                {/* Bottom Edge Vignette Mask for Seamless Blending */}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-core-dark via-core-dark/50 to-transparent pointer-events-none" />
              </motion.div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
