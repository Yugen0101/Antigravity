import { format } from 'date-fns';

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM dd, yyyy');
};

export const getCategoryIcon = (category) => {
    // This can be expanded or moved to a component if it returns JSX
    // For now returning simple string or we can handle it in the component
    return category;
};

export const CATEGORIES = [
    { id: 'food', label: 'Food & Dining', color: '#F59E0B' },
    { id: 'transport', label: 'Transportation', color: '#3B82F6' },
    { id: 'housing', label: 'Housing', color: '#8B5CF6' },
    { id: 'utilities', label: 'Utilities', color: '#10B981' },
    { id: 'shopping', label: 'Shopping', color: '#EC4899' },
    { id: 'healthcare', label: 'Healthcare', color: '#EF4444' },
    { id: 'entertainment', label: 'Entertainment', color: '#6366F1' },
    { id: 'income', label: 'Income', color: '#10B981' }, // Special category for income
    { id: 'other', label: 'Others', color: '#6B7280' },
];
