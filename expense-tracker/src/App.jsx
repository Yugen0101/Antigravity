import React, { useState } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import { useAuth } from './context/AuthContext';
import Auth from './components/Auth/Auth';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionList from './components/Transactions/TransactionList';
import Analytics from './components/Dashboard/Analytics';
import Modal from './components/UI/Modal';
import TransactionForm from './components/Transactions/TransactionForm';

function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onAddTransaction={() => setIsModalOpen(true)} />;
      case 'transactions':
        return <TransactionList />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard onAddTransaction={() => setIsModalOpen(true)} />;
    }
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <ExpenseProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Transaction"
      >
        <TransactionForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </ExpenseProvider>
  );
}

export default App;
