import { useState, useEffect } from 'react';
import { Search } from 'react-feather';

interface Props {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function DebounceSearch({ onSearch, placeholder = 'Search...' }: Props) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(query);
        }, 500);
        return () => clearTimeout(handler);
    }, [query, onSearch]);

    return (
        <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-full pl-12 pr-6 py-3 focus:outline-none focus:border-rose-400 transition-colors shadow-inner"
            />
        </div>
    );
}