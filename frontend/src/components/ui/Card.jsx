import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, glass = false, hover = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -5 } : {}}
            className={twMerge(
                'rounded-xl p-6 bg-white shadow-sm border border-gray-100',
                glass && 'glass',
                hover && 'hover:shadow-xl transition-shadow duration-300',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
