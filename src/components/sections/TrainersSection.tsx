'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { trainersData } from '@/data/trainers';
import { ArrowUpRight, Award, Trophy, ChevronRight } from 'lucide-react';

export function TrainersSection() {
  return (
    <section id="trainers" className="relative py-28 sm:py-36 bg-core-void overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <Badge variant="red" size="md" className="mb-4" dot>
              MASTER COACHING // 04
            </Badge>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight leading-[0.95]">
              WORLD-CLASS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-core-red">
                ATHLETIC DIRECTORS.
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-core-muted max-w-md font-sans leading-relaxed">
            No influencers. No pseudoscience. Our coaching staff consists solely of former national champions,
            exercise physiologists, and Olympic weightlifting mentors.
          </p>
        </div>

        {/* Trainers Editorial Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-14">
          {trainersData.map((trainer, idx) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group rounded-3xl bg-core-dark border border-white/10 overflow-hidden hover:border-core-red/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image & Experience Badge Container */}
              <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-core-surface">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-125 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-core-dark via-core-dark/20 to-transparent" />

                {/* Experience Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-core-void/85 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white uppercase">
                  <Award className="w-3.5 h-3.5 text-core-red" />
                  <span>{trainer.experience}</span>
                </div>
              </div>

              {/* Information Container */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-core-red font-bold">
                    {trainer.role}
                  </span>

                  <h3 className="text-2xl font-display font-black text-white uppercase mt-1 tracking-wide group-hover:text-core-accent transition-colors">
                    {trainer.name}
                  </h3>

                  <p className="text-xs sm:text-sm font-heading font-semibold text-slate-300 mt-2">
                    {trainer.specialization}
                  </p>

                  <p className="text-xs font-sans text-core-muted mt-3 leading-relaxed">
                    {trainer.bio}
                  </p>

                  {/* Certifications */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {trainer.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="px-2.5 py-1 rounded-lg bg-core-surface border border-white/5 text-[10px] font-mono text-slate-300 uppercase"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-core-muted uppercase">
                    1-ON-1 SESSIONS
                  </span>
                  <button
                    onClick={() => {
                      const target = document.querySelector('#memberships');
                      target?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1 text-xs font-mono text-white font-bold uppercase hover:text-core-red transition-colors"
                  >
                    <span>CONSULT</span>
                    <ChevronRight className="w-4 h-4 text-core-red" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
