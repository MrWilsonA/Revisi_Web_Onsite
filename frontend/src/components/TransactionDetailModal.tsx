import type { Transaction } from '../dto/Transaction';
import Table from './Table';

interface Props {
    transaction: Transaction;
    onClose: () => void;
}

export default function TransactionDetailModal({ transaction, onClose }: Props) {
    const columns = [
        { header: 'Image', accessor: (row: any) => <img src={row.picture_url || 'https://placehold.co/100x100?text=No+Image'} alt={row.name} className="w-10 h-10 rounded object-cover" /> },
        { header: 'Name', accessor: (row: any) => <span className="font-semibold text-white">{row.name}</span> },
        { header: 'Price', accessor: (row: any) => `$${row.price.toFixed(2)}` },
        { header: 'Qty', accessor: (row: any) => row.quantity },
        { header: 'Total', accessor: (row: any) => `$${(row.price * row.quantity).toFixed(2)}` }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl animate-fade-in relative max-h-[90vh] flex flex-col">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-rose-500 text-white rounded-full transition-colors z-10"
                >
                    &times;
                </button>
                <div className="p-8 pb-4 border-b border-zinc-800">
                    <h2 className="text-2xl font-black text-white mb-2">Transaction #{transaction.id}</h2>
                    <p className="text-zinc-400">Date: {transaction.date_time} | Customer: {transaction.customer_name}</p>
                </div>
                <div className="p-8 overflow-y-auto flex-1">
                    {transaction.items && transaction.items.length > 0 ? (
                        <Table data={transaction.items} columns={columns} />
                    ) : (
                        <div className="text-zinc-500 text-center py-8">No items found for this transaction.</div>
                    )}
                </div>
                <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center">
                    <span className="text-zinc-400 font-medium">Final Payment Amount:</span>
                    <span className="text-2xl font-bold text-emerald-400">${Number(transaction.final_amount || 0).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
