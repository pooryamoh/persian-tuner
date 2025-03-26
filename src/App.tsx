import { useInterval } from "usehooks-ts";
import { useState } from "react";
import useAnalyser from "./useAnalyser";
import { PitchDetector } from "pitchy";

export default function App() {
  const [pitch, setPitch] = useState<number | undefined>(undefined);
  const { startAnalyser, ctx, analyser } = useAnalyser();
  useInterval(
    () => {
      if (analyser && ctx) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        const detector = PitchDetector.forFloat32Array(
          analyser.frequencyBinCount
        );
        analyser.getFloatTimeDomainData(dataArray);
        const [pitch, clarity] = detector.findPitch(dataArray, ctx.sampleRate);
        console.log(clarity);
        setPitch(pitch);
      }
    },
    ctx && analyser ? 100 : null
  );

  return (
    <div>
      a<button onClick={startAnalyser}>start</button>
      {pitch && `${pitch} Hz`}
    </div>
  );
}
