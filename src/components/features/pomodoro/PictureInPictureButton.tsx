import { useEffect, useRef, useState } from "react";
import IconBtn from "@/components/nova/buttons/IconBtn";
import { PictureInPicture } from "@phosphor-icons/react";
import html2canvas from "html2canvas";
import { useCycleStore } from "@/stores/useCycleStore";

interface PictureInPictureButtonProps {
  containerRef: React.RefObject<HTMLElement>;
}

export default function PictureInPictureButton({
  containerRef,
}: PictureInPictureButtonProps) {
  const [isPiPActive, setIsPiPActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeCycle = useCycleStore((state) => state.activeCycle);
  const pipContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoRef.current) {
      const video = document.createElement("video");
      video.playsInline = true;
      video.muted = true;
      videoRef.current = video;
    }

    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvasRef.current = canvas;
    }

    return () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    };
  }, []);

  useEffect(() => {
    if (
      !isPiPActive ||
      !containerRef.current ||
      !canvasRef.current ||
      !videoRef.current
    )
      return;

    const updatePiP = async () => {
      try {
        // Create a clone of the container for capturing
        const clonedContainer = containerRef.current!.cloneNode(
          true,
        ) as HTMLElement;

        // Remove elements that should be hidden in PiP
        const elementsToHide =
          clonedContainer.getElementsByClassName("hide-in-pip");
        while (elementsToHide.length > 0) {
          elementsToHide[0]!.remove();
        }

        const pipContainer = pipContainerRef.current;

        if (!pipContainer) return;

        // Add the clone to our hidden container
        pipContainer.innerHTML = "";
        pipContainer.appendChild(clonedContainer);

        // Make sure the clone is visible
        clonedContainer.style.display = "block";
        clonedContainer.style.position = "static";

        // Set fixed dimensions
        const WIDTH = 500; // Base width
        const HEIGHT = 300; // Base height (4:3 aspect ratio)

        pipContainer.style.width = `${WIDTH}px`;
        pipContainer.style.height = `${HEIGHT}px`;
        clonedContainer.style.width = `${WIDTH}px`;
        clonedContainer.style.height = `${HEIGHT}px`;

        // Capture the cloned and visible content
        const canvas = await html2canvas(clonedContainer, {
          width: WIDTH,
          height: HEIGHT,
          backgroundColor: "#000000",
        });

        // Update our PiP canvas
        canvasRef.current!.width = WIDTH;
        canvasRef.current!.height = HEIGHT;
        const ctx = canvasRef.current!.getContext("2d");

        if (ctx && canvas.width > 0 && canvas.height > 0) {
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);
          ctx.drawImage(canvas, 0, 0, WIDTH, HEIGHT);
        }

        // Clean up
        pipContainer.innerHTML = "";
      } catch (error) {
        console.error("Error updating PiP:", error);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const intervalId = setInterval(updatePiP, 1000);
    return () => clearInterval(intervalId);
  }, [isPiPActive, containerRef]);

  const togglePiP = async () => {
    try {
      if (!document.pictureInPictureEnabled) {
        console.error("Picture in Picture not supported");
        return;
      }

      if (isPiPActive && document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
        return;
      }

      if (!videoRef.current || !canvasRef.current || !containerRef.current)
        return;

      // Set initial dimensions
      const WIDTH = 500;
      const HEIGHT = 375;

      canvasRef.current.width = WIDTH;
      canvasRef.current.height = HEIGHT;

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }

      // Start video stream
      const stream = canvasRef.current.captureStream(30);
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      await videoRef.current.requestPictureInPicture();
      setIsPiPActive(true);
    } catch (error) {
      console.error("PiP error:", error);
    }
  };

  if (!activeCycle) return null;

  return (
    <>
      <IconBtn
        tooltipContent={
          isPiPActive ? "Exit Picture in Picture" : "Picture in Picture"
        }
        onClick={togglePiP}
      >
        <PictureInPicture size={24} />
      </IconBtn>

      {/* Hidden container for PiP content */}
      <div
        ref={pipContainerRef}
        style={{
          position: "absolute",
          left: "-9999px",
          pointerEvents: "none",
          width: "500px",
          height: "300px",
        }}
      />
    </>
  );
}
