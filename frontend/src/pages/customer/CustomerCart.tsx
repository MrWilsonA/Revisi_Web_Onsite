import { useState, useEffect } from 'react';
import { req } from '../../api/api';
import type { IceCream } from '../../dto/IceCream';
import Table from '../../components/Table';

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

interface CartItem {
    iceCream: IceCream;
    quantity: number;
    selected: boolean;
}

export default function CustomerCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(stored);
    }, []);

    const updateCart = (newCart: CartItem[]) => {
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const handleRemove = (index: number) => {
        const newCart = [...cartItems];
        newCart.splice(index, 1);
        updateCart(newCart);
    };

    const handleQuantity = (index: number, delta: number) => {
        const newCart = [...cartItems];
        if (newCart[index].quantity + delta > 0) {
            newCart[index].quantity += delta;
            updateCart(newCart);
        } else {
            handleRemove(index);
        }
    };

    const handleToggleSelect = (index: number) => {
        const newCart = [...cartItems];
        newCart[index].selected = !newCart[index].selected;
        updateCart(newCart);
    };

    const handleCheckout = async () => {
        const selectedItems = cartItems.filter(item => item.selected);
        if (selectedItems.length === 0) return;
        setLoading(true);
        
        let customerName = 'Customer';
        const token = localStorage.getItem('access_token');
        if (token) {
            const decoded = parseJwt(token);
            if (decoded && decoded.UserId) {
                customerName = `User #${decoded.UserId}`;
            }
        }

        const finalAmount = selectedItems.reduce((sum, item) => sum + (item.iceCream.Price * item.quantity), 0);
        const itemsPayload = selectedItems.map(si => ({
            IceCreamID: si.iceCream.ID,
            Name: si.iceCream.Name,
            Price: si.iceCream.Price,
            Quantity: si.quantity,
            PictureUrl: si.iceCream.PictureUrl
        }));

        try {
            await req('/transaction/create', {
                CustomerName: customerName,
                FinalAmount: finalAmount,
                Status: 'Pending',
                Items: itemsPayload
            });
            alert('Checkout successful!');
            // Keep only unselected items
            updateCart(cartItems.filter(item => !item.selected));
        } catch (e: any) {
            alert('Checkout failed: ' + (e.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const total = cartItems.filter(item => item.selected).reduce((sum, item) => sum + (item.iceCream.Price * item.quantity), 0);

    const columns = [
        { header: 'Select', accessor: (row: CartItem, index: number) => (
            <input 
                type="checkbox" 
                checked={row.selected} 
                onChange={() => handleToggleSelect(index)} 
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
        )},
        { header: 'Image', accessor: (row: CartItem) => <img src={row.iceCream.PictureUrl || 'https://placehold.co/100x100?text=No+Image'} alt={row.iceCream.Name} className="w-12 h-12 rounded object-cover" /> },
        { header: 'Name', accessor: (row: CartItem) => <span className="font-semibold text-white">{row.iceCream.Name}</span> },
        { header: 'Price', accessor: (row: CartItem) => `$${row.iceCream.Price.toFixed(2)}` },
        { header: 'Qty', accessor: (row: CartItem, index: number) => (
            <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-2 py-1 w-max">
                <button onClick={() => handleQuantity(index, -1)} className="text-zinc-400 hover:text-white px-2 font-bold">-</button>
                <span className="text-white w-4 text-center">{row.quantity}</span>
                <button onClick={() => handleQuantity(index, 1)} className="text-zinc-400 hover:text-white px-2 font-bold">+</button>
            </div>
        )},
        { header: 'Total', accessor: (row: CartItem) => `$${(row.iceCream.Price * row.quantity).toFixed(2)}` },
        { header: 'Action', accessor: (row: CartItem, index: number) => (
            <button 
                onClick={() => handleRemove(index)}
                className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            >
                Remove
            </button>
        )}
    ];

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Your Cart</h1>
                    <p className="text-zinc-400">Review your selected ice creams and checkout.</p>
                </div>
                {cartItems.length > 0 && (
                    <button 
                        onClick={handleCheckout}
                        disabled={loading}
                        className="bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : `Checkout - $${total.toFixed(2)}`}
                    </button>
                )}
            </div>

            {cartItems.length > 0 ? (
                <Table data={cartItems} columns={columns} />
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500">
                    <p className="text-lg">Your cart is currently empty.</p>
                    <p className="mt-2">Go to the Shop to add some delicious ice cream!</p>
                </div>
            )}
        </div>
    );
}