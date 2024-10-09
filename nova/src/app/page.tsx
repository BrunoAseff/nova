import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="bg-gradient-to-r from-blue-500 via-violet-400 to-blue-100 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-[5rem]">
          Nova
        </h1>
      </div>
    </main>
  );
}
