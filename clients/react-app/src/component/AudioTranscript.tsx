import { useEffect, useRef } from "react";

const Transcript: React.FC<Props> = ({ transcript }) => {
    const playerRef = useRef<HTMLAudioElement>(null);
    const wordsRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const onTimeUpdate = () => {
            const activeWordIndex = transcript.words.findIndex((word) => {
                return word.startTime > playerRef.current.currentTime;
            });
            const wordElement = wordsRef.current.childNodes[activeWordIndex];
            wordElement.classList.add('active-word');
        };
        playerRef.current.addEventListener("timeupdate", onTimeUpdate);
        return () => playerRef.current.removeEventListener(
            "timeupdate",
            onTimeUpdate
        );
    }, []);

    return (
        <div>
            <span ref={wordsRef}>
                {transcript.words.map((word, i) => <span key={i}>{word}</span>)}
            </span>
            <audio controls src={audioSrc} ref={playerRef} />
        </div>
    );
};