import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';





interface LabelsGroups {
    items: Array<{ id: string, subtitle: string, title: string, items: string }>
}

const LabelsGroups = ({ items }: LabelsGroups) => {

    const [selectedId, setSelectedId] = useState<string | null>(null)

    return (
        <>
            {items.map(item => (
                <>
                    <motion.div layoutId={item.id} onClick={() => setSelectedId(item.id)}>
                        <motion.h5>{item.subtitle}</motion.h5>
                        <motion.h2>{item.title}</motion.h2>
                    </motion.div>
                    <AnimatePresence>
                        {selectedId && (
                            <motion.div layoutId={selectedId}>
                                <motion.h5>{item.subtitle}</motion.h5>
                                <motion.h2>{item.title}</motion.h2>
                                <motion.button onClick={() => setSelectedId(null)} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            ))}
        </>
    )


}