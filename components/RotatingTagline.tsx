'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
    "mind...",
    "thoughts",
    "limitations",
    "fears...",
    "SELF"
];

export default function RotatingTagline() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
        }, 1500);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative py-8">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-50" />
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-semibold text-center leading-tight">
                <div className="inline-flex items-center justify-center whitespace-nowrap">
                    <span className="text-gray-900 static">Free yourself from your</span>
                    <div className="relative ml-3 inline-block">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                className="relative inline-block"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 0.15,
                                    ease: "easeOut"
                                }}
                            >
                                <span className="relative z-10 text-gray-800 font-semibold">
                                    {phrases[index]}
                                </span>
                                <div
                                    className="absolute inset-0 -mx-3 -my-1 bg-blue-100/60 rounded-full"
                                    style={{
                                        padding: '0.25rem 1rem',
                                        transform: 'scale(1.1)',
                                        zIndex: 0
                                    }}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </h1>

        </div>
    );
}