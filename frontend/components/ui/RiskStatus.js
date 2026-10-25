"use client";

import { RISK_COLORS } from '@/constants/riskLevels';
import { useT } from '@/context/LanguageContext';

export default function RiskStatus({ status = 'Low Risk', size = 'sm', className = '' }) {
  const t = useT();
  const color = RISK_COLORS[status] || RISK_COLORS['Low Risk'];
  const large = size === 'md';
  return (
    <span className={`inline-flex items-center gap-2 ${large ? 'text-[16px] text-ink' : 'text-[13px] text-ink-2'} ${className}`}>
      <span className={`${large ? 'h-2.5 w-2.5' : 'h-2 w-2'} shrink-0`} style={{ backgroundColor: color }} aria-hidden="true" />
      {t(status.replace(' Risk', ' risk'))}
    </span>
  );
}
