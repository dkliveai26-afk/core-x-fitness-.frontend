'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { contactCards, quickGuestServices, contactDetails } from '@/data/contact';

const iconMap = {
  phone: Phone,
  mail: Mail,
  'map-pin': MapPin,
  clock: Clock,
  'shield-check': ShieldCheck,
  'message-square': Mail,
};

export function ContactInfoCards() {
  return (
    <div className="w-full space-y-8">
      {/* 4 Essential Contact Pillar Cards in a 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {contactCards.map((card, idx) => {
          const Icon = iconMap[card.iconName] || Mail;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-7 rounded-2xl bg-core-dark/80 backdrop-blur-xl border border-white/10 hover:border-core-red/40 transition-all duration-500 flex flex-col justify-between group shadow-xl relative overflow-hidden"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-core-red/5 rounded-full blur-2xl group-hover:bg-core-red/10 transition-colors pointer-events-none" />

              <div className="space-y-4">
                {/* Top Badge & Icon Cluster */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-core-red group-hover:scale-105 group-hover:border-core-red/40 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>

                  {card.badge && (
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-core-red/15 border border-core-red/30 text-core-red font-bold">
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Subtitle / Header */}
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-core-muted uppercase block">
                    {card.label}
                  </span>
                  <h3 className="text-base sm:text-lg font-display font-black uppercase tracking-tight text-white mt-1">
                    {card.title}
                  </h3>
                </div>

                {/* Primary & Secondary Information */}
                <div className="space-y-1 pt-1">
                  <div className="text-sm sm:text-base font-mono font-bold text-white tracking-wide group-hover:text-core-red transition-colors">
                    {card.primary}
                  </div>
                  {card.secondary && (
                    <div className="text-xs font-mono text-core-muted tracking-wider">
                      {card.secondary}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button if Available */}
              {card.actionUrl && (
                <div className="pt-6 mt-6 border-t border-white/5">
                  <a
                    href={card.actionUrl}
                    target={card.actionUrl.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white hover:text-core-red transition-colors"
                  >
                    <span>{card.actionLabel}</span>
                    <ArrowUpRight className="w-4 h-4 text-core-red group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Guest Pass & Direct Facility Services Card (with strict ₹ INR currency) */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="p-6 sm:p-8 rounded-2xl bg-core-dark/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-core-red" />
            <h4 className="text-sm font-display font-black uppercase tracking-wider text-white">
              DIRECT GUEST SESSIONS & ASSESSMENTS
            </h4>
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-core-muted">
            NO CONTRACT REQUIRED // ALL PRICES IN ₹ INR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickGuestServices.map((service) => (
            <div
              key={service.id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-core-red/30 transition-colors space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono tracking-widest text-core-muted uppercase">
                    {service.duration}
                  </span>
                  <span className="text-sm font-display font-black text-core-red">
                    {service.price}
                  </span>
                </div>
                <h5 className="text-xs font-heading font-bold uppercase tracking-wider text-white mt-1">
                  {service.name}
                </h5>
                <p className="text-[11px] font-sans text-core-muted mt-1 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-2 text-[10px] font-mono text-white/50">
                <CheckCircle2 className="w-3 h-3 text-core-red" />
                <span>INCLUDES RECOVERY BAY</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
