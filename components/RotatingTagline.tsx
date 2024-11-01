'use client';

import { useEffect, useState } from 'react';

const phrases = [
    "your limitations...",
    "your fears...",
    "your doubts..."
];

export default function RotatingTagline() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
                setIsAnimating(true);
            }, 200);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            <span>Free yourself from </span>
            <span
                className={`inline-block min-w-[150px] transition-opacity duration-500 ${
                    isAnimating ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'
                }`}
            >
                {phrases[currentIndex]}
            </span>
        </h1>
    );
}