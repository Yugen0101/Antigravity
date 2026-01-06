import React from 'react';
import { Card } from '../UI/Card';
import { formatCurrency } from '../../utils/format';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const SummaryCard = ({ title, amount, type }) => {
    let Icon = Wallet;
    let color = 'var(--primary)';
    let bgColor = '#EEF2FF';

    if (type === 'income') {
        Icon = ArrowUpRight;
        color = 'var(--secondary)';
        bgColor = '#ECFDF5';
    } else if (type === 'expense') {
        Icon = ArrowDownRight;
        color = 'var(--danger)';
        bgColor = '#FEF2F2';
    }

    return (
        <Card className="summary-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                padding: '1rem',
                borderRadius: '50%',
                backgroundColor: bgColor,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={24} />
            </div>
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>{formatCurrency(amount)}</h2>
            </div>
        </Card>
    );
};

export default SummaryCard;
