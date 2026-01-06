import React from 'react';
import clsx from 'clsx';
import './UI.css';

export const Input = ({ label, id, error, className, ...props }) => {
    return (
        <div className='input-group'>
            {label && <label htmlFor={id} className='label'>{label}</label>}
            <input
                id={id}
                className={clsx('input', className)}
                {...props}
            />
            {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{error}</span>}
        </div>
    );
};

export const Select = ({ label, id, options, error, className, ...props }) => {
    return (
        <div className='input-group'>
            {label && <label htmlFor={id} className='label'>{label}</label>}
            <select
                id={id}
                className={clsx('input', 'select', className)}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{error}</span>}
        </div>
    );
};
