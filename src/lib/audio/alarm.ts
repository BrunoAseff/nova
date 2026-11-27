import { alarmSounds, getSoundSrc } from "@/content/sounds";

/**
 * Toca o alarme `repeat` vezes seguidas. Com várias abas abertas, só uma toca:
 * quem pegar o lock primeiro; as outras desistem na hora (`ifAvailable`).
 */
export async function playAlarm(soundId: string, repeat: number) {
  const src = getSoundSrc(alarmSounds, soundId);
  if (!src) return;

  const play = () => playTimes(src, repeat);

  if ("locks" in navigator) {
    await navigator.locks.request("nova:alarm", { ifAvailable: true }, (lock) =>
      lock ? play() : undefined,
    );
  } else {
    await play();
  }
}

function playTimes(src: string, times: number) {
  return new Promise<void>((resolve) => {
    const audio = new Audio(src);
    let played = 0;

    const next = () => {
      if (played >= times) return resolve();
      played += 1;
      audio.currentTime = 0;
      audio.play().catch(() => resolve());
    };

    audio.addEventListener("ended", next);
    audio.addEventListener("error", () => resolve());
    next();
  });
}
