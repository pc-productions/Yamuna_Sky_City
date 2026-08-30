import { IntroExperience } from "@/components/sections/IntroExperience";
import { ProjectFacts } from "@/components/sections/ProjectFacts";
import { Location } from "@/components/sections/Location";
import { PrivateViewingCTA } from "@/components/sections/PrivateViewingCTA";
import { Explore3D } from "@/components/sections/Explore3D";
import { PeopleBehind } from "@/components/sections/PeopleBehind";
import { Legacy } from "@/components/sections/Legacy";
import { Contact } from "@/components/sections/Contact";

/**
 * Homepage flow — a flat, explicit, ordered list of independent section
 * components. Reordering = reordering lines below; removing a section =
 * deleting its line; each section owns its own content/data import, so
 * none of this needs to change when sections are added elsewhere.
 */
export default function Home() {
  return (
    <>
      {/* 1–2. Cinematic intro overlay + looping Hero video underneath it */}
      <IntroExperience />

      {/* 3. Project introduction and hard facts */}
      <ProjectFacts />

      {/* 4. Location / connectivity */}
      <Location />

      {/* 5. Private viewing conversion checkpoint */}
      <PrivateViewingCTA />

      {/* 6. External 3D location/mapping experience */}
      <Explore3D />

      {/*
        Future sections slot in here, in this order, with no refactor of
        surrounding sections:
          <Amenities />
          <PenthouseStructure />
          <EngineeringMarvel />
      */}

      {/* 7. People behind the project */}
      <PeopleBehind />

      {/* 8. Yamuna's legacy */}
      <Legacy />

      {/* 9. Contact / private viewing (Footer is rendered globally in SiteChrome) */}
      <Contact />
    </>
  );
}
