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
                                className="relative inline-flex items-center px-6 py-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 0.15,
                                    ease: "easeOut"
                                }}
                            >
                                <div className="absolute inset-0 bg-blue-100/60 rounded-[24px]" />
                                <span className="relative text-gray-800 font-semibold">
                                    {phrases[index]}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </h1>

        </div>
    );
}