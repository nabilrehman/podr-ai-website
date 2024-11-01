'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
    "your limitations...",
    "your fears...",
    "your doubts..."
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
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-center leading-tight flex items-center justify-center gap-3 flex-nowrap whitespace-nowrap">
                <span className="text-gray-800">Free yourself from</span>
                <div className="relative inline-block w-[280px] h-[70px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={index}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{
                                y: { type: "spring", stiffness: 200, damping: 20 },
                                opacity: { duration: 0.3 }
                            }}
                            className="absolute left-0 inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 [text-shadow:0_4px_8px_rgba(251,146,60,0.2)]"
                            style={{
                                WebkitBackgroundClip: 'text',
                                backgroundSize: '200% auto',
                                animation: 'shine 2s linear infinite'
                            }}
                        >
                            {phrases[index]}
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                    delay: 0.1
                                }}
                                className="absolute -right-2 -top-1 w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 opacity-80 blur-[2px]"
                            />
                        </motion.span>
                    </AnimatePresence>
                </div>
            </h1>
            <style jsx global>{`
                @keyframes shine {
                    to {
                        background-position: 200% center;
                    }
                }
            `}</style>
        </div>
    );
}