import "./index.css";
import { Composition } from "remotion";
import { AdSavvyIntro } from "./Composition";
import { GridPixelateWipeComposition } from "./GridPixelateWipeComposition";
import { AgencyBrand } from "./AgencyBrand";
import { TrackingInComposition } from "./TrackingInComposition";
import { MascotsVideo } from "./MascotsVideo";
import { ClientVsMe } from "./ClientVsMe";
import { CourtCase } from "./CourtCase";
import { MoneyReel } from "./MoneyReel";
import { CountdownReel } from "./CountdownReel";
import { WebsiteReel } from "./WebsiteReel";

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
      <Composition
        id="MoneyReel"
        component={MoneyReel}
        durationInFrames={390}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CountdownReel"
        component={CountdownReel}
        durationInFrames={420}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="WebsiteReel"
        component={WebsiteReel}
        durationInFrames={390}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GridPixelateWipe"
        component={GridPixelateWipeComposition}
        durationInFrames={90}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="AgencyBrand"
        component={AgencyBrand}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TrackingIn"
        component={TrackingInComposition}
        durationInFrames={90}
        fps={30}
        width={1280}
        height={400}
      />
    </>
  );
};
