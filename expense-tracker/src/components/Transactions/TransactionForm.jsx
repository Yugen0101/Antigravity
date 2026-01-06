import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Button } from '../UI/Button';
import { Input, Select } from '../UI/Input';
import { CATEGORIES } from '../../utils/format';
import { Check, X } from 'lucide-react';

const TransactionForm = ({ onClose }) => {
    const { addTransaction } = useExpenses();
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = "Please enter a valid amount";
        if (!formData.date) newErrors.date = "Date is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        addTransaction(formData);
        onClose();
    };

    const typeOptions = [
        { value: 'expense', label: 'Expense' },
        { value: 'income', label: 'Income' }
    ];

    // Filter categories based on type
    const categoryOptions = CATEGORIES
        .filter(c => formData.type === 'income' ? c.id === 'income' : c.id !== 'income')
        .map(c => ({ value: c.id, label: c.label }));

    // Auto-switch category if switching type
    React.useEffect(() => {
        if (formData.type === 'income') {
            setFormData(prev => ({ ...prev, category: 'income' }));
        } else if (formData.category === 'income') {
            setFormData(prev => ({ ...prev, category: 'food' }));
        }
    }, [formData.type]);

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: 'expense' }))}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        backgroundColor: formData.type === 'expense' ? '#FEF2F2' : '#F3F4F6',
                        color: formData.type === 'expense' ? 'var(--danger)' : 'var(--text-secondary)',
                        fontWeight: '600',
                        border: formData.type === 'expense' ? '1px solid #FECACA' : '1px solid transparent'
                    }}
                >
                    Expense
                </button>
                <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: 'income' }))}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        backgroundColor: formData.type === 'income' ? '#ECFDF5' : '#F3F4F6',
                        color: formData.type === 'income' ? 'var(--secondary)' : 'var(--text-secondary)',
                        fontWeight: '600',
                        border: formData.type === 'income' ? '1px solid #A7F3D0' : '1px solid transparent'
                    }}
                >
                    Income
                </button>
            </div>

            <Input
                id="amount"
                type="number"
                label="Amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                error={errors.amount}
                autoFocus
            />

            <Select
                id="category"
                label="Category"
                options={categoryOptions}
                value={formData.category}
                onChange={handleChange}
            />

            <Input
                id="date"
                type="date"
                label="Date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
            />

            <Input
                id="note"
                label="Note (Optional)"
                placeholder="E.g. Lunch with friends"
                value={formData.note}
                onChange={handleChange}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Add Transaction</Button>
            </div>
        </form>
    );
};

export default TransactionForm;
