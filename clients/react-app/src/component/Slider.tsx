
import { AnimatePresence, DragHandlers, motion, useDragControls, useInView, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion';
import { PointerEvent, useEffect, useRef, useState } from 'react';
import styles from './Slider.module.css';



const dragHandleProxyVariants = {
    visible: { backgroundColor: 'white', width: '2px' },
    hidden: { backgroundColor: 'red', width: '0px' },
}




interface Transform {
    forward: (x: number) => number,
    inverse: (y: number) => number
}

interface Interval {
    start: number,
    end: number
}

// 100px per second?
interface TimelineScrubberProps {
    iv: Interval
    transform: Transform,
    value: number,
    onChange: (x: number) => void
    onChangeCommit: (x: number) => void
}

const TimelineScrubber = ({ iv, transform, value, onChange, onChangeCommit }: TimelineScrubberProps) => {

    const scrollRef = useRef<HTMLDivElement>(null)

    const { scrollXProgress } = useScroll({ container: scrollRef });

    const dragHandleRef = useRef<HTMLDivElement>(null)
    const dragContainerRef = useRef<HTMLDivElement>(null)
    const dragControls = useDragControls()

    // const dragHandleProxyX = useMotionValue(0);
    const [dragHandleProxyX, setDragHandleProxyX] = useState(0)


    const [pointerIsOver, setPointerIsOver] = useState(true)
    const [isDragging, setIsDragging] = useState(false)

    const dragHandleInView = useInView(dragHandleRef, { root: scrollRef })

    const progressed = useMotionValue(value);

    useMotionValueEvent(progressed, "change", (latest) => {
        onChange(latest)
    })


    useEffect(() => {
        if (!dragHandleInView) {
            const scrollContainerRect = scrollRef.current?.getBoundingClientRect();
            const dragHandleRect = dragHandleRef.current?.getBoundingClientRect();

            if (scrollContainerRect && dragHandleRect) {

                const scrollContainerWidth = scrollContainerRect.width
                const leftDelta = scrollContainerRect.left - dragHandleRect.left;
                const xScroll = leftDelta > 0 ? -scrollContainerWidth : leftDelta < 0 ? scrollContainerWidth : 0

                scrollRef.current?.scrollBy(xScroll, 0)

            }



        }
    }, [dragHandleInView])


    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {

        const dragContainerRect = dragContainerRef.current?.getBoundingClientRect();
        const dragHandleRect = dragHandleRef.current?.getBoundingClientRect();

        if (dragContainerRect && dragHandleRect) {

            const left = dragHandleRect.left - dragContainerRect.left;

            progressed.set(transform.inverse(left))

        }


        dragControls.start(event, { snapToCursor: true })
    }


    const onPointerOver = (e: PointerEvent<HTMLDivElement>) => {
        setPointerIsOver(true)
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left
        setDragHandleProxyX(x)
    }

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left
        setDragHandleProxyX(x)
    }

    const onDragStart: DragHandlers['onDragStart'] = (event, info) => {
        setIsDragging(true)

        const dragContainerRect = dragContainerRef.current?.getBoundingClientRect();
        const dragHandleRect = dragHandleRef.current?.getBoundingClientRect();

        if (dragContainerRect && dragHandleRect) {

            const left = dragHandleRect.left - dragContainerRect.left;

            progressed.set(transform.inverse(left))

        }
    }

    const onDrag: DragHandlers['onDrag'] = (event, info) => {


        const dragContainerRect = dragContainerRef.current?.getBoundingClientRect();
        const dragHandleRect = dragHandleRef.current?.getBoundingClientRect();

        if (dragContainerRect && dragHandleRect) {

            const left = dragHandleRect.left - dragContainerRect.left;

            progressed.set(transform.inverse(left))

        }

    }

    const onDragEnd: DragHandlers['onDragEnd'] = (event, info) => {
        setIsDragging(false)
        onChangeCommit(progressed.get())
    }



    return (

        <motion.div
            className={styles.scroll_container}
            ref={scrollRef}
        >
            <motion.div
                className={styles.scroll_child}
            >
                <div className={styles.time_marker}>{ }</div>
                <motion.div
                    ref={dragContainerRef}
                    //To support touch screens, the triggering element should have the touch-action: none style applied
                    style={{ touchAction: "none", width: `max(${transform.forward(iv.end - iv.start)}px, 100%)` }}
                    className={styles.drag_area}
                    onPointerEnter={onPointerOver}
                    onPointerOver={onPointerOver}
                    onPointerDown={onPointerDown}
                    onPointerUp={() => setPointerIsOver(false)}
                    onPointerMove={onPointerMove}
                    onPointerCancel={() => setPointerIsOver(false)}
                    onPointerOut={() => setPointerIsOver(false)}
                    onPointerLeave={() => setPointerIsOver(false)}
                >
                    <motion.div
                        ref={dragHandleRef}
                        className={styles.drag_handle}
                        drag="x"
                        dragControls={dragControls}
                        dragConstraints={dragContainerRef}
                        //The degree of movement allowed outside constraints. 0 = no movement, 1 = full movement.
                        dragElastic={0.1}
                        dragMomentum={false}
                        dragTransition={{
                            min: 0,
                            max: 100,
                            bounceStiffness: 100,
                            bounceDamping: 400
                        }}
                        onDragStart={onDragStart}
                        onDrag={onDrag}

                        onDragEnd={onDragEnd}

                    />
                    <AnimatePresence>
                        {pointerIsOver && <motion.div
                            className={styles.drag_handle_proxy}
                            style={{ left: dragHandleProxyX }}
                            animate={!isDragging ? "visible" : "hidden"}
                            variants={dragHandleProxyVariants}

                        />}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.div>


    )
}



export { TimelineScrubber };
