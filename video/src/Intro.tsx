import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { frameAt } from "@/lib/novel/monkeySequence";
import { IntroScene } from "@/components/novel/IntroScene";

/** 8.2 seconds, the length the site plays it at. */
export const FPS = 30;
export const DURATION_IN_FRAMES = Math.round(8.2 * FPS);

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // The sequence is written against a 0..1 clock, so the frame number is the
  // only thing that changes between the browser overlay and the render.
  const t = Math.min(1, frame / (durationInFrames - 1));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1424" }}>
      <IntroScene frame={frameAt(t)} />
    </AbsoluteFill>
  );
};
