import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import styles from './Layout.module.css';

const Layout = ({ children, activeTab, setActiveTab }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className={styles.layout}>
            {/* Mobile Header */}
            <div className={styles.mobileHeader} style={{ display: 'none' /* Hidden on desktop via CSS */ }}>
                <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            <div className={`${styles.sidebar} ${isMobileOpen ? styles.open : ''}`}>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
