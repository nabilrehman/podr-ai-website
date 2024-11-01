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
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative py-8">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-50" />
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-semibold text-center leading-tight">
                <div className="inline-flex items-center justify-center whitespace-nowrap">
                    <span className="text-gray-900 mr-3">Free yourself from your</span>
                    <div className="relative inline-flex items-center bg-purple-50/30 rounded-xl px-6 py-2 min-w-[200px]">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{
                                    y: { type: "spring", stiffness: 400, damping: 25 },
                                    opacity: { duration: 0.3 }
                                }}
                                className="absolute left-0 right-0 text-center inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 font-bold [text-shadow:0_2px_15px_rgba(251,146,60,0.5)]"
                                style={{
                                    WebkitBackgroundClip: 'text',
                                    backgroundSize: '200% auto',
                                    animation: 'shine 2.5s linear infinite',
                                    filter: 'drop-shadow(0 0 2px rgba(251,146,60,0.3))'
                                }}
                            >
                                {phrases[index]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
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