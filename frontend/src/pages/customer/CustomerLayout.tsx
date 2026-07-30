import { Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Clock, User } from 'react-feather';
import Navigation from '../../components/Navigation';

export default function CustomerLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const navItems = [
        { path: '/customer/shop', icon: ShoppingBag, label: 'Shop' },
        { path: '/customer/cart', icon: ShoppingCart, label: 'Cart' },
        { path: '/customer/history', icon: Clock, label: 'History' },
        { path: '/customer/profile', icon: User, label: 'Profile' }
    ];

    return (
        <div className="h-screen overflow-hidden bg-zinc-950 flex flex-col md:flex-row">
            <Navigation 
                roleIcon="C"
                roleName="MELTS"
                items={navItems}
                onLogout={handleLogout}
            />
            <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
                <Outlet />
            </main>
        </div>
    );
}