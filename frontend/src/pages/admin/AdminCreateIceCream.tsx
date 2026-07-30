import { useState } from 'react';
import { req } from '../../api/api';
import type { CreateIceCreamResponse } from '../../dto/IceCream';
import { useNavigate } from 'react-router-dom';

export default function AdminCreateIceCream() {
    const navigate = useNavigate();
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
            let finalPictureUrl = '';
            if (pictureFile) {
                // 1. Get fid from seaweed-master
                const assignRes = await fetch('/seaweed/dir/assign');
                if (!assignRes.ok) throw new Error('Failed to get SeaweedFS assign');
                const assignData = await assignRes.json();
                
                // 2. Upload file to seaweed-volume using fid
                const formData = new FormData();
                formData.append('file', pictureFile);
                const uploadRes = await fetch('/volume/' + assignData.fid, {
                    method: 'POST',
                    body: formData
                });
                if (!uploadRes.ok) throw new Error('Failed to upload image to SeaweedFS');
                
                // 3. Set the final accessible URL
                finalPictureUrl = `http://localhost:8081/${assignData.fid}`;
            } else {
                throw new Error('Please select an image file');
            }

            await req<CreateIceCreamResponse>('/ice-cream/create', {
                Name: name,
                Price: Number(price),
                Flavour: flavour,
                Description: description,
                PictureUrl: finalPictureUrl
            });
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