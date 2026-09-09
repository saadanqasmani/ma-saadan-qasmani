import { Composition } from "remotion";
import { Intro, FPS, DURATION_IN_FRAMES } from "./Intro";

/**
 * The title sequence for The Highest Branch, as video.
 *
 * The browser overlay and this composition run the same code: the same rig,
 * the same nine beats, the same scene. What video adds is that a frame can be
 * rendered and looked at on its own, which is the only way to actually draw
 * something rather than guess at it through a live preview.
 */
export const RemotionRoot: React.FC = () => (
  <Composition
    id="HighestBranchIntro"
    component={Intro}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
