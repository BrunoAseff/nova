import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="z-50 flex w-full items-center justify-evenly">
      <div className="ml-20 flex flex-col gap-4 text-5xl text-foreground">
        <h1>A platform that helps you shine through focus and calm.</h1>
        <Button className="scale-110 font-semibold">Get started</Button>
      </div>
      <div className="relative scale-[0.70] overflow-hidden rounded-lg shadow-[0px_20px_1007px_10px] shadow-secondary/60">
        <video
          className="h-full w-full scale-[1.1] object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/pomodoro.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
