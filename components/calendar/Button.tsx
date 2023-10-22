import React, { ReactNode } from 'react';

interface ButtonProps {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    variant?: 'default' | 'outline';
    children: ReactNode;
}

function Button({ onClick, disabled = false, className = '', variant = 'default', children }: ButtonProps) {
    const buttonClasses = `py-2 px-4 rounded ${className} ${
        variant === 'outline' ? 'border border-black' : 'bg-blue-600 hover:bg-blue-700 text-white'
    }`;
    

    return (
        <button onClick={onClick} disabled={disabled} className={buttonClasses}>
            {children}
        </button>
    );
}

export default Button;
