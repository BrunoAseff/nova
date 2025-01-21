import LogoIcon from "../icons/LogoIcon";

export default function Logo() {
  return (
    <div className="flex w-fit items-center text-5xl font-medium text-foreground">
      <LogoIcon className="h-16 w-16" />

      <h1 className="mb-3">Nova</h1>
    </div>
  );
}
