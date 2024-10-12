export default function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="bg-gradient-to-br from-primary from-45% via-primary-foreground to-primary-foreground bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-[5rem]">
      {children}
    </h1>
  );
}
