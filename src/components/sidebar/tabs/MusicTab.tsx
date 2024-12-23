import MusicIllustration from "@/components/svgs/MusicIllustration";
import { TabHeader } from "@/components/tabHeader";

export default function MusicTab() {
  return (
    <main className="h-screen">
      <TabHeader
        title="Music"
        subtitle="Manage your music library to enhance your listening experience."
        Icon={MusicIllustration}
      />
      <div className="mt-28 flex h-full flex-col gap-10"></div>
    </main>
  );
}
