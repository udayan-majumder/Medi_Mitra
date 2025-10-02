"use client";
import React from 'react';
import { 
  Stethoscope, 
  Heart, 
  Baby, 
  Activity
} from 'lucide-react';
import Image from 'next/image';

const KidneyIcon = () => (
  <Image 
    src="/kidney.png" 
    alt="Kidney" 
    width={32} 
    height={32}
  />
);

const specializations = [
  { value: 'General Physician', label: 'General Physician', icon: Stethoscope },
  { value: 'Cardiologist', label: 'Cardiologist', icon: Heart },
  { value: 'Dermatologist', label: 'Dermatologist', icon: Activity },
  { value: 'Pediatrician', label: 'Pediatrician', icon: Baby },
  { value: 'Nephrologist', label: 'Nephrologist', icon: KidneyIcon }
];

export const SpecializationSelector = ({ 
  selectedSpecialization, 
  onSpecializationChange, 
  disabled = false 
}) => {
  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold text-gray-800 mb-3">
        <Stethoscope className="inline mr-2 w-5 h-5" />
        Select Doctor Specialization
      </label>
      {/* Mobile-friendly horizontal scrollable container */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max px-1">
          {specializations.map((spec) => (
            <button
              key={spec.value}
              type="button"
              onClick={() => onSpecializationChange(spec.value)}
              disabled={disabled}
              className={`
                flex-shrink-0 p-3 rounded-xl border-2 transition-all text-center flex flex-col items-center gap-2 min-w-[120px]
                ${selectedSpecialization === spec.value
                  ? 'border-green-600 bg-green-50 shadow-md'
                  : 'border-gray-300 bg-white hover:border-green-400'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {spec.icon === KidneyIcon ? (
                <KidneyIcon className="w-8 h-8" />
              ) : (
                <spec.icon className="w-8 h-8 text-gray-700" />
              )}
              <span className="font-medium text-gray-800 text-sm leading-tight">{spec.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecializationSelector;

