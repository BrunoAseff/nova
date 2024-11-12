import Logo from "@/components/nova/logo";
import PrimaryBtn from "@/components/nova/buttons/PrimaryBtn";
import Image from "next/image";
import Link from "next/link";
import { BlurFade } from "@/components/ui/BlurFade";
import { Star } from "@/components/icons/Star";
import { LinkBtn } from "@/components/nova/buttons/LinkBtn";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <BlurFade
        className="flex flex-col items-center justify-center gap-4 px-12 py-16 md:px-4"
        delay={0.25 * 3}
        inView
      >
        <Logo />

        <p className="italic text-foreground">
          A platform that helps you shine through focus and calm.
        </p>
      </BlurFade>
      <BlurFade className="relative mb-12" delay={0.25 * 4} inView>
        <div className="absolute -inset-2 rounded-lg bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-primary via-secondary to-secondary opacity-50 blur-2xl"></div>
        <Image
          className="relative rounded-lg"
          src="/backgrounds/home.webp"
          alt="Nova"
          placeholder="blur"
          blurDataURL="/blur/blurTestImage.png"
          width={450}
          height={450}
        />
      </BlurFade>
      <BlurFade
        className="flex flex-col items-center gap-4"
        delay={0.25 * 5}
        inView
      >
        <PrimaryBtn hasLink href="/spaces">
          <p> Get started</p>
          <Star />
        </PrimaryBtn>

        <LinkBtn>
          {" "}
          <Link
            className="flex items-center font-open text-sm font-light text-secondary-foreground"
            href="/spaces"
          >
            Continue without login
          </Link>
        </LinkBtn>
      </BlurFade>
    </main>
  );
}
