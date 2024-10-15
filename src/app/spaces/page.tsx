import Clock from "@/components/features/Clock";
import SpaceBackground from "@/components/nova/SpaceBackground";

export default function SpacesPage() {
  const customImage = "/testImage.jpg";

  return (
    <div>
      {" "}
      <SpaceBackground image={customImage} />
      <Clock timeFormat="24h" position="center" />
    </div>
  );
}
