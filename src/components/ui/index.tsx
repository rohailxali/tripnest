import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ToastType } from '../../types';

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading = false,
  icon, iconRight, children, className = '', disabled, ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-[#1e3a5f] text-white hover:bg-[#162d4a] focus:ring-[#1e3a5f] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white dark:bg-white/5 text-[#1e3a5f] dark:text-blue-400 border-2 border-[#1e3a5f] dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-[#1e3a5f]',
    accent: 'bg-[#f97316] text-white hover:bg-[#ea580c] focus:ring-[#f97316] shadow-md hover:shadow-lg hover:-translate-y-0.5',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 focus:ring-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <Spinner size="sm" color={variant === 'secondary' ? 'dark' : 'white'} /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'orange' | 'red' | 'gray' | 'teal' | 'purple';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue', size = 'sm' }) => {
  const variants = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    gray: 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  };
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm' };
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; color?: 'white' | 'dark' | 'primary'; }

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  const colors = { 
    white: 'border-white/30 border-t-white', 
    dark: 'border-gray-300 dark:border-white/10 border-t-gray-700 dark:border-t-white', 
    primary: 'border-blue-200 dark:border-blue-900/30 border-t-blue-600 dark:border-t-blue-400' 
  };
  return <div className={`rounded-full border-2 animate-spin ${sizes[size]} ${colors[color]}`} />;
};

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick, padding = true }) => (
  <div
    className={`bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden ${hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer' : 'shadow-sm'} ${padding ? 'p-6' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, hint, icon, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">{icon}</div>}
      <input
        className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} rounded-xl border ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-white/10 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-white dark:bg-white/5 dark:text-white transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    {hint && !error && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
  </div>
);

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>}
    <select
      className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-400' : 'border-gray-200 dark:border-white/10'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-[#0f2035] dark:text-white transition-all duration-200 ${className}`}
      {...props}
    >
      {options.map(opt => <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0f2035]">{opt.label}</option>)}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white dark:bg-[#0a1628] rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto border dark:border-white/10`} style={{ animation: 'fadeUp 0.3s ease-out' }}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        )}
        <div className={title ? 'p-6' : ''}>{children}</div>
      </div>
    </div>
  );
};

// ─── Toast Container ──────────────────────────────────────────────────────────
const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-orange-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const toastStyles: Record<ToastType, string> = {
  success: 'border-l-4 border-green-500',
  error: 'border-l-4 border-red-500',
  warning: 'border-l-4 border-orange-500',
  info: 'border-l-4 border-blue-500',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`bg-white dark:bg-[#1e3a5f] rounded-xl shadow-lg p-4 flex items-start gap-3 min-w-[300px] max-w-[400px] border dark:border-white/10 ${toastStyles[toast.type]}`}
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          {toastIcons[toast.type]}
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{toast.title}</p>
            {toast.message && <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">{toast.message}</p>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-6">{description}</p>
    {action}
  </div>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
interface ProgressBarProps { value: number; max: number; color?: string; showLabel?: boolean; }

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, color = '#0ea5e9', showLabel = false }) => {
  const pct = Math.min((value / max) * 100, 100);
  const isOver = value > max;
  return (
    <div className="w-full">
      <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: isOver ? '#ef4444' : color }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">${value.toLocaleString()}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">${max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────
interface Tab { id: string; label: string; icon?: React.ReactNode; }
interface TabsProps { tabs: Tab[]; activeTab: string; onChange: (id: string) => void; }

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          activeTab === tab.id 
            ? 'bg-white dark:bg-[#0ea5e9] text-[#1e3a5f] dark:text-white shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
        }`}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
interface AvatarProps { src?: string; name: string; size?: 'sm' | 'md' | 'lg'; }

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md' }) => {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return src ? (
    <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`} />
  ) : (
    <div className={`${sizes[size]} rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold ring-2 ring-white`}>
      {initials}
    </div>
  );
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
interface StepIndicatorProps { steps: string[]; current: number; }

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, current }) => (
  <div className="flex items-center justify-center gap-0">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            i < current ? 'bg-green-500 text-white' : i === current ? 'bg-[#1e3a5f] dark:bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/30' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={`text-xs mt-1 font-medium hidden sm:block ${i === current ? 'text-[#1e3a5f] dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{step}</span>
        </div>
        {i < steps.length - 1 && (
          <div className={`h-0.5 w-12 sm:w-16 mx-1 mb-4 transition-all duration-300 ${i < current ? 'bg-green-500' : 'bg-gray-200 dark:bg-white/10'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);
