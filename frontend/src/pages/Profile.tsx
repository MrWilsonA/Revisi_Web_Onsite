import { useState, useEffect } from 'react';
import { reqPatch, reqGet } from '../api/api';
import type { IceCream } from '../dto/IceCream';

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

export default function Profile() {
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [recentIceCreams, setRecentIceCreams] = useState<IceCream[]>([]);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loadingEmail, setLoadingEmail] = useState(false);
    const [loadingUsername, setLoadingUsername] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decoded = parseJwt(token);
            if (decoded) {
                setRole(decoded.Role || decoded.role || 'user');
                setUserId(decoded.UserId || decoded.user_id || null);
            }
        }
        
        reqGet<{data: IceCream[]}>('/ice-cream?limit=5').then(res => {
            setRecentIceCreams(res.data || []);
        }).catch(err => console.error(err));
    }, []);

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setLoadingEmail(true);
        try {
            await reqPatch('/auth/update/email', { id: userId, new_email: email });
            alert('Email updated successfully!');
            setEmail('');
        } catch (err: any) {
            alert(err.message || 'Failed to update email');
        } finally {
            setLoadingEmail(false);
        }
    };

    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setLoadingUsername(true);
        try {
            await reqPatch('/auth/update/username', { id: userId, new_username: username });
            alert('Username updated successfully!');
            setUsername('');
        } catch (err: any) {
            alert(err.message || 'Failed to update username');
        } finally {
            setLoadingUsername(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setLoadingPassword(true);
        try {
            await reqPatch('/auth/update/password', { id: userId, new_password: password });
            alert('Password updated successfully!');
            setPassword('');
        } catch (err: any) {
            alert(err.message || 'Failed to update password');
        } finally {
            setLoadingPassword(false);
        }
    };

    const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-black text-white tracking-tighter mb-8">{displayRole} Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-1 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
                        <h3 className="text-zinc-400 text-sm font-medium mb-1">Account Role</h3>
                        <div className="text-white text-lg capitalize font-semibold bg-zinc-950 px-4 py-3 rounded-xl border border-zinc-800">
                            {displayRole}
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium mb-1 mt-4">User ID</h3>
                        <div className="text-white text-lg font-semibold bg-zinc-950 px-4 py-3 rounded-xl border border-zinc-800">
                            {userId !== null ? userId : 'N/A'}
                        </div>
                    </div>
                </div>

                <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-8">
                    <form onSubmit={handleUpdateEmail} className="space-y-3">
                        <h3 className="text-white font-bold text-lg mb-2">Update Email</h3>
                        <div className="flex gap-4">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                                placeholder="New Email Address"
                            />
                            <button
                                type="submit"
                                disabled={loadingEmail || !userId}
                                className="bg-rose-400 text-black font-semibold rounded-xl px-6 py-3 hover:bg-rose-500 transition-colors disabled:opacity-50"
                            >
                                {loadingEmail ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </form>

                    <form onSubmit={handleUpdateUsername} className="space-y-3">
                        <h3 className="text-white font-bold text-lg mb-2">Update Username</h3>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                                placeholder="New Username"
                            />
                            <button
                                type="submit"
                                disabled={loadingUsername || !userId}
                                className="bg-rose-400 text-black font-semibold rounded-xl px-6 py-3 hover:bg-rose-500 transition-colors disabled:opacity-50"
                            >
                                {loadingUsername ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </form>

                    <form onSubmit={handleUpdatePassword} className="space-y-3">
                        <h3 className="text-white font-bold text-lg mb-2">Update Password</h3>
                        <div className="flex gap-4">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                                placeholder="New Password"
                            />
                            <button
                                type="submit"
                                disabled={loadingPassword || !userId}
                                className="bg-rose-400 text-black font-semibold rounded-xl px-6 py-3 hover:bg-rose-500 transition-colors disabled:opacity-50"
                            >
                                {loadingPassword ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Latest Ice Creams</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {recentIceCreams.map(ic => (
                        <div key={ic.ID} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex gap-4 items-center">
                            <img src={ic.PictureUrl || 'https://placehold.co/100x100?text=No+Image'} alt={ic.Name} className="w-16 h-16 rounded object-cover" />
                            <div>
                                <h4 className="text-white font-semibold line-clamp-1">{ic.Name}</h4>
                                <div className="text-rose-400 text-sm">${ic.Price.toFixed(2)}</div>
                            </div>
                        </div>
                    ))}
                    {recentIceCreams.length === 0 && (
                        <div className="col-span-full text-zinc-500 text-center py-4">No recent ice creams available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
