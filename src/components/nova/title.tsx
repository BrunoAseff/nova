export default function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="bg-gradient-to-br from-primary from-10% via-secondary via-50% to-primary-foreground to-80% bg-clip-text text-5xl font-medium tracking-tight text-transparent sm:text-[5rem]">
      {children}
    </h1>
  );
}
