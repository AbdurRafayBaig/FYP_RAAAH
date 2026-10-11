export default function PageTitle({ title, children, aside }) {
  return (
    <div className="flex flex-col gap-6 border-b border-rule pb-8 pt-12 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-3">
        <h1 className="text-[40px] sm:text-[48px]">{title}</h1>
        {children && <div className="text-[16px] text-ink-2">{children}</div>}
      </div>
      {aside}
    </div>
  );
}
