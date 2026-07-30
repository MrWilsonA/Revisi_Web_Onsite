import { useState, useEffect } from 'react';
import { reqGet } from '../../api/api';
import type { Transaction } from '../../dto/Transaction';
import Table from '../../components/Table';
import TransactionDetailModal from '../../components/TransactionDetailModal';

export default function CustomerHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

    const fetchTransactions = async () => {
        try {
            const res = await reqGet<{ data: Transaction[] }>('/transaction');
            setTransactions(res.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const columns = [
        { header: 'Order ID', accessor: (row: Transaction) => `#${row?.id}` },
        { header: 'Date', accessor: (row: Transaction) => row?.date_time || '-' },
        { header: 'Total', accessor: (row: Transaction) => `$${Number(row?.final_amount || 0).toFixed(2)}` },
        {
            header: 'Status', accessor: (row: Transaction) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${row?.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {row?.status || 'Unknown'}
                </span>
            )
        },
        {
            header: 'Action', accessor: (row: Transaction) => (
                <button
                    onClick={() => setSelectedTrx(row)}
                    className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                    Details
                </button>
            )
        }
    ];

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">Order History</h1>
                <p className="text-zinc-400">Review your past orders.</p>
            </div>
            <Table data={transactions} columns={columns} />

            {selectedTrx && (
                <TransactionDetailModal transaction={selectedTrx} onClose={() => setSelectedTrx(null)} />
            )}
        </div>
    );
}