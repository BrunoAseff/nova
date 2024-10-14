import { ArrowRight } from "@/components/icons/arrow-right";
import Logo from "@/components/Nova/logo";
import PrimaryBtn from "@/components/Nova/buttons/PrimaryBtn";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BlurFade } from "@/components/ui/BlurFade";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <BlurFade
        className="flex flex-col items-center justify-center gap-4 px-4 py-16"
        delay={0.25}
        inView
      >
        <Logo />

        <p className="italic text-gray-300">
          A platform that helps you shine through focus and calm.
        </p>
      </BlurFade>
      <BlurFade className="relative mb-12" delay={0.25 * 2} inView>
        <div className="absolute -inset-2 rounded-lg bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-primary via-secondary to-secondary opacity-50 blur-2xl"></div>
        <Image
          className="relative rounded-lg"
          src="/testImage.jpg"
          alt="Nova"
          placeholder="blur"
          blurDataURL="data:image/png;base64,LsEgH.R3M{RjcInfjpRjt9s-RQoc"
          width={450}
          height={450}
        />
      </BlurFade>
      <BlurFade className="flex flex-col gap-4" delay={0.25 * 3} inView>
        <PrimaryBtn>Get started</PrimaryBtn>

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
      </BlurFade>
    </main>
  );
}
