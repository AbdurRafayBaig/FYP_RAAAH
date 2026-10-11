const TONES = {
  info: 'border-accent',
  success: 'border-low',
  warning: 'border-moderate',
  error: 'border-critical',
};

// A message set off by a coloured rule on the left
export default function Notice({ tone = 'info', title, children, action, className = '' }) {
  return (
    <div
      role={tone === 'error' || tone === 'warning' ? 'alert' : 'status'}
      className={`border-l-[3px] bg-surface py-3 pl-4 pr-4 ${TONES[tone]} ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[14px] text-ink-2">
          {title && <p className="font-medium text-ink">{title}</p>}
          {children}
        </div>
        {action}
      </div>
    </div>
  );
}
