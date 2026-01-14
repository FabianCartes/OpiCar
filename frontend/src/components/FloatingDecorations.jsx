import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Settings, MessageCircle } from 'lucide-react';

const FloatingDecorations = () => {
    const { scrollY } = useScroll();

    // Adjusted for the second section (approx 800px-1800px scroll range)
    // Element 1 (Left - Mechanic)
    const y1 = useTransform(scrollY, [500, 1500], [100, -100]);
    const rotate1 = useTransform(scrollY, [500, 1500], [0, 90]);

    // Element 2 (Right - Opinion)
    const y2 = useTransform(scrollY, [500, 1500], [100, -200]);
    const rotate2 = useTransform(scrollY, [500, 1500], [0, -45]);

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {/* Mechanic Gear - Left (Huge and cut off) */}
            <motion.div
                style={{ y: y1, rotate: rotate1 }}
                className="absolute -left-40 top-20 opacity-[0.03] dark:opacity-[0.05] text-slate-900 dark:text-white"
            >
                <Settings size={600} strokeWidth={0.5} />
            </motion.div>

            {/* Opinion Bubble - Right (Huge and cut off) */}
            <motion.div
                style={{ y: y2, rotate: rotate2 }}
                className="absolute -right-40 top-40 opacity-[0.03] dark:opacity-[0.05] text-slate-900 dark:text-white"
            >
                <div className="relative">
                    <MessageCircle size={550} strokeWidth={0.5} />
                    {/* Typing Dots */}
                    <div className="absolute inset-0 flex items-center justify-center gap-6 pl-4 pb-6">
                        <div className="w-12 h-12 bg-current rounded-full"></div>
                        <div className="w-12 h-12 bg-current rounded-full"></div>
                        <div className="w-12 h-12 bg-current rounded-full"></div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FloatingDecorations;
