/* eslint-disable import/no-webpack-loader-syntax */
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as sac from 'standardized-audio-context';

// import ADSRWorkletProcessor from "worklets/adsr-processor.worklet.ts?url";
// import AndGateWorkletProcessor from "worklets/and-gate-processor.worklet.ts?url";
// import BeatDetectorWorkletProcessor from "worklets/beat-detector-processor.worklet.ts?url";
// import ComparatorWorkletProcessor from "worklets/comparator-processor.worklet.ts?url";
// import GateWorkletProcessor from "worklets/gate-processor.worklet.ts?url";
// import MeterWorkletProcessor from "worklets/meter-processor.worklet.ts?url";
// import NoiseWorkletProcessor from "worklets/noise-processor.worklet.ts?url";
// import NotGateWorkletProcessor from "worklets/not-gate-processor.worklet.ts?url";
// import OrGateWorkletProcessor from "worklets/or-gate-processor.worklet.ts?url";
// import PitchDetectorWorkletProcessor from "worklets/pitch-detector-processor.worklet.ts?url";
// import QuantizerWorkletProcessor from "worklets/quantizer-processor.worklet.ts?url";
// import RectifierWorkletProcessor from "worklets/rectifier-processor.worklet.ts?url";
// import SampleAndHoldWorkletProcessor from "worklets/sample-and-hold-processor.worklet.ts?url";
// import SignWorkletProcessor from "worklets/sign-processor.worklet.ts?url";
// import TransformerWorkletProcessor from "worklets/transformer-processor.worklet.ts?url";
// import XorGateWorkletProcessor from "worklets/xor-gate-processor.worklet.ts?url";



const AudioContextContext = createContext<sac.IAudioContext>(new sac.AudioContext());


interface IAudioContextContextProviderProps {
  children: ReactNode;
}
const AudioContextContextProvider = ({ children }: IAudioContextContextProviderProps) => {

  const [ready, setReady] = useState(false);

  const context = useMemo(() => new sac.AudioContext(), [])



  useEffect(() => {

    const awaitAudioWorkletProcessors = async (context: sac.AudioContext) => {
      if (!context.audioWorklet) {
        return;
      }

      await Promise.all([
        // context.audioWorklet.addModule(ADSRWorkletProcessor),
        // context.audioWorklet.addModule(AndGateWorkletProcessor),
        // context.audioWorklet.addModule(BeatDetectorWorkletProcessor),
        // context.audioWorklet.addModule(ComparatorWorkletProcessor),
        // context.audioWorklet.addModule(GateWorkletProcessor),
        // context.audioWorklet.addModule(MeterWorkletProcessor),
        // context.audioWorklet.addModule(NoiseWorkletProcessor),
        // context.audioWorklet.addModule(NotGateWorkletProcessor),
        // context.audioWorklet.addModule(OrGateWorkletProcessor),
        // context.audioWorklet.addModule(PitchDetectorWorkletProcessor),
        // context.audioWorklet.addModule(QuantizerWorkletProcessor),
        // context.audioWorklet.addModule(RectifierWorkletProcessor),
        // context.audioWorklet.addModule(SampleAndHoldWorkletProcessor),
        // context.audioWorklet.addModule(SignWorkletProcessor),
        // context.audioWorklet.addModule(TransformerWorkletProcessor),
        // context.audioWorklet.addModule(XorGateWorkletProcessor),
      ]);
      setReady(true);
    };

    if (context) {
      awaitAudioWorkletProcessors(context);
    }
  }, [context]);

  const resume = useCallback(() => {

    if (context?.state === "suspended") {
      context.resume();
      console.log('Audio Context Resumed')
    }
  }, [context]);

  if (!context) {
    return (
      <div>Sorry, but the Web Audio API is not supported by your browser.</div>
    );
  }

  if (!ready) {
    // TODO add loader
    return null;
  }

  return (
    <div onClick={resume} >
      <AudioContextContext.Provider value={context}>
        {children}
      </AudioContextContext.Provider>
    </div>
  );
};




export const useAudioContextContext = () => {
  const context = useContext(AudioContextContext);

  if (!context) {
    throw new Error("useAudioContextContext must be used inside the AudioContextContextProvider");
  }

  return context;
};








export { AudioContextContextProvider };
