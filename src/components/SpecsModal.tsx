import React from 'react';
import { X, Cpu, Camera, Eye, Shield, Zap, Sparkles } from 'lucide-react';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreorder: () => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({
  isOpen,
  onClose,
  onPreorder,
}) => {
  if (!isOpen) return null;

  const specCategories = [
    {
      icon: Shield,
      title: 'Materials & Body',
      specs: [
        { label: 'Chassis', value: 'Aerospace Grade 5 Titanium' },
        { label: 'Thickness', value: '8.2 mm' },
        { label: 'Glass', value: 'Corning® Gorilla® Armor 2' },
        { label: 'Durability', value: 'IP68 Water & Dust Resistance' },
      ],
    },
    {
      icon: Camera,
      title: 'Camera Array',
      specs: [
        { label: 'Wide', value: '200MP OIS (f/1.7, 24mm)' },
        { label: 'Periscope', value: '50MP 5x Optical (10x Lossless)' },
        { label: 'Telephoto', value: '10MP 3x Optical OIS' },
        { label: 'Ultra-Wide', value: '12MP 120° FOV Super Steady' },
      ],
    },
    {
      icon: Cpu,
      title: 'Compute & Neural',
      specs: [
        { label: 'Processor', value: 'Snapdragon® 8 Elite Gen 2 for Galaxy' },
        { label: 'Fabrication', value: '3nm GAA Foundry Architecture' },
        { label: 'NPU', value: '45-TOPS On-Device Galaxy AI Engine' },
        { label: 'Cooling', value: 'Vapor Chamber 2.1x Expanded Area' },
      ],
    },
    {
      icon: Eye,
      title: 'Display & Battery',
      specs: [
        { label: 'Display', value: '6.9" Dynamic AMOLED 2X Flat' },
        { label: 'Refresh Rate', value: '1Hz – 120Hz LTPO Adaptive' },
        { label: 'Peak Brightness', value: '3,200 nits' },
        { label: 'Battery', value: '5,000 mAh · 65W Wired Fast Charge' },
      ],
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="specs-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto liquid-glass-elevated rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-300" />
            <h2 id="specs-modal-title" className="text-xl font-bold tracking-tight">
              Galaxy S26 Ultra · Technical Specifications
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            aria-label="Close specifications dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spec Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {specCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="liquid-glass rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-3">
                  <Icon className="w-4 h-4 text-cyan-300" />
                  <span>{cat.title}</span>
                </div>
                <div className="space-y-2 text-xs">
                  {cat.specs.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-1 border-b border-white/5 last:border-0"
                    >
                      <span className="text-white/60">{item.label}</span>
                      <span className="font-medium text-white/95 text-right">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer CTA */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/60">
            Engineered with Galaxy AI · S Pen Included
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-white/80 hover:text-white liquid-glass rounded-xl transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onPreorder();
              }}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition-all shadow-lg shadow-white/20"
            >
              Configure & Pre-Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
