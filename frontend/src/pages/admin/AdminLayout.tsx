import { Outlet, useNavigate } from 'react-router-dom';
import { Home, PlusSquare, FileText, User } from 'react-feather';
import Navigation from '../../components/Navigation';

export default function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/admin/create', icon: PlusSquare, label: 'Create Ice Cream' },
        { path: '/admin/transactions', icon: FileText, label: 'Transactions' },
        { path: '/admin/profile', icon: User, label: 'Profile' }
    ];

    return (
        <div className="h-screen overflow-hidden bg-zinc-950 flex flex-col md:flex-row">
            <Navigation 
                roleIcon="A"
                roleName="ADMIN"
                items={navItems}
                onLogout={handleLogout}
            />
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}