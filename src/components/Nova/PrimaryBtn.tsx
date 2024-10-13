import { Button } from "../ui/button";
import { inter } from "@/app/layout";
export default function PrimaryBtn({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Button
      className={`rounded-2xl text-lg ${inter.className} font-semibold text-black hover:bg-primary-foreground`}
      variant="default"
      size="lg"
    >
      {children}
    </Button>
  );
}
