import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles } from 'lucide-react';

interface PreorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  { id: 'titanium-gray', name: 'Titanium Gray', hex: '#636569' },
  { id: 'titanium-black', name: 'Titanium Black', hex: '#232426' },
  { id: 'titanium-violet', name: 'Titanium Violet', hex: '#585268' },
  { id: 'titanium-amber', name: 'Titanium Amber', hex: '#948366' },
];

const STORAGES = [
  { id: '256gb', size: '256 GB', price: '$1,299' },
  { id: '512gb', size: '512 GB', price: '$1,419', popular: true },
  { id: '1tb', size: '1 TB', price: '$1,659' },
];

export const PreorderModal: React.FC<PreorderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0].id);
  const [selectedStorage, setSelectedStorage] = useState(STORAGES[1].id);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preorder-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg liquid-glass-elevated rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          aria-label="Close pre-order modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Flagship Reservation</span>
            </div>
            <h2 id="preorder-modal-title" className="text-2xl font-bold tracking-tight mb-2">
              Reserve Galaxy S26 Ultra
            </h2>
            <p className="text-xs text-neutral-300 mb-6">
              Lock in your priority delivery date with complimentary Galaxy Buds3 Pro & double storage upgrade.
            </p>

            {/* Color Swatches */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-neutral-300 mb-2">
                Chassis Finish:{' '}
                <span className="text-white font-semibold">
                  {COLORS.find((c) => c.id === selectedColor)?.name}
                </span>
              </label>
              <div className="flex items-center gap-3">
                {COLORS.map((color) => {
                  const isSelected = selectedColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Select ${color.name}`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Storage options */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-neutral-300 mb-2">
                Storage Capacity
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {STORAGES.map((s) => {
                  const isSelected = selectedStorage === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedStorage(s.id)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-white/20 border-white text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.size}</div>
                      <div className="text-[11px] opacity-75">{s.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="preorder-email" className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Notification Email
                </label>
                <input
                  id="preorder-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-neutral-500 text-xs focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-[0_0_24px_rgba(255,255,255,0.3)] active:scale-95"
              >
                Confirm Priority Reservation
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero deposit required</span>
              </span>
              <span>Developer: Latera Markos</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center mb-4">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">Priority Reservation Confirmed</h3>
            <p className="text-xs text-neutral-300 max-w-xs mx-auto mb-6">
              You will receive invitation instructions prior to the global launch window.
            </p>
            <p className="text-xs font-mono text-neutral-400 mb-6">
              Developer: Latera Markos
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-all"
            >
              Back to Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
