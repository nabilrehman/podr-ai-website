'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
    { text: "your limitations", highlight: "limitless" },
    { text: "your fears", highlight: "fearless" },
    { text: "your doubts", highlight: "confident" }
];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
            duration: 0.6,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.4,
            ease: "easeIn"
        }
    }
};

const bubbleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
        scale: 1, 
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15
        }
    }
};

export default function RotatingTagline() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        setIsFirstRender(false);
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <h1 className="relative text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            <span className="font-light">Free yourself from </span>
            <div className="relative inline-flex mt-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        variants={containerVariants}
                        initial={isFirstRender ? "visible" : "hidden"}
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 min-w-[200px]"
                    >
                        <span className="relative">
                            {phrases[currentIndex].text}
                            <motion.span
                                variants={bubbleVariants}
                                className="absolute -top-1 -right-2 w-3 h-3 bg-purple-400 rounded-full opacity-50"
                            />
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </h1>
    );
}