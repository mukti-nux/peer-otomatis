import React from 'react';

const Toggle = ({
  checked,
  onChange,
  label,
  labelOn = 'Ya',
  labelOff = 'Tidak',
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: {
      track: 'w-9 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };
  
  const sizes = sizeClasses[size];
  
  return (
    <label className={`inline-flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          className="sr-only peer"
          disabled={disabled}
        />
        <div className={`${sizes.track} bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-${sizes.translate} ${sizes.translate} peer-checked:bg-wa transition-colors`}>
          <div className={`${sizes.thumb} bg-white shadow-sm mt-0.5 ml-0.5 rounded-full transition-transform ${checked ? sizes.translate : ''}`} />
        </div>
      </div>
      <span className="text-sm text-slate-600">
        {label && <span className="mr-2">{label}</span>}
        {!label && (
          <span className={checked ? 'text-wa font-medium' : 'text-slate-500'}>
            {checked ? labelOn : labelOff}
          </span>
        )}
      </span>
    </label>
  );
};

export default Toggle;
