import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { req } from '../api/api';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await req<any>('/auth/login', { email, password });
            localStorage.setItem('access_token', res.response.access_token);
            if (res.response.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/customer/shop');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                <h1 className="text-4xl font-black text-white tracking-tighter mb-2">WELCOME BACK</h1>
                <p className="text-zinc-400 mb-8">Sign in to your account</p>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-400 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rose-400 text-black font-semibold rounded-xl px-4 py-3 hover:bg-rose-500 transition-colors disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-zinc-500 text-center mt-8 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-rose-400 hover:text-rose-300 font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}