import Image from "next/image";

interface TabHeaderProps {
  title: string;
  subtitle: string;
  src: string;
}

export const TabHeader: React.FC<TabHeaderProps> = ({
  title,
  subtitle,
  src,
}) => (
  <div className="absolute top-3 flex w-fit items-center text-secondary">
    <div className="grid h-full grid-cols-2 items-center justify-start gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="font-delius text-3xl text-secondary-foreground/80">
          <span className="text-secondary">{title}</span> settings
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Image src={src} alt={title} width={270} height={220} />
    </div>
  </div>
);
