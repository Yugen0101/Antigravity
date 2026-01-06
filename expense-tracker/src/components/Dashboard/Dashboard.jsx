import React, { useMemo } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import SummaryCard from './SummaryCard';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Plus } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryIcon } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = ({ onAddTransaction }) => {
    const { transactions } = useExpenses();

    const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
        let income = 0;
        let expense = 0;

        transactions.forEach(t => {
            if (t.type === 'income') income += Number(t.amount);
            else expense += Number(t.amount);
        });

        return {
            totalBalance: income - expense,
            totalIncome: income,
            totalExpense: expense
        };
    }, [transactions]);

    // Data for Pie Chart (Category wise expenses)
    const categoryData = useMemo(() => {
        const categories = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
        });
        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [transactions]);

    const COLORS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899', '#EF4444', '#6366F1', '#6B7280'];

    // Recent Transactions (Limit 5)
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's your financial overview.</p>
                </div>
                <Button onClick={onAddTransaction} icon={Plus}>Add Transaction</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <SummaryCard title="Total Balance" amount={totalBalance} />
                <SummaryCard title="Total Income" amount={totalIncome} type="income" />
                <SummaryCard title="Total Expenses" amount={totalExpense} type="expense" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Expense Structure</h3>
                    {categoryData.length > 0 ? (
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                                {categoryData.map((entry, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        {entry.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: 'var(--text-secondary)' }}>
                            No expense data yet
                        </div>
                    )}
                </Card>

                <Card>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Recent Transactions</h3>
                    {recentTransactions.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentTransactions.map(t => (
                                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            backgroundColor: t.type === 'income' ? '#ECFDF5' : '#FEF2F2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: t.type === 'income' ? 'var(--secondary)' : 'var(--danger)',
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem'
                                        }}>
                                            {t.category.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '500' }}>{t.category}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatDate(t.createdAt)}</p>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontWeight: '600',
                                        color: t.type === 'income' ? 'var(--secondary)' : 'var(--danger)'
                                    }}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: 'var(--text-secondary)' }}>
                            No transactions yet
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
