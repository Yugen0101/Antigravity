import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpenses = () => {
    return useContext(ExpenseContext);
};

export const ExpenseProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        const fetchTransactions = async () => {
            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .order('date', { ascending: false });

                if (error) throw error;
                setTransactions(data || []);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();

        // Subscribe to changes
        const subscription = supabase
            .channel('public:transactions')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'transactions',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setTransactions(prev => [payload.new, ...prev]);
                } else if (payload.eventType === 'DELETE') {
                    setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
                } else if (payload.eventType === 'UPDATE') {
                    setTransactions(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    const addTransaction = async (transaction) => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .insert([{
                    ...transaction,
                    user_id: user.id,
                }])
                .select()
                .single();

            if (error) throw error;
            // State update handled by subscription
            return data;
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    };

    const editTransaction = async (id, updatedTransaction) => {
        try {
            const { error } = await supabase
                .from('transactions')
                .update(updatedTransaction)
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    };

    const value = {
        transactions,
        loading,
        addTransaction,
        deleteTransaction,
        editTransaction,
    };

    return (
        <ExpenseContext.Provider value={value}>
            {children}
        </ExpenseContext.Provider>
    );
};
