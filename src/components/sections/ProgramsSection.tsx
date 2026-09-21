'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { programsData } from '@/data/programs';
import { ArrowUpRight, CheckCircle2, Flame, Layers } from 'lucide-react';

const categories = ['All', 'Strength', 'Conditioning', 'Functional'] as const;

export function ProgramsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredPrograms =
    activeCategory === 'All'
      ? programsData
      : programsData.filter((p) => p.category === activeCategory);

  return (
    <section id="programs" className="relative py-28 sm:py-36 bg-core-void overflow-hidden">
      {/* Background Subtle Gradient Lines */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-core-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <Badge variant="red" size="md" className="mb-4" dot>
              ATHLETIC DISCIPLINES // 02
            </Badge>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight leading-[0.95]">
              CALIBRATED FOR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-core-red">
                MAXIMUM ADAPTATION.
              </span>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-core-dark border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs uppercase font-heading font-bold tracking-widest rounded-xl transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-red-gradient text-white shadow-glow-red'
                    : 'text-core-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <AnimatePresence>
            {filteredPrograms.map((program) => (
              <motion.article
                layout
                key={program.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="group relative rounded-3xl bg-core-dark border border-white/10 overflow-hidden hover:border-core-red/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 flex flex-col justify-between"
              >
                {/* Media Header Container with Image Overlay */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-core-dark via-core-dark/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-core-void/80 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                      {program.category}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-core-red/20 backdrop-blur-md border border-core-red/40 text-xs font-mono font-bold text-core-accent uppercase">
                      <Flame className="w-3.5 h-3.5 text-core-red" />
                      <span>{program.intensity}</span>
                    </div>
                  </div>

                  {/* Metrics Overlay Pills */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                    {program.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="px-3 py-1.5 rounded-xl bg-core-dark/80 backdrop-blur-md border border-white/10 flex items-center gap-2"
                      >
                        <span className="text-[10px] font-mono text-core-muted uppercase tracking-wider">
                          {metric.label}:
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide group-hover:text-core-accent transition-colors">
                      {program.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-sans text-core-muted mt-2 leading-relaxed">
                      {program.description}
                    </p>

                    {/* Features List */}
                    <div className="mt-6 space-y-2">
                      {program.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-xs font-sans text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-core-red shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-core-muted">
                      <Layers className="w-4 h-4 text-core-red" />
                      <span>{program.duration} SESSION</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      rightIcon={<ArrowUpRight className="w-4 h-4" />}
                      className="group-hover:border-core-red group-hover:bg-core-red/10"
                      onClick={() => {
                        const target = document.querySelector('#memberships');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Reserve Slot
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
