import { useAudioContext } from '@/context/AudioContextContext';
import { DependencyList, useMemo } from "react";
import * as sac from 'standardized-audio-context';

type NodeFactory<T extends sac.IAudioNode<sac.AudioContext>> = (context: sac.IAudioContext) => T;

const useAudioNode = <T extends sac.IAudioNode<sac.AudioContext>>(
    id: string,
    nodeFactory: NodeFactory<T>,
    dependencies?: DependencyList
) => {
    const context = useAudioContext();
    const node = useMemo(() => nodeFactory(context), dependencies);
    return node;
};


export { useAudioNode };
