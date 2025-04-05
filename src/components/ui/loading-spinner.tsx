import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className,
    ...props
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };

    return (
        <div
            className={cn(
                "animate-spin rounded-full border-solid border-blue-500 border-t-transparent",
                sizeClasses[size],
                className
            )}
            {...props}
        />
    );
};

export default LoadingSpinner; 