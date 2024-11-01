'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
    "your limitations",
    "your fears",
    "your doubts"
];

export default function RotatingTagline() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] py-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center leading-tight">
                <span className="block text-gray-800 mb-2">Free yourself from</span>
                <div className="h-24 relative flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={index}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{
                                y: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 inline-flex items-center"
                        >
                            {phrases[index]}
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                    delay: 0.2
                                }}
                                className="absolute -right-4 -top-2 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-75"
                            />
                        </motion.span>
                    </AnimatePresence>
                </div>
            </h1>
        </div>
    );
}