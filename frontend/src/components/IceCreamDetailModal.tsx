import type { IceCream } from '../dto/IceCream';

interface Props {
    iceCream: IceCream;
    onClose: () => void;
}

export default function IceCreamDetailModal({ iceCream, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl animate-fade-in relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-rose-500 text-white rounded-full transition-colors z-10"
                >
                    &times;
                </button>
                <div className="h-64 w-full bg-zinc-800 relative">
                    {iceCream.PictureUrl ? (
                        <img src={iceCream.PictureUrl} alt={iceCream.Name} className="object-cover w-full h-full" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600">No Image</div>
                    )}
                </div>
                <div className="p-8">
                    <div className="text-rose-400 text-sm font-bold uppercase tracking-wider mb-2">{iceCream.Flavour}</div>
                    <h2 className="text-3xl font-black text-white mb-4">{iceCream.Name}</h2>
                    <div className="text-2xl font-bold text-emerald-400 mb-6">
                        ${iceCream.Price.toFixed(2)}
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                        {iceCream.Description}
                    </p>
                </div>
            </div>
        </div>
    );
}
