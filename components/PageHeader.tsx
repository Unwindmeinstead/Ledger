export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="safe-top px-5 pt-6 pb-4 flex items-start justify-between">
      <div>
        <h1 className="font-serif text-[26px] leading-tight text-ink font-semibold">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-inkmuted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
