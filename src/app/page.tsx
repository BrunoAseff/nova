import { ArrowRight } from "@/components/icons/arrow-right";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <Title>Nova</Title>
      </div>
      <div className="relative mb-12">
        <div className="absolute -inset-2 rounded-lg bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-primary via-secondary to-secondary opacity-50 blur-2xl"></div>
        <Image
          className="relative rounded-lg"
          src="/testImage.jpg"
          alt="Nova"
          width={450}
          height={450}
        />
      </div>

      <Button
        className="rounded-2xl text-black hover:bg-primary-foreground"
        variant="default"
        size="lg"
      >
        Get started
      </Button>
      <Button variant="link">
        {" "}
        <Link
          className="mt-8 flex items-center text-primary-foreground"
          href="/spaces"
        >
          Continue without login
          <ArrowRight color="#D1E9FF" />
        </Link>
      </Button>
    </main>
  );
}
