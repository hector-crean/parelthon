import { ResizeContainer } from "@/component/ResizeContainer";
import useAnimationFrame from "@/hooks/useAnimationFrame";
import { AnalyserNode } from "@/utils/audioContext";
import React, { useCallback, useRef } from "react";

enum FftDomain {
  Frequency = "frequency",
  TimeDomain = "time",
}


interface OwnProps {
  node: AnalyserNode;
  paused: boolean;
  type: FftDomain;
  fillColor: string;
}

type Props = OwnProps & React.ComponentProps<"canvas">;

function drawTimeDomainData(context: CanvasRenderingContext2D, data: Uint8Array, strokeColor: string) {
  let x = 0;
  const height = context.canvas.height;
  const width = context.canvas.width;
  const bufferLength = data.length;
  const sliceWidth = width / bufferLength;

  // context.fillStyle = "#001400";
  // context.fillRect(0, 0, width, 256);
  context.clearRect(0, 0, width, height)

  context.lineWidth = 2;
  context.strokeStyle = strokeColor;
  context.beginPath();
  context.moveTo(x, height - ((data[0] / 128.0) * height) / 2);
  for (let i = 1; i < bufferLength; i++) {
    const y = ((data[i] / 128.0) * height) / 2;
    context.lineTo(x, height - y);
    x += sliceWidth;
  }
  context.stroke();
}

function drawFrequencyData(context: CanvasRenderingContext2D, data: Uint8Array, fillColor: string) {
  let x = 0;
  const height = context.canvas.height;
  const width = context.canvas.width;
  const bufferLength = data.length;
  const barWidth = width / bufferLength;

  // context.fillStyle = "#001400";
  // context.fillRect(0, 0, width, height);
  context.clearRect(0, 0, width, height);


  context.fillStyle = fillColor;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = height * (data[i] / 255.0);
    const y = height - barHeight;
    context.fillRect(x, y, barWidth, barHeight);
    x += barWidth;
  }
}

function renderVisualiser({ node, paused, type, fillColor, ...canvasProps }: Props) {
  const audioData = useRef(new Uint8Array(node.frequencyBinCount));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    if (type === FftDomain.TimeDomain) {
      drawTimeDomainData(context, audioData.current, fillColor);
    } else if (type === FftDomain.Frequency) {
      drawFrequencyData(context, audioData.current, fillColor);
    }
  }, [type]);

  const getData = useCallback(() => {
    const bufferLength = node.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    if (type === FftDomain.TimeDomain) {
      node.getByteTimeDomainData(dataArray);
    } else if (type === FftDomain.Frequency) {
      node.getByteFrequencyData(dataArray);
    }
    audioData.current = dataArray;
  }, [node, type]);

  const tick = useCallback(() => {
    if (!paused) {
      getData();
      draw();
    }
  }, [draw, getData, paused]);

  useAnimationFrame(tick);

  return (
    <ResizeContainer
      as="div"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '100%'
      }}
    >
      {({ width, height }) => (<canvas ref={canvasRef} style={{ display: "block", width: `${width}px`, height: `${height}px` }} {...canvasProps} />
      )}
    </ResizeContainer>


  );
}

const Visualiser = React.memo(renderVisualiser);

export { FftDomain, Visualiser };

