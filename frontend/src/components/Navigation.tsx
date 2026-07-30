import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'react-feather';

export interface NavItem {
    path: string;
    icon: any;
    label: string;
}

interface NavigationProps {
    roleIcon: string;
    roleName: string;
    items: NavItem[];
    onLogout: () => void;
}

export default function Navigation({ roleIcon, roleName, items, onLogout }: NavigationProps) {
    const location = useLocation();

    return (
        <aside className="w-full md:w-64 shrink-0 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col">
            <div className="mb-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-400 rounded-xl flex items-center justify-center font-black text-xl text-black">
                    {roleIcon}
                </div>
                <span className="text-xl font-bold text-white tracking-wide">{roleName}</span>
            </div>
            <nav className="flex-1 space-y-2">
                {items.map(item => {
                    const Icon = item.icon;
                    const active = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            // @ts-ignore: name is needed for testing/documentation
                            name={`link${item.label.replace(/\s+/g, '')}`}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${active ? 'bg-rose-500/10 text-rose-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <button
                name="btnLogout"
                onClick={onLogout}
                className="flex items-center gap-3 px-4 py-3 mt-6 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors font-medium"
            >
                <LogOut size={20} />
                Logout
            </button>
        </aside>
    );
}
