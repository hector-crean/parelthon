import { Howler } from "howler";

export const unlockAudioContext = () => {
    return new Promise((resolve) => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        const buffer = context.createBuffer(1, 1, 22050);
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);

        // play the file. noteOn is the older version of start()
        source.start ? source.start(0) : source.noteOn(0);

        // by checking the play state after some time, we know if we're really unlocked
        setTimeout(function () {
            if (
                source.playbackState === source.PLAYING_STATE ||
                source.playbackState === source.FINISHED_STATE
            ) {
                resolve(true);
            }
        }, 0);
    });
};

export const isAudioLocked = () => {
    return new Promise((resolve) => {
        const checkHTML5Audio = async () => {
            const audio = new Audio();
            try {
                audio.play();
                resolve(false);
            } catch (err) {
                resolve(true);
            }
        };
        try {
            const context = Howler.ctx;
            resolve(context.state === "suspended");
        } catch (e) {
            checkHTML5Audio();
        }
    });
};
