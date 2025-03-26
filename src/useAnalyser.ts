import { useState } from "react";
const constraints = {
  audio: true,
  video: false,
};
export default function useAnalyser() {
  const [ctx, setCtx] = useState<AudioContext | undefined>(undefined);
  const [analyser, setAnalyser] = useState<AnalyserNode | undefined>(undefined);

  const startAnalyser = () => {
    navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
      const ctx = new AudioContext();
      const mic = ctx.createMediaStreamSource(mediaStream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 16384;
      mic.connect(analyser);
      setCtx(ctx);
      setAnalyser(analyser);
    });
  };
  return { ctx, analyser, startAnalyser };
}
