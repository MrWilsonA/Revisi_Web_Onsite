import { useState, useEffect } from 'react';
import { reqGet } from '../../api/api';
import type { IceCream } from '../../dto/IceCream';
import IceCreamCard from '../../components/IceCreamCard';
import DebounceSearch from '../../components/DebounceSearch';
import Pagination from '../../components/Pagination';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import IceCreamDetailModal from '../../components/IceCreamDetailModal';

export default function CustomerShop() {
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

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Our Flavors</h1>
                    <p className="text-zinc-400">Discover your new favorite ice cream.</p>
                </div>
                <DebounceSearch onSearch={(q) => { setSearch(q); setPage(1); }} placeholder="Search flavors..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 25 }).map((_, i) => <LoadingSkeleton key={i} />)
                ) : iceCreams.length > 0 ? (
                    iceCreams.map(ic => <IceCreamCard key={ic.ID} iceCream={ic} actionLabel="Add to Cart" onAction={() => {
                        let existingCart: any[] = [];
                        try {
                            existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                        } catch(e) {}
                        
                        // Migrate old cart if necessary
                        if (existingCart.length > 0 && !existingCart[0].iceCream) {
                            existingCart = [];
                        }

                        const existingItem = existingCart.find(item => item.iceCream.ID === ic.ID);
                        if (existingItem) {
                            existingItem.quantity += 1;
                        } else {
                            existingCart.push({ iceCream: ic, quantity: 1, selected: true });
                        }
                        
                        localStorage.setItem('cart', JSON.stringify(existingCart));
                        alert('Added ' + ic.Name + ' to cart!');
                    }} onClick={() => setSelectedIceCream(ic)} />)
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