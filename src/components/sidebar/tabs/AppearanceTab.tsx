import AppearanceIllustration from "@/components/svgs/AppearanceIllustration";
import { TabHeader } from "@/components/tabHeader";

export default function AppearanceTab() {
  return (
    <main className="h-screen">
      <TabHeader
        title="Appearance"
        subtitle="Personalize the visual theme to match your aesthetic preferences."
        Icon={AppearanceIllustration}
      />
      <div className="mt-28 flex h-full flex-col gap-10"></div>
    </main>
  );
}
