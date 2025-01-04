import PrimaryBtn from "@/components/nova/buttons/PrimaryBtn";
import MusicIllustration from "@/components/svgs/MusicIllustration";
import { TabHeader } from "@/components/tabHeader";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function MusicTab() {
  return (
    <main className="h-screen">
      <TabHeader
        title="Music"
        subtitle="Manage your music library to enhance your listening experience."
        Icon={MusicIllustration}
      />
      <div className="mx-auto mt-28 flex h-full w-[135%] flex-col gap-6 md:w-[110%]">
        <div className="mt-6 flex min-h-16 w-full flex-col items-center gap-6 space-x-2 rounded-2xl border-[1px] border-secondary/60 bg-background p-4 shadow-[0px_20px_207px_10px] shadow-secondary/40">
          <Label className="text-md px-3 font-montserrat text-foreground">
            Upgrade to{" "}
            <span className="font-semibold text-secondary">Supernova</span> to
            access custom playlists.
          </Label>
          <PrimaryBtn className="rounded-xl border-[1px] border-secondary/60 bg-secondary-smooth-700/10 px-4 py-3 text-sm text-foreground transition-all hover:rounded-full hover:bg-secondary-smooth-700/10">
            <Link href="/pricing">
              <p>Upgrade</p>
            </Link>
          </PrimaryBtn>
        </div>
      </div>{" "}
    </main>
  );
}
