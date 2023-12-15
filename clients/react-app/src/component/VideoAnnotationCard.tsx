


import { Badge } from "@/component/Badge";
import { VideoAnnotation } from "@/models/annotation";
import { motion } from 'framer-motion';
import { Geometry } from "geojson";
import styles from './VideoAnnotationCard.module.css';


interface VideoAnnotationCardProps {
    annotation?: VideoAnnotation<Geometry>,

}


const thread = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
        }
    }
}

const card = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};


const VideoAnnotationCard = ({ }: VideoAnnotationCardProps) => {

    return (<motion.div
        className={styles.thread}
        variants={thread}
        initial="hidden"
        animate="visible"
    >
        <motion.div className={styles.card} data-fullbleed='true' variants={card}>
            <div className={styles.card_header}>
                <span>Section 1</span>
            </div>
            <div className={styles.card_main}>
                An overview of the section
            </div>

        </motion.div>

        <div data-gutter='true'></div>
        <motion.div className={styles.card} data-central='true' variants={card}>
            <div className={styles.card_header}>
                <Badge style={{ maxWidth: '50px' }} />
                <span>Card Header</span>
            </div>
            <div className={styles.card_main}>
                This is the content
            </div>
        </motion.div>

        <div data-gutter='true'></div>
        <motion.div className={styles.card} data-central='true' variants={card}>
            <div className={styles.card_header}>
                <Badge style={{ maxWidth: '50px' }} />
                <span>Card Header</span>
            </div>
            <div className={styles.card_main}>
                This is the content
            </div>
        </motion.div>

    </motion.div>)
}


export { VideoAnnotationCard };
