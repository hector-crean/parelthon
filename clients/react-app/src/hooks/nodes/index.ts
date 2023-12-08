import { useAudioContextContext } from "@/context/Audio";
import { DependencyList, useMemo } from "react";
import * as sac from 'standardized-audio-context';

type NodeFactory<T extends sac.IAudioNode<sac.AudioContext>> = (context: sac.IAudioContext) => T;

const useAudioNode = <T extends sac.IAudioNode<sac.AudioContext>>(
    id: string,
    nodeFactory: NodeFactory<T>,
    dependencies: DependencyList = [] // default value
) => {
    const context = useAudioContextContext();
    const node = useMemo(() => nodeFactory(context), [context, ...dependencies]);
    return node;
};


export { useAudioNode };

