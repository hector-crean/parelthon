import { Interval } from "@/models/interval";

import { motion, scroll, useMotionValue, useSpring } from "framer-motion";


import { ReactNode, useEffect, useRef } from "react";
import styles from './ScrollTimeline.module.css';

/**
 */



interface ScrollTimelineProps<T extends { iv: Interval }> {
    sections: Array<T>,
    renderSection: (props: T) => ReactNode,
    onScroll: (progress: number) => void;
    onSelectSection: (section: T) => void;
    progress: number;
}

function ScrollTimeline<T extends { iv: Interval }>({ progress, sections, renderSection, onScroll, onSelectSection }: ScrollTimelineProps<T>) {

    const containerRef = useRef<HTMLDivElement>(null);

    const scrollYProgress = useMotionValue(progress)


    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });


    useEffect(() => {
        if (!containerRef.current) return;


        const cancel = scroll(onScroll, { source: containerRef.current, axis: 'y' })

        return () => cancel()
    }, [])




    return (
        <div id='scroller-container' className={styles.scroll_container} ref={containerRef}>

            <div className={styles.sections} >
                <motion.div className={styles.progress_bar} style={{ scaleX }} />
                {sections.map((section, i) => (
                    <section
                        key={`${i}-${section.iv.start}-${section.iv.end}`}
                        id={''}
                        className={styles.section_item}

                        onClick={(e) => {
                            onSelectSection(section)
                        }}
                    >
                        {renderSection(section)}
                    </section>
                )
                )}
            </div>
        </div>
    )
}

export { ScrollTimeline };
