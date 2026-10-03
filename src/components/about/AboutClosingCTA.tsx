'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { ArrowRight, Sparkles, MapPin, Clock, Phone, ShieldCheck } from 'lucide-react';

export function AboutClosingCTA() {
  return (
    <section className="relative w-full py-28 sm:py-36 bg-core-void overflow-hidden border-t border-white/5">
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-radial from-core-red/15 via-core-crimson/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-core-red/15 border border-core-red/30 text-xs font-mono tracking-[0.3em] text-core-red uppercase font-bold backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-core-red" />
            SELECT MEMBERSHIP ADMISSIONS
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase tracking-tight text-white leading-[1.02]"
          >
            READY TO ELEVATE YOUR <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-core-red via-[#FF4D4D] to-white drop-shadow-[0_0_35px_rgba(255,42,42,0.4)]">
              HUMAN STANDARD?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-core-muted max-w-2xl mx-auto font-sans leading-relaxed font-light"
          >
            Admissions are maintained at strict capacity to ensure unimpeded floor access, private recovery bays,
            and dedicated coaching attention at all hours.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            <Link href="/#memberships">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                View Membership Plans
              </Button>
            </Link>

            <Link href="/#contact">
              <Button
                variant="secondary"
                size="lg"
              >
                Book Private Concierge Tour
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Flagship Information Matrix with Staggered Entrance */}
        <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
          {[
            {
              icon: MapPin,
              title: 'LOCATION',
              line1: 'Debaipukur, Bhadrakali',
              line2: 'Uttarpara, WB 712232',
            },
            {
              icon: Clock,
              title: 'OPERATING HOURS',
              line1: '06:00 - 23:00 Daily',
              line2: '24/7 Keycard for Elite Tier',
            },
            {
              icon: Phone,
              title: 'CONCIERGE DESK',
              line1: '+91 98300 12345',
              line2: 'concierge@corexfitness.com',
            },
            {
              icon: ShieldCheck,
              title: 'CAPACITY STANDARD',
              line1: 'Strict Member Cap',
              line2: 'Zero Equipment Wait Times',
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.15 * idx, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 hover:border-core-red/30 transition-colors duration-500"
            >
              <div className="flex items-center gap-2 text-core-red font-bold tracking-wider uppercase">
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.title}</span>
              </div>
              <div className="text-white font-sans text-sm">{item.line1}</div>
              <div className="text-core-muted">{item.line2}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
