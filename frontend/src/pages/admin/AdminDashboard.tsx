import { useState, useEffect, useCallback } from 'react';
import { reqGet } from '../../api/api';
import type { IceCream } from '../../dto/IceCream';
import IceCreamCard from '../../components/IceCreamCard';
import DebounceSearch from '../../components/DebounceSearch';
import Pagination from '../../components/Pagination';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import IceCreamDetailModal from '../../components/IceCreamDetailModal';

export default function AdminDashboard() {
    const [iceCreams, setIceCreams] = useState<IceCream[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedIceCream, setSelectedIceCream] = useState<IceCream | null>(null);

    const fetchIceCreams = async () => {
        setLoading(true);
        try {
            const res = await reqGet<{data: IceCream[], total: number}>(`/ice-cream?search=${search}&page=${page}&limit=25`);
            setIceCreams(res.data || []);
            setTotalPages(Math.ceil((res.total || 0) / 25));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIceCreams();
    }, [page, search]);

    const handleSearch = useCallback((q: string) => {
        setSearch(q);
        setPage(1);
    }, []);

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Ice Cream Catalog</h1>
                    <p className="text-zinc-400">Manage your available flavors and products.</p>
                </div>
                <DebounceSearch onSearch={handleSearch} placeholder="Search flavors..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 25 }).map((_, i) => <LoadingSkeleton key={i} />)
                ) : iceCreams.length > 0 ? (
                    iceCreams.map(ic => <IceCreamCard key={ic.ID} iceCream={ic} actionLabel="Edit Price" onAction={() => {}} onClick={() => setSelectedIceCream(ic)} />)
                ) : (
                    <div className="col-span-full py-20 text-center text-zinc-500 text-lg">No ice creams found.</div>
                )}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            {selectedIceCream && (
                <IceCreamDetailModal 
                    iceCream={selectedIceCream} 
                    onClose={() => setSelectedIceCream(null)} 
                />
            )}
        </div>
    );
}