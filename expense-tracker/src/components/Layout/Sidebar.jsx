import React from 'react';
import { LayoutDashboard, Receipt, PieChart, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import styles from './Layout.module.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { signOut, user } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'transactions', label: 'Transactions', icon: Receipt },
        { id: 'analytics', label: 'Analytics', icon: PieChart },
    ];

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <Wallet color="white" size={24} />
                </div>
                <span className={styles.logoText}>FinTrack</span>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={clsx(styles.navItem, activeTab === item.id && styles.active)}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className={styles.userSection}>
                <div className={styles.userInfo}>
                    <span className={styles.userEmail}>{user?.email}</span>
                </div>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
