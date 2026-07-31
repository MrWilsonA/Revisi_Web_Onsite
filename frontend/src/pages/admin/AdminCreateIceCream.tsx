import { useState } from 'react';

export default function AdminCreateIceCream() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [flavour, setFlavour] = useState('');
    const [description, setDescription] = useState('');
    const [pictureFile, setPictureFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            if (!pictureFile) {
                throw new Error('Please select an image file');
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price.toString());
            formData.append('description', description);
            formData.append('flavour', flavour);
            formData.append('picture', pictureFile);

            const token = localStorage.getItem('access_token');
            const res = await fetch('/api/icecream/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.err || data.error || 'Failed to create ice cream');
            }

            setSuccess(true);
            setName('');
            setPrice('');
            setFlavour('');
            setDescription('');
            setPictureFile(null);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to create ice cream');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-black text-white tracking-tighter mb-8">Create New Ice Cream</h1>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm">
                    Ice cream created successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                <div>
                    <label className="block text-zinc-400 text-sm font-medium mb-2">Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                        placeholder="E.g. Strawberry Delight"
                    />
                </div>
                <div>
                    <label className="block text-zinc-400 text-sm font-medium mb-2">Price ($)</label>
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : '')}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                        placeholder="E.g. 5.99"
                    />
                </div>
                <div>
                    <label className="block text-zinc-400 text-sm font-medium mb-2">Flavour</label>
                    <input
                        type="text"
                        required
                        value={flavour}
                        onChange={(e) => setFlavour(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                        placeholder="E.g. Strawberry"
                    />
                </div>
                <div>
                    <label className="block text-zinc-400 text-sm font-medium mb-2">Picture Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setPictureFile(e.target.files[0]);
                            }
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-400 file:text-black hover:file:bg-rose-500"
                    />
                </div>
                <div>
                    <label className="block text-zinc-400 text-sm font-medium mb-2">Description</label>
                    <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors resize-none"
                        placeholder="A delicious strawberry ice cream..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-rose-400 text-black font-semibold rounded-xl px-4 py-3 hover:bg-rose-500 transition-colors disabled:opacity-50 mt-4"
                >
                    {loading ? 'Creating...' : 'Create Ice Cream'}
                </button>
            </form>
        </div>
    );
}