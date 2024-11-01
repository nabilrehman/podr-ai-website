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
                    <span className="text-gray-900">Free yourself from your</span>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            className="relative ml-3 inline-block bg-white/50 backdrop-blur-sm rounded-lg px-4 py-1.5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                duration: 0.2,
                                ease: "easeOut"
                            }}
                        >
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 font-bold"
                                style={{
                                    WebkitBackgroundClip: 'text'
                                }}
                            >
                                {phrases[index]}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </h1>
            <style jsx global>{`
                @keyframes shine {
                    0% {
                        background-position: 0% center;
                        filter: brightness(1);
                    }
                    50% {
                        background-position: 100% center;
                        filter: brightness(1.2);
                    }
                    100% {
                        background-position: 200% center;
                        filter: brightness(1);
                    }
                }
            `}</style>
        </div>
    );
}