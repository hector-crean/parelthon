import { ComponentProps, useState } from "react";

import { motion } from 'framer-motion';
import styles from './Video.module.css';

type VideoProps = ComponentProps<typeof motion.video>;



const Video = (props: VideoProps) => {

    const [controlsEnabled, setControlsEnabled] = useState(false)


    return (
        <motion.video
            className={styles.video}
            onHoverStart={() => setControlsEnabled(true)}
            onHoverEnd={() => setControlsEnabled(false)}
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, }}
            transition={{ duration: 0.5 }}
            controls={controlsEnabled}
            {...props}
        />
    )
}


export { Video };
