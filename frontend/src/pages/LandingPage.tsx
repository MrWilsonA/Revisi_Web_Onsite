import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CAROUSEL_IMAGES = [
    'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?cs=srgb&dl=pexels-teejay-1362534.jpg&fm=jpg',
    'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80'
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-zinc-900">
            {CAROUSEL_IMAGES.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img
                        src={src}
                        alt="Ice Cream"
                        className="object-cover w-full h-full"
                    />
                </div>
            ))}

            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6">
                    MELTS IN<br />
                    <span className="text-rose-400">YOUR MOUTH</span>
                </h1>
                <p className="text-lg md:text-2xl text-zinc-200 font-light mb-10 max-w-2xl">
                    Experience artisanal ice cream crafted with passion and the finest ingredients.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-white text-black px-10 py-4 rounded-full font-semibold text-lg uppercase tracking-wide hover:bg-rose-400 hover:text-white transition-colors duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(251,113,133,0.5)]"
                >
                    Get Started
                </button>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {CAROUSEL_IMAGES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-rose-400 w-8' : 'bg-white/50 hover:bg-white'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}