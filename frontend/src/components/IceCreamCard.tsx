import type { IceCream } from '../dto/IceCream';

interface Props {
    iceCream: IceCream;
    actionLabel?: string;
    onAction?: (id: number) => void;
}

export default function IceCreamCard({ iceCream, actionLabel, onAction }: Props) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl flex flex-col">
            <div className="h-48 w-full bg-zinc-800 relative">
                {iceCream.PictureUrl ? (
                    <img src={iceCream.PictureUrl} alt={iceCream.Name} className="object-cover w-full h-full" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-600">No Image</div>
                )}
                <div className="absolute top-3 right-3 bg-rose-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    ${iceCream.Price.toFixed(2)}
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">{iceCream.Flavour}</div>
                <h3 className="text-xl font-bold text-white mb-2">{iceCream.Name}</h3>
                <p className="text-zinc-400 text-sm mb-6 flex-1 line-clamp-3">{iceCream.Description}</p>
                {actionLabel && onAction && (
                    <button 
                        onClick={() => onAction(iceCream.ID)}
                        className="w-full bg-zinc-800 hover:bg-rose-400 hover:text-black text-white font-medium py-3 rounded-xl transition-colors mt-auto"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
}