import "./index.css";
import { Composition } from "remotion";
import { AdSavvyIntro } from "./Composition";
import { MascotsVideo } from "./MascotsVideo";
import { ClientVsMe } from "./ClientVsMe";
import { CourtCase } from "./CourtCase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AdSavvyIntro"
        component={AdSavvyIntro}
        durationInFrames={330}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MascotsVideo"
        component={MascotsVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClientVsMe"
        component={ClientVsMe}
        durationInFrames={490}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CourtCase"
        component={CourtCase}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
