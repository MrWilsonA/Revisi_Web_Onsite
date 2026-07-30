import { useState, useEffect, useMemo } from 'react';
import { reqGet, reqPatch } from '../../api/api';
import type { Transaction } from '../../dto/Transaction';
import Table from '../../components/Table';
import TransactionDetailModal from '../../components/TransactionDetailModal';

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchTransactions = async () => {
        try {
            const res = await reqGet<{data: Transaction[]}>('/transaction');
            setTransactions(res.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            await reqPatch('/transaction/status', { id, status });
            fetchTransactions();
        } catch (e) {
            console.error(e);
        }
    };

    const resetFilters = () => {
        setStatusFilter('');
        setStartDate('');
        setEndDate('');
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(trx => {
            if (statusFilter && trx.status !== statusFilter) return false;
            if (startDate || endDate) {
                // Assuming DateTime is "YYYY-MM-DD HH:mm:ss" or similar
                const trxDate = trx.date_time ? trx.date_time.split(' ')[0] : '';
                if (startDate && trxDate < startDate) return false;
                if (endDate && trxDate > endDate) return false;
            }
            return true;
        });
    }, [transactions, statusFilter, startDate, endDate]);

    const columns = [
        { header: 'ID', accessor: (row: Transaction) => `#${row?.id}` },
        { header: 'Customer', accessor: (row: Transaction) => row?.customer_name },
        { header: 'Date', accessor: (row: Transaction) => row?.date_time || '-' },
        { header: 'Total', accessor: (row: Transaction) => `$${Number(row?.final_amount || 0).toFixed(2)}` },
        { header: 'Status', accessor: (row: Transaction) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${row?.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {row?.status || 'Unknown'}
            </span>
        )},
        { header: 'Actions', accessor: (row: Transaction) => (
            <div className="flex gap-2 items-center">
                <select 
                    value={row?.status}
                    onChange={(e) => updateStatus(row?.id, e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1 text-sm focus:outline-none"
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <button 
                    onClick={() => setSelectedTrx(row)}
                    className="bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                    Details
                </button>
            </div>
        )}
    ];

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">Transaction Management</h1>
                <p className="text-zinc-400">View and update customer transactions.</p>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400">Status</label>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-400">
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400">Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-400" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400">End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-400" />
                </div>
                <div className="flex flex-col gap-1 justify-end">
                    <button onClick={resetFilters} className="bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors border border-rose-500/20">
                        Reset Filters
                    </button>
                </div>
            </div>

            <Table data={filteredTransactions} columns={columns} />

            {selectedTrx && (
                <TransactionDetailModal transaction={selectedTrx} onClose={() => setSelectedTrx(null)} />
            )}
        </div>
    );
}