'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { ArrowUpRight, ShieldCheck, MapPin, Mail, Phone, X, Check } from 'lucide-react';
import { siteConfig } from '@/data/site';

export function ClosingCTASection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setEmail('');
    }, 2500);
  };

  return (
    <section
      id="contact"
      className="relative min-h-0 lg:min-h-[80vh] w-full bg-core-void py-14 sm:py-20 lg:py-32 px-6 sm:px-12 border-t border-white/5 overflow-hidden flex flex-col justify-center items-center text-center"
    >
      {/* Radial Crimson Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-core-red/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-[0.3em] text-core-red uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            FINAL THRESHOLD
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-4xl sm:text-7xl md:text-8xl uppercase tracking-wider text-white leading-none"
        >
          FORGED IN <span className="text-core-red">DISCIPLINE.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm font-mono tracking-[0.3em] text-core-muted uppercase max-w-xl mx-auto font-light"
        >
          EXPERIENCE THE UNCOMPROMISING ATHLETIC STANDARD AT CORE X FITNESS.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="primary"
            size="xl"
            rightIcon={<ArrowUpRight className="w-6 h-6" />}
            onClick={() => setModalOpen(true)}
          >
            Claim Access Pass
          </Button>
        </motion.div>

        {/* Minimal Location & Contact Details with Staggered Entrance */}
        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 text-xs font-mono text-core-muted uppercase tracking-widest max-w-3xl mx-auto">
          {[
            { icon: MapPin, text: '740 GRAND AVE, KOLKATA' },
            { icon: Phone, text: '+1 (800) 555-CORE' },
            { icon: Mail, text: 'CONCIERGE@COREX.COM' },
          ].map((item, idx) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.5 + idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-2"
            >
              <item.icon className="w-4 h-4 text-core-red" />
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Access Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-core-void/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-core-dark border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl text-left space-y-6"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 text-core-muted hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-mono tracking-[0.3em] text-core-red uppercase font-bold">
                  VIP ACCESS RESERVATION
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-white">
                  CLAIM GUEST PASS
                </h3>
              </div>

              {submitted ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-core-red/20 border border-core-red flex items-center justify-center text-core-red">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-white">ACCESS GRANTED</h4>
                  <p className="text-xs font-mono text-core-muted uppercase tracking-widest">
                    Concierge pass confirmation dispatched to your email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-widest text-core-muted uppercase">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="athlete@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-core-void border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-core-red"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Confirm Pass
                  </Button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
