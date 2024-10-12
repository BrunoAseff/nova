import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <Title>Nova</Title>
      </div>

      <Button
        className="rounded-2xl text-black hover:bg-primary-foreground"
        variant="default"
        size="lg"
      >
        Get started
      </Button>
      <Link className="mt-4 text-primary-foreground" href="#">
        Continue without login
      </Link>
    </main>
  );
}
