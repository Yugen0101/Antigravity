import React from 'react';
import clsx from 'clsx';
import './UI.css';

export const Card = ({ children, className, ...props }) => {
    return (
        <div className={clsx('card', className)} {...props}>
            {children}
        </div>
    );
};
