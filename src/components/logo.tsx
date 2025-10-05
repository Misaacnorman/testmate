export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-sidebar-foreground"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
        <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" />
        <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" />
        <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
      </svg>
      <span className="truncate text-lg font-semibold tracking-wide text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        TestMAte
      </span>
    </div>
  );
}
