import { TimelineScrubber } from '@/component/Slider';
import { useState } from 'react';
import styles from './Sandbox.module.css';


const SandboxPage = () => {


    const [time, setTime] = useState(0)

    return (
        <main className={styles.sandbox_page}>
            <section className={styles.section}>
                <div>{(time).toFixed(1)} seconds</div>
                <TimelineScrubber value={20} iv={{ start: 20, end: 400 }} transform={{ forward: t => t * 10, inverse: d => d / 10 }} onChange={setTime} onChangeCommit={() => { }} />
            </section>
        </main>
    )
}

export { SandboxPage };

