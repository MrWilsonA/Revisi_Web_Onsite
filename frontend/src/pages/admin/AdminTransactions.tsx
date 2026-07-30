import { useState, useEffect } from 'react';
import { reqGet, reqPatch } from '../../api/api';
import type { Transaction } from '../../dto/Transaction';
import Table from '../../components/Table';

export default function AdminTransactions() {
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

    const updateStatus = async (id: number, status: string) => {
        try {
            await reqPatch('/transaction/status', { id, status });
            fetchTransactions();
        } catch (e) {
            console.error(e);
        }
    };

    const columns = [
        { header: 'ID', accessor: (row: Transaction) => `#${row.ID}` },
        { header: 'Customer', accessor: (row: Transaction) => row.CustomerName },
        { header: 'Date', accessor: (row: Transaction) => row.DateTime },
        { header: 'Total', accessor: (row: Transaction) => `$${row.FinalAmount.toFixed(2)}` },
        { header: 'Status', accessor: (row: Transaction) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${row.Status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {row.Status}
            </span>
        )},
        { header: 'Actions', accessor: (row: Transaction) => (
            <select 
                value={row.Status}
                onChange={(e) => updateStatus(row.ID, e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1 text-sm focus:outline-none"
            >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        )}
    ];

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">Transaction Management</h1>
                <p className="text-zinc-400">View and update customer transactions.</p>
            </div>
            <Table data={transactions} columns={columns} />
        </div>
    );
}