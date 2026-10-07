import React from 'react';
import { Calendar, Image as ImageIcon, Users, Layers } from 'lucide-react';

export const StatsBar = () => {
  const stats = [
    {
      fact: '9',
      label: 'Integrated Modules',
      icon: Layers,
      color: 'text-indigo-500 dark:text-indigo-400'
    },
    {
      fact: '30-Day',
      label: 'Auto-Generated Roadmaps',
      icon: Calendar,
      color: 'text-purple-500 dark:text-purple-400'
    },
    {
      fact: '4x',
      label: 'Creative Variations',
      icon: ImageIcon,
      color: 'text-cyan-500 dark:text-cyan-400'
    },
    {
      fact: '3',
      label: 'Visual Formats (1:1, 16:9, 9:16)',
      icon: Users,
      color: 'text-emerald-500 dark:text-emerald-400'
    }
  ];

  return (
    <section className="py-16 bg-slate-100/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-center space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-md"
              >
                <IconComp className={`w-6 h-6 mx-auto ${stat.color}`} />
                <p className="text-3xl sm:text-4xl font-black font-['Outfit'] text-slate-900 dark:text-white">
                  {stat.fact}
                </p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
