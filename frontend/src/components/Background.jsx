import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Background.css';

const Background = () => {
    const waveVariants = {
        animate: {
            x: [0, 100, 0],
            transition: {
                repeat: Infinity,
                duration: 10,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Subtle animated wave */}
            <motion.div className="wave" variants={waveVariants} animate="animate" />
            
            {/* Floating particles */}
            <motion.div className="particle particle-1" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }} />
            <motion.div className="particle particle-2" animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }} />
            <motion.div className="particle particle-3" animate={{ y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }} />
        </div>
    );
};

export default Background;