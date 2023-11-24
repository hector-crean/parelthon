import { ScaleLinear } from "@visx/vendor/d3-scale";
import { curveCatmullRom, line } from "d3";

interface OutlinePathsProps {
  maskGradientPoints: Array<[number, number]>;
  maskPoints: Array<[number, number]>;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
}
const OutlinePath = ({
  maskGradientPoints,
  maskPoints,
  xScale,
  yScale,
}: OutlinePathsProps) => {
  const accessorX = (d: [number, number]) => xScale(d[0]);
  const accessorY = (d: [number, number]) => yScale(d[1]);

  const pathFn = line()
    .x(accessorX)
    .y(accessorY)
    .curve(curveCatmullRom.alpha(0.5));

  return (
    <>
      <radialGradient
        id="gradient"
        cx="0"
        cy="0"
        r="267"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(491.25,402)"
      >
        <stop offset="0" stop-color="white" stop-opacity="0"></stop>
        <stop offset="0.25" stop-color="white" stop-opacity="0.7"></stop>
        <stop offset="0.5" stop-color="white" stop-opacity="0"></stop>
        <stop offset="0.75" stop-color="white" stop-opacity="0.7"></stop>
        <stop offset="1" stop-color="white" stop-opacity="0"></stop>
        <animateTransform
          attributeName="gradientTransform"
          attributeType="XML"
          type="scale"
          from="0"
          to="12"
          dur="1.5s"
          begin=".3s"
          fill="freeze"
          additive="sum"
        ></animateTransform>
      </radialGradient>

      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="2"
          flood-color="#1d85bb"
        ></feDropShadow>
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="4"
          flood-color="#1d85bb"
        ></feDropShadow>
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="6"
          flood-color="#1d85bb"
        ></feDropShadow>
      </filter>

      <clipPath id="clip-path">
        <path d="" />
      </clipPath>

      <path
        id="mask-gradient"
        className="mask-gradient"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-opacity="0"
        fill-opacity="1"
        fill="url(#gradient)"
        d={pathFn(maskGradientPoints) ?? ""}
      ></path>
      <path
        id="mask-path"
        className="mask-path"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-opacity=".8"
        fill-opacity="0"
        stroke="#1d85bb"
        stroke-width="3"
        filter="url(#glow)"
        d={pathFn(maskPoints) ?? ""}
      ></path>
    </>
  );
};

export { OutlinePath };
