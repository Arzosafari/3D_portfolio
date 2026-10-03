interface BrandSymbolProps {
  small?: boolean;
}

export default function BrandSymbol({ small = false }: BrandSymbolProps) {
  return (
    <span className={`brand-symbol ${small ? 'brand-symbol--small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M6 24V8l20 16V8" stroke="currentColor" strokeWidth="2.15" strokeLinecap="square" />
        <circle cx="25.8" cy="8.1" r="2.3" fill="var(--acid)" />
      </svg>
    </span>
  );
}
