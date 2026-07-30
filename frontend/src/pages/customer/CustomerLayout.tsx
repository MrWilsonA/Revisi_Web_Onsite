import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ShoppingBag, ShoppingCart, Clock, User } from 'react-feather';

export default function CustomerLayout() {
    const navigate = useNavigate();
    const location = useLocation();

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
            <aside className="w-full md:w-64 shrink-0 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col">
                <div className="mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-400 rounded-xl flex items-center justify-center font-black text-xl text-black">C</div>
                    <span className="text-xl font-bold text-white tracking-wide">MELTS</span>
                </div>
                <nav className="flex-1 space-y-2">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const active = location.pathname.startsWith(item.path);
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${active ? 'bg-rose-500/10 text-rose-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 mt-6 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors font-medium">
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>
            <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
                <Outlet />
            </main>
        </div>
    );
}