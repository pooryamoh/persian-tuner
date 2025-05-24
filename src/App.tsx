import { useInterval } from "usehooks-ts";
import React, { useCallback, useState } from "react";
import useAnalyser from "./useAnalyser";
import { PitchDetector } from "pitchy";
import Koron from "./components/Koron";
import Sori from "./components/Sori";
import Diese from "./components/Diese";
import GaugeComponent from "react-gauge-component";
import { css } from "@emotion/react";
import Bemol from "./components/Bemol";

const noteAroundStyle = css`
  border: 1px solid #bebebe;
  border-radius: 0.5rem;
  background-color: #bebebe55;
  color: black;
  display: flex;
  align-self: center;
  font-size: ${2 * 0.75 * 0.75}rem;
  padding: ${0.5 * 0.75 * 0.75}rem;
  @media (min-width: 768px) {
    font-size: ${2 * 0.75}rem;
    padding: ${0.5 * 0.75}rem;
  }
`;
const sepratorStyle = css`
  border-left: 1px solid black;
  width: 0;
  border-right: 1px solid black;
  margin-inline-start: 0.5rem;
  margin-inline-end: 0.5rem;
`;
const noteAroundAroundStyle = css`
  border: 1px solid #bebebe;
  border-radius: 0.5rem;
  background-color: #bebebe55;
  color: black;
  display: flex;
  display: flex;
  align-self: center;
  font-size: ${2 * 0.5 * 0.75}rem;
  padding: ${0.5 * 0.5 * 0.75}rem;
  @media (min-width: 768px) {
    font-size: ${2 * 0.5}rem;
    padding: ${0.5 * 0.5}rem;
  }
`;

const noteBaseStyle = css`
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: black;
  font-size: 1.5rem;
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;
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
  { index: 1, title: "La", icon: undefined },
  { index: 2, title: "La", icon: <Sori /> },
  { index: 3, title: "La", icon: <Diese /> },
  { index: 3, title: "Si", icon: <Bemol /> },
  { index: 4, title: "Si", icon: <Koron /> },
  { index: 5, title: "Si", icon: undefined },
  { index: 5, title: "Do", icon: <Bemol /> },
  { index: 6, title: "Si", icon: <Sori /> },
  { index: 6, title: "Do", icon: <Koron /> },
  { index: 7, title: "Do", icon: undefined },
  { index: 7, title: "Si", icon: <Diese /> },
  { index: 8, title: "Do", icon: <Sori /> },
  { index: 9, title: "Do", icon: <Diese /> },
  { index: 9, title: "Re", icon: <Bemol /> },
  { index: 10, title: "Re", icon: <Koron /> },
  { index: 11, title: "Re", icon: undefined },
  { index: 12, title: "Re", icon: <Sori /> },
  { index: 13, title: "Re", icon: <Diese /> },
  { index: 13, title: "Mi", icon: <Bemol /> },
  { index: 14, title: "Mi", icon: <Koron /> },
  { index: 15, title: "Mi", icon: undefined },
  { index: 15, title: "Fa", icon: <Bemol /> },
  { index: 16, title: "Mi", icon: <Sori /> },
  { index: 16, title: "Fa", icon: <Koron /> },
  { index: 17, title: "FA", icon: undefined },
  { index: 17, title: "Mi", icon: <Diese /> },
  { index: 18, title: "FA", icon: <Sori /> },
  { index: 19, title: "FA", icon: <Diese /> },
  { index: 20, title: "Sol", icon: <Koron /> },
  { index: 21, title: "Sol", icon: undefined },
  { index: 22, title: "Sol", icon: <Sori /> },
  { index: 23, title: "Sol", icon: <Diese /> },
  { index: 23, title: "La", icon: <Bemol /> },
  { index: 24, title: "La", icon: <Koron /> },
];

export default function App() {
  const [start, setStart] = useState(false);
  const [pitch, setPitch] = useState<number | undefined>(undefined);
  const { startAnalyser, ctx, analyser } = useAnalyser();
  useInterval(
    () => {
      if (analyser && ctx) {
        setStart(true);
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
      {!start && (
        <button
          className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button"
          onClick={startAnalyser}
        >
          start
        </button>
      )}
      {pitch && <div style={{ fontSize: "2rem" }}>{pitch.toFixed(2)} Hz</div>}
      {pitch && (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <div css={noteAroundAroundStyle}>
            {notes
              .filter((note) => note.index === getIndex(noteIndex!, -2))
              .map((note, index) => (
                <>
                  {index !== 0 && <div css={sepratorStyle}></div>}
                  <span>
                    {note.title}
                    {note.icon}
                    <sub>
                      {4 +
                        Math.floor(
                          Math.log2(pitch / (440 * Math.pow(2, -9 / 12)))
                        )}
                    </sub>
                  </span>
                </>
              ))}
          </div>
          <div css={noteAroundStyle}>
            {notes
              .filter((note) => note.index === getIndex(noteIndex!, -1))
              .map((note, index) => (
                <>
                  {index !== 0 && <div css={sepratorStyle}></div>}
                  <span>
                    {note.title}
                    {note.icon}
                    <sub>
                      {4 +
                        Math.floor(
                          Math.log2(pitch / (440 * Math.pow(2, -9 / 12)))
                        )}
                    </sub>
                  </span>
                </>
              ))}
          </div>
          <div
            css={css`
              ${noteBaseStyle};
              border: 1px solid ${centColor(Math.abs(cent!))};
              background-color: ${centColor(Math.abs(cent!))}55;
            `}
          >
            {notes
              .filter((note) => note.index === noteIndex)
              .map((note, index) => (
                <>
                  {index !== 0 && <span css={sepratorStyle}></span>}
                  <span>
                    {note.title}
                    {note.icon}
                    <sub>
                      {4 +
                        Math.floor(
                          Math.log2(pitch / (440 * Math.pow(2, -9 / 12)))
                        )}
                    </sub>
                  </span>
                </>
              ))}
          </div>
          <div css={noteAroundStyle}>
            {notes
              .filter((note) => note.index === getIndex(noteIndex!, 1))
              .map((note, index) => (
                <>
                  {index !== 0 && <div css={sepratorStyle}></div>}
                  <span>
                    {note.title}
                    {note.icon}
                    <sub>
                      {4 +
                        Math.floor(
                          Math.log2(pitch / (440 * Math.pow(2, -9 / 12)))
                        )}
                    </sub>
                  </span>
                </>
              ))}
          </div>
          <div css={noteAroundAroundStyle}>
            {notes
              .filter((note) => note.index === getIndex(noteIndex!, 2))
              .map((note, index) => (
                <>
                  {index !== 0 && <div css={sepratorStyle}></div>}
                  <span>
                    {note.title}
                    {note.icon}
                    <sub>
                      {4 +
                        Math.floor(
                          Math.log2(pitch / (440 * Math.pow(2, -9 / 12)))
                        )}
                    </sub>
                  </span>
                </>
              ))}
          </div>
        </div>
      )}
      {pitch && (
        <div
          css={css`
            height: 25rem;
            width: 25rem;
            margin-top: 2rem;
            @media (min-width: 768px) {
              height: 30rem;
              width: 30rem;
            }
          `}
        >
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
                matchColorWithArc: true,
              },
              tickLabels: {
                type: "outer",
                defaultTickValueConfig: {
                  formatTextValue: (value: unknown) => value + "¢",
                  style: { fontSize: 10, fill: "black" },
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
