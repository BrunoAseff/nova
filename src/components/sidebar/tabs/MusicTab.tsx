import Image from "next/image";

export default function MusicTab() {
  return (
    <main className="h-screen">
      <div className="absolute top-3 flex w-fit items-center text-secondary">
        <div className="grid h-full grid-cols-2 items-center justify-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-delius text-3xl text-secondary-foreground/80">
              <span className="text-secondary">Music</span> settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your music library to enhance your listening experience.
            </p>
          </div>

          <Image
            src="/illustrations/music.svg"
            alt="Music"
            width={290}
            height={220}
          />
        </div>
      </div>

      <div className="mt-28 flex h-full flex-col gap-10"></div>
    </main>
  );
}
