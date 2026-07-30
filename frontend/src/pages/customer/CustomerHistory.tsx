import { useState, useEffect } from 'react';
import { reqGet } from '../../api/api';
import type { Transaction } from '../../dto/Transaction';
import Table from '../../components/Table';

export default function CustomerHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

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

    const columns = [
        { header: 'Order ID', accessor: (row: Transaction) => `#${row.ID}` },
        { header: 'Date', accessor: (row: Transaction) => row.DateTime },
        { header: 'Total', accessor: (row: Transaction) => `$${row.FinalAmount.toFixed(2)}` },
        { header: 'Status', accessor: (row: Transaction) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${row.Status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {row.Status}
            </span>
        )}
    ];

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">Order History</h1>
                <p className="text-zinc-400">Review your past orders.</p>
            </div>
            <Table data={transactions} columns={columns} />
        </div>
    );
}