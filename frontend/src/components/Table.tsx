interface Column<T> {
    header: string;
    accessor: (row: T) => React.ReactNode;
}

interface Props<T> {
    data: T[];
    columns: Column<T>[];
}

export default function Table<T>({ data, columns }: Props<T>) {
    return (
        <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-zinc-950/50 border-b border-zinc-800">
                        {columns.map((col, index) => (
                            <th key={index} className="py-4 px-6 text-zinc-400 font-semibold text-sm uppercase tracking-wider">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-zinc-800/50 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="py-4 px-6 text-zinc-300">
                                        {col.accessor(row)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="py-12 text-center text-zinc-500">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
