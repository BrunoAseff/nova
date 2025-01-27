import Link from "next/link";
import { LinkBtn } from "../nova/buttons/LinkBtn";
import Logo from "../nova/Logo";

export default function Footer() {
  return (
    <div className="flex w-full justify-between border-t-[1px] border-accent pb-32 pt-6">
      <div className="flex w-full flex-col items-start px-10">
        <div className="w-full origin-left scale-50">
          <Logo />
        </div>

        <p className="text-muted-foreground">© 2025, Nova Inc.</p>
      </div>
      <div className="flex flex-col items-end gap-4 px-10">
        <LinkBtn className="cursor-pointer text-sm text-muted-foreground hover:text-secondary">
          <Link href="/privacy-policy">Privacy Policy</Link>
        </LinkBtn>
        <LinkBtn className="cursor-pointer text-sm text-muted-foreground hover:text-secondary">
          <Link href="/terms-of-service">Terms of Service</Link>
        </LinkBtn>
        <div className="flex flex-col items-end justify-end text-sm text-muted-foreground">
          <p className="font-semibold">Email</p>{" "}
          <p>team.novaspaces@gmail.com</p>{" "}
        </div>
      </div>
    </div>
  );
}
