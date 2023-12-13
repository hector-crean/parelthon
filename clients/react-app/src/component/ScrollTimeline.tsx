import {
  AnimatePresence,
  motion,
  scroll,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";

import {
  ForwardedRef,
  ReactNode,
  RefObject,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import styles from "./ScrollTimeline.module.css";

/**
 */

interface ScrollTimelineProps<T> {
  sections: Array<T>;
  renderSection: (props: T) => ReactNode;
  onScroll: (progress: number) => void;
  onSelectSection: (section: T) => void;
  progress: number;
}

function ScrollTimeline<T>({
  progress,
  sections,
  renderSection,
  onScroll,
  onSelectSection,
}: ScrollTimelineProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollYProgress = useMotionValue(progress);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const cancel = scroll(onScroll, {
      source: containerRef.current,
      axis: "y",
    });

    return () => cancel();
  }, []);

  return (
    <div
      id="scroller-container"
      className={styles.scroll_container}
      ref={containerRef}
    >
      <div className={styles.sections}>
        <motion.div className={styles.progress_bar} style={{ scaleX }} />
        {sections.map((section, i) => (
          <Section
            key={`section-${i}`}
            ref={containerRef}
            onSelectSection={onSelectSection}
            renderSection={renderSection}
            section={section}
          />
        ))}
      </div>
    </div>
  );
}

interface SectionProps<T> {
  section: T;
  renderSection: (props: T) => ReactNode;
  onSelectSection: (section: T) => void;
}

function SectionInner<T>(
  props: SectionProps<T>,
  scrollContainerRef: ForwardedRef<HTMLDivElement>
) {
  const { onSelectSection, renderSection, section } = props;

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    root: scrollContainerRef as RefObject<HTMLDivElement>,
  });

  return (
    <section
      className={styles.section_item}
      onClick={() => {
        onSelectSection(section);
      }}
      ref={sectionRef}
    >
      <AnimatePresence>
        {isInView && (
          <motion.div
            style={{ width: "100%", height: "100%" }}
            initial={{ transform: "translateX(-100%)" }}
            animate={{ transform: "translateX(0%)" }}
            exit={{ transform: "translateX(-100%)" }}
            transition={{
              type: "spring",
              damping: 10,
              stiffness: 100,
            }}
          >
            {renderSection(section)}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const Section = forwardRef(SectionInner<any>);

export { ScrollTimeline };

// function Section<T extends { iv: Interval }>({
//   onSelectSection,
//   renderSection,
//   section,
// }: SectionProps<T>) {
//   const ref = useRef<HTMLDivElement>(null);
//   const isInView = useInView(ref, { once: true });

//   return (
//     <section
//       className={styles.section_item}
//       onClick={(e) => {
//         onSelectSection(section);
//       }}
//       ref={ref}
//     >
//       <AnimatePresence>
//         {isInView && (
//           <motion.div
//             style={{ width: "100%", height: "100%" }}
//             initial={{ transform: "translateX(-100%)" }}
//             animate={{ transform: "translateX(0%)" }}
//             exit={{ transform: "translateX(-100%)" }}
//             transition={{
//               type: "spring",
//               damping: 10,
//               stiffness: 100,
//             }}
//           >
//             {renderSection(section)}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// }
