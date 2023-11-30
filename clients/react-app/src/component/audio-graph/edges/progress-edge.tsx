import { ProgressionEdge } from "@/models/flow-graph/edges";
import { curveBumpX, link } from 'd3-shape';
import { motion } from "framer-motion";
import { EdgeProps } from "reactflow";

const linkGenerator = link(curveBumpX)

const draw = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: (i: number) => {
    const delay = 1 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      strokeDasharray: ['1, 150', '90, 150', '90, 150'],
      transition: {
        pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
        strokeDasharray: { delay, duration: 0.01 },
      }
    };
  }
};




interface Props extends EdgeProps<ProgressionEdge["data"]> { }

function ProgressEdgeView({ sourceX, sourceY, targetX, targetY, data }: Props) {
  return (
    <>
      <motion.path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        d={linkGenerator({ source: [sourceX, sourceY], target: [targetX, targetY] })!}
        initial="hidden"
        animate="visible"
        variants={draw}
        custom={1}
        strokeDasharray="1 2 3"
      />

    </>
  );
}

export { ProgressEdgeView };
