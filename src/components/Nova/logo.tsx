import Title from "@/components/Nova/title";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.svg" alt="Nova" width={75} height={75} />
      <Title>Nova</Title>
    </div>
  );
}
