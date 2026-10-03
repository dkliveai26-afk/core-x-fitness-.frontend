'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';

export function ContactQuickCards() {
  const cards = [
    {
      id: 'address',
      icon: MapPin,
      iconBg: 'bg-core-red text-white shadow-glow-red',
      title: 'Address',
      line1: 'Debaipukur, Bhadrakali',
      line2: 'Uttarpara, West Bengal - 712232',
      actionUrl: 'https://www.google.com/maps/search/?api=1&query=CORE+X+FITNESS,+Bhadrakali,+Uttarpara,+Debaipukur,+West+Bengal+712232',
      actionLabel: 'Open in Google Maps',
    },
    {
      id: 'contact',
      icon: Phone,
      iconBg: 'bg-white/[0.08] text-white border border-white/10 group-hover:border-core-red/40 group-hover:text-core-red',
      title: 'Contact Info',
      line1: '+91 (033) 2460-CORE',
      line2: 'concierge@corexfitness.com',
      actionUrl: 'tel:+919830012345',
      actionLabel: 'Direct Call',
    },
    {
      id: 'hours',
      icon: Clock,
      iconBg: 'bg-white/[0.08] text-white border border-white/10 group-hover:border-core-red/40 group-hover:text-core-red',
      title: 'Opening Hours',
      line1: 'Mon to Sun: 06:00 - 23:00',
      line2: 'Above HDFC Bank, Bireswar Banerjee St',
      actionUrl: '#contact-form',
      actionLabel: 'Send Inquiry',
    },
  ];

  return (
    <section className="relative w-full py-12 sm:py-16 bg-core-void select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isThirdOnTablet = index === 2;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`p-6 sm:p-7 lg:p-8 rounded-2xl bg-core-dark/80 backdrop-blur-xl border border-white/10 hover:border-core-red/40 transition-all duration-400 group shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-start gap-4 sm:gap-5 relative overflow-hidden ${
                  isThirdOnTablet ? 'sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto sm:w-full lg:max-w-none' : ''
                }`}
              >
                {/* Subtle Hover Gradient */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-core-red/5 rounded-full blur-2xl group-hover:bg-core-red/10 transition-colors pointer-events-none" />

                {/* Left Icon Badge */}
                <div className={`w-11 sm:w-12 h-11 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${card.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Card Content */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-display font-black uppercase tracking-tight text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans font-medium text-white/90 break-words">
                    {card.line1}
                  </p>
                  <p className="text-xs font-mono text-core-muted tracking-wide break-words">
                    {card.line2}
                  </p>
                  {card.actionUrl && (
                    <div className="pt-2">
                      <a
                        href={card.actionUrl}
                        target={card.actionUrl.startsWith('http') ? '_blank' : undefined}
                        rel={card.actionUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-core-red hover:text-white uppercase tracking-wider font-bold transition-colors group/link cursor-pointer"
                      >
                        <span>{card.actionLabel}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
