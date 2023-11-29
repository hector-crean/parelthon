/**
 * State:
 * - Chapter
 *      - timestamp
 *      - active label
 *      - 
 */



import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';



interface Chapter {
    videoUrl: string;
    hotspots: any[],
    audioClips: any[]
}

interface SequenceState {
    activeChapterId: string,
    chapters: Array<Chapter>,
    changeChapter: (chapterId: string) => void;
    nextChapter: () => void;
    prevChapter: () => void;
}

const useSequenceStore = create<SequenceState>()(
    devtools(
        persist(
            (set) => ({
                activeChapterId: '',
                chapters: [],
                changeChapter: (chapterId) => {



                    set((state) => ({ ...state, chapterId: chapterId }))
                },
                nextChapter: () => { },
                prevChapter: () => { }
            }),
            {
                name: 'bear-storage',
            },
        ),
    ),
)






export { useSequenceStore };

