import React, { useMemo } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Card } from '../UI/Card';
import { formatCurrency } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO, startOfMonth } from 'date-fns';

const Analytics = () => {
    const { transactions } = useExpenses();

    const monthlyData = useMemo(() => {
        const months = {};
        transactions.forEach(t => {
            if (t.type === 'expense') {
                const date = parseISO(t.date || t.createdAt);
                const monthKey = format(startOfMonth(date), 'MMM yyyy');
                months[monthKey] = (months[monthKey] || 0) + Number(t.amount);
            }
        });

        return Object.entries(months)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => new Date(a.name) - new Date(b.name)); // Rough sort, might need better logic if spanning years
    }, [transactions]);

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Analytics</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Deep dive into your spending habits.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
                <Card>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Monthly Spending</h3>
                    {monthlyData.length > 0 ? (
                        <div style={{ height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value)}
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'var(--text-secondary)' }}>
                            No data available for monthly comparison.
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
