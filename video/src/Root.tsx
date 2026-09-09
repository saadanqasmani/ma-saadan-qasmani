import { Composition } from "remotion";
import { Intro, FPS as INTRO_FPS, DURATION_IN_FRAMES } from "./Intro";
import { Film } from "./film/Film";
import { DURATION, FPS } from "./film/world";

/**
 * Two compositions.
 *
 * HighestBranchFilm is the paper cut-out film: the whole story as one climb.
 * HighestBranchIntro is the short title sequence the website plays, which
 * shares the site's own rig rather than this film's puppet.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HighestBranchFilm"
      component={Film}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="HighestBranchIntro"
      component={Intro}
      durationInFrames={DURATION_IN_FRAMES}
      fps={INTRO_FPS}
      width={1920}
      height={1080}
    />
  </>
);
