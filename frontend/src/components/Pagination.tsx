interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-10">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white disabled:opacity-50 hover:bg-zinc-800 transition-colors"
            >
                Prev
            </button>
            <span className="text-zinc-400 font-medium px-4">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white disabled:opacity-50 hover:bg-zinc-800 transition-colors"
            >
                Next
            </button>
        </div>
    );
}