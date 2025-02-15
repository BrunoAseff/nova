/* eslint-disable @typescript-eslint/no-unused-vars */
interface TabSectionProps {
  maxWidth?: string;
  isScrollable?: boolean;
  hasBackground?: boolean;
  children: React.ReactNode;
  variant?: "default" | "danger";
}

export default function TabSection({
  maxWidth,
  isScrollable = false,
  hasBackground = true,
  variant = "default",
  children,
}: TabSectionProps) {
  return <section className="grid w-full grid-cols-1">{children}</section>;
}
