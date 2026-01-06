import React from 'react';
import clsx from 'clsx';
import './UI.css';

export const Button = ({
    children,
    variant = 'primary',
    className,
    icon: Icon,
    ...props
}) => {
    return (
        <button
            className={clsx('btn', `btn-${variant}`, className)}
            {...props}
        >
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
};
