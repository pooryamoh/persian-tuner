import { useInterval } from "usehooks-ts";
import React, { useCallback, useState } from "react";
import useAnalyser from "./useAnalyser";
import { PitchDetector } from "pitchy";
import Koron from "./components/Koron";
import Sori from "./components/Sori";
import Diese from "./components/Diese";
import GaugeComponent from "react-gauge-component";

type Note = {
  index: number;
  title: string;
  icon: React.ReactNode | undefined;
};

const notes: Note[] = [
  {
    index: 0,
    title: "La",
    icon: undefined,
  },
  { index: 1, title: "La", icon: <Sori /> },
  { index: 2, title: "La", icon: <Diese /> },
  { index: 3, title: "Si", icon: <Koron /> },
  { index: 4, title: "Si", icon: undefined },
  { index: 5, title: "Si", icon: <Sori /> },
  { index: 5, title: "Do", icon: <Koron /> },
  { index: 6, title: "Do", icon: undefined },
  { index: 7, title: "Do", icon: <Sori /> },
  { index: 8, title: "Do", icon: <Diese /> },
  { index: 9, title: "Re", icon: <Koron /> },
  { index: 10, title: "Re", icon: undefined },
  { index: 11, title: "Re", icon: <Sori /> },
  { index: 12, title: "Re", icon: <Diese /> },
  { index: 13, title: "Mi", icon: <Koron /> },
  { index: 14, title: "Mi", icon: undefined },
  { index: 15, title: "Mi", icon: <Sori /> },
  { index: 15, title: "Fa", icon: <Koron /> },
  { index: 16, title: "FA", icon: undefined },
  { index: 17, title: "FA", icon: <Sori /> },
  { index: 18, title: "FA", icon: <Diese /> },
  { index: 19, title: "Sol", icon: <Koron /> },
  { index: 20, title: "Sol", icon: undefined },
  { index: 21, title: "Sol", icon: <Sori /> },
  { index: 22, title: "Sol", icon: <Diese /> },
  { index: 23, title: "La", icon: <Koron /> },
];

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
        if (clarity > 0.9) setPitch(pitch);
      }
    },
    ctx && analyser ? 100 : null
  );
  const cent = pitch
    ? (24 * Math.log2(pitch / 440) - Math.round(24 * Math.log2(pitch / 440))) *
      25
    : undefined;

  const noteIndex = pitch
    ? ((Math.round(24 * Math.log2(pitch / 440)) % 24) + 24) % 24
    : undefined;
  const centColor = useCallback((value: number) => {
    if (value <= 5) return "#5BE12C";
    if (value <= 15) return "#F5CD19";
    if (value <= 25) return "#EA4228";
    return "#0a0a0a";
  }, []);
  const getIndex = useCallback((current: number, toNext: number) => {
    return (((current + toNext) % 24) + 24) % 24;
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <button onClick={startAnalyser}>start</button>
      {pitch && `${pitch} Hz`}
      {pitch && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {notes
            .filter((note) => note.index === getIndex(noteIndex!, -2))
            .map((note, index) => (
              <div
                style={{
                  border: `1px solid #BEBEBE`,
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: `#BEBEBE55`,
                  color: "black",
                  transform: "scale(0.50)",
                }}
              >
                {index !== 0 && (
                  <span
                    style={{
                      borderLeft: "1px solid black",
                      width: 0,
                      borderRight: "1px solid black",
                      height: "100%",
                    }}
                  ></span>
                )}
                <span style={{ fontSize: "2rem" }}>
                  {note.title}
                  {note.icon}
                  <sub>
                    {4 +
                      Math.floor(
                        Math.log2(pitch / (440 * Math.pow(2, -9 / 12)))
                      )}
                  </sub>
                </span>
              </div>
            ))}
          {notes
            .filter((note) => note.index === getIndex(noteIndex!, -1))
            .map((note, index) => (
              <div
                style={{
                  border: `1px solid #BEBEBE`,
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: `#BEBEBE55`,
                  color: "black",
                  transform: "scale(0.75)",
                }}
              >
                {index !== 0 && (
                  <span
                    style={{
                      borderLeft: "1px solid black",
                      width: 0,
                      borderRight: "1px solid black",
                      height: "100%",
                    }}
                  ></span>
                )}
                <span style={{ fontSize: "2rem" }}>
                  {note.title}
                  {note.icon}
                  <sub>
                    {4 +
                      Math.floor(
                        Math.log2(pitch / (440 * Math.pow(2, -9 / 12)))
                      )}
                  </sub>
                </span>
              </div>
            ))}
          {notes
            .filter((note) => note.index === noteIndex)
            .map((note, index) => (
              <div
                style={{
                  border: `1px solid ${centColor(Math.abs(cent!))}`,
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: `${centColor(Math.abs(cent!))}55`,
                  color: "black",
                }}
              >
                {index !== 0 && (
                  <span
                    style={{
                      borderLeft: "1px solid black",
                      width: 0,
                      borderRight: "1px solid black",
                      height: "100%",
                    }}
                  ></span>
                )}
                <span style={{ fontSize: "2rem" }}>
                  {note.title}
                  {note.icon}
                  <sub>
                    {4 +
                      Math.floor(
                        Math.log2(pitch / (440 * Math.pow(2, -9 / 12)))
                      )}
                  </sub>
                </span>
              </div>
            ))}
          {notes
            .filter((note) => note.index === getIndex(noteIndex!, 1))
            .map((note, index) => (
              <div
                style={{
                  border: `1px solid #BEBEBE`,
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: `#BEBEBE55`,
                  color: "black",
                  transform: "scale(0.75)",
                }}
              >
                {index !== 0 && (
                  <span
                    style={{
                      borderLeft: "1px solid black",
                      width: 0,
                      borderRight: "1px solid black",
                      height: "100%",
                    }}
                  ></span>
                )}
                <span style={{ fontSize: "2rem" }}>
                  {note.title}
                  {note.icon}
                  <sub>
                    {4 +
                      Math.floor(
                        Math.log2(pitch / (440 * Math.pow(2, -9 / 12)))
                      )}
                  </sub>
                </span>
              </div>
            ))}

          {notes
            .filter((note) => note.index === getIndex(noteIndex!, 2))
            .map((note, index) => (
              <div
                style={{
                  border: `1px solid #BEBEBE`,
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: `#BEBEBE55`,
                  color: "black",
                  transform: "scale(0.5)",
                }}
              >
                {index !== 0 && (
                  <span
                    style={{
                      borderLeft: "1px solid black",
                      width: 0,
                      borderRight: "1px solid black",
                      height: "100%",
                    }}
                  ></span>
                )}
                <span style={{ fontSize: "2rem" }}>
                  {note.title}
                  {note.icon}
                  <sub>
                    {4 +
                      Math.floor(
                        Math.log2(pitch / (440 * Math.pow(2, -9 / 12)))
                      )}
                  </sub>
                </span>
              </div>
            ))}
        </div>
      )}
      {pitch && (
        <div style={{ height: "30rem", width: "30rem", marginTop: "2rem" }}>
          <GaugeComponent
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              // gradient: true,
              subArcs: [
                {
                  limit: -15,
                  color: "#EA4228",
                  showTick: true,
                },
                {
                  limit: -5,
                  color: "#F5CD19",
                  showTick: true,
                },
                {
                  limit: 5,
                  color: "#5BE12C",
                  showTick: true,
                },
                {
                  limit: 15,
                  color: "#F5CD19",
                  showTick: true,
                },
                {
                  color: "#EA4228",
                },
              ],
            }}
            pointer={{
              color: "#345243",
              length: 0.8,
              width: 15,
              // elastic: true,
            }}
            labels={{
              valueLabel: {
                formatTextValue: (value) => value + "¢",
              },
              tickLabels: {
                type: "outer",
                defaultTickValueConfig: {
                  formatTextValue: (value: unknown) => value + "¢",
                  style: { fontSize: 10 },
                },
                ticks: [{ value: -25 }, { value: 0 }, { value: 25 }],
              },
            }}
            value={cent}
            minValue={-25}
            maxValue={25}
          />
        </div>
      )}
    </div>
  );
}
