import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, error, className, ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
            <input
                className={twMerge(
                    'w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
        </div>
    );
};

export default Input;
