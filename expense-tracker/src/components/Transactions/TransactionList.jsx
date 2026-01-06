import React, { useState, useMemo } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Card } from '../UI/Card';
import { Input, Select } from '../UI/Input';
import { formatCurrency, formatDate } from '../../utils/format';
import { Search, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../UI/Button';

const TransactionList = () => {
    const { transactions, deleteTransaction } = useExpenses();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase()) ||
                (t.note && t.note.toLowerCase().includes(search.toLowerCase()));
            const matchesType = filterType === 'all' || t.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [transactions, search, filterType]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Transactions</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your financial history.</p>
                </div>
            </div>

            <Card style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    className="input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Search by category or note..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '150px' }}>
                        <select
                            className="input select"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(t => (
                        <Card key={t.id} style={{
                            padding: '1rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    backgroundColor: t.type === 'income' ? '#ECFDF5' : '#FEF2F2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: t.type === 'income' ? 'var(--secondary)' : 'var(--danger)',
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem'
                                }}>
                                    {t.category.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '600', fontSize: '1rem' }}>{t.category}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {formatDate(t.date)} {t.note && `• ${t.note}`}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <span style={{
                                    fontWeight: '700',
                                    fontSize: '1.1rem',
                                    color: t.type === 'income' ? 'var(--secondary)' : 'var(--danger)'
                                }}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                </span>
                                <Button
                                    variant="danger"
                                    style={{ padding: '0.4rem', backgroundColor: '#FEE2E2', color: '#EF4444' }}
                                    onClick={() => deleteTransaction(t.id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        No transactions found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionList;
