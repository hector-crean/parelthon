
import { motion } from "framer-motion";
import { ComponentProps } from "react";
import styles from './Badge.module.css';

import ribosome_img from '@/assets/images/ribosome.jpeg';


const badge = {
    active: {
        scale: [1, 1.2, 1.2, 1, 1],
        rotate: [0, 0, 180, 180, 0],
        borderRadius: ["100%", "50%", "0%", "50%", "100%"]
    },
    inactive: {
        scale: 1,
        rotate: 0,
        borderRadius: "100%",
    }
};

const transition = {
    duration: 2,
    ease: "easeInOut",
    times: [0, 0.2, 0.5, 0.8, 1],
}



interface BadgeProps extends ComponentProps<'div'> {

}



const Badge = (props: BadgeProps) => {


    return (<div className={styles.box_wrapper} {...props}>
        <motion.div
            className={styles.box}
            variants={badge}
            whileHover={'active'}
            initial={'inactive'}
            transition={transition}
        >
            <img src={ribosome_img} className={styles.hero_img} />
        </motion.div>
    </div>)
}

export { Badge };

