export const FourSevenEightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={36}
    height={36}
    color={props.color ?? "currentColor"}
    fill={"none"}
    {...props}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M9.5 9.5L12.9999 12.9996M16 8L11 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
