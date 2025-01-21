import Link from "next/link";
import Logo from "../nova/Logo";
import { Button } from "../ui/button";
import { LinkBtn } from "../nova/buttons/LinkBtn";

export default function Nav() {
  return (
    <nav className="flex w-full items-center justify-evenly py-6">
      <div className="scale-95">
        <Logo />
      </div>
      <ul className="flex gap-10 text-base text-foreground">
        <li>
          <LinkBtn className="cursor-pointer text-foreground hover:text-secondary">
            <Link href="#features">Features</Link>
          </LinkBtn>
        </li>
        <li>
          <LinkBtn className="cursor-pointer text-foreground hover:text-secondary">
            <Link href="#pricing">Pricing</Link>
          </LinkBtn>
        </li>
        <li>
          <LinkBtn className="cursor-pointer text-foreground hover:text-secondary">
            <Link href="#contact">Contact</Link>
          </LinkBtn>
        </li>
      </ul>
      <div className="flex items-center gap-2">
        <Button className="font-semibold" asChild>
          <Link href="/spaces">Go to Nova</Link>
        </Button>
      </div>
    </nav>
  );
}
