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
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-semibold text-center leading-tight flex items-center justify-center gap-3 flex-wrap">
                <span className="text-gray-900">Free yourself from your</span>
                <div className="relative inline-block w-[320px] h-[70px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={index}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{
                                y: { type: "spring", stiffness: 300, damping: 25 },
                                opacity: { duration: 0.4 }
                            }}
                            className="absolute left-0 right-0 text-center inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 [text-shadow:0_4px_12px_rgba(251,146,60,0.3)]"
                            style={{
                                WebkitBackgroundClip: 'text',
                                backgroundSize: '200% auto',
                                animation: 'shine 3s linear infinite'
                            }}
                        >
                            {phrases[index]}
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