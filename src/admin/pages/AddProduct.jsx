import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/adminApi';

const CATEGORIES = ['Furniture', 'Outdoor', 'Lighting', 'Dining', 'Bathrooms', 'Mirrors & Décor', 'Other'];

const initialForm = {
    name: '', description: '', category: '', price: '', stock: '',
    images: '', colors: '', ratings: '',
    features: [{ label: '', value: '' }],
};

export default function AddProduct() {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const setFeature = (i, field, value) => {
        const features = [...form.features];
        features[i] = { ...features[i], [field]: value };
        setForm(prev => ({ ...prev, features }));
    };

    const addFeature = () => setForm(prev => ({ ...prev, features: [...prev.features, { label: '', value: '' }] }));
    const removeFeature = (i) => setForm(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = {
                name: form.name,
                description: form.description,
                category: form.category,
                price: Number(form.price),
                stock: Number(form.stock),
                ratings: Number(form.ratings) || 0,
                images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
                colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
                features: form.features.filter(f => f.label && f.value),
            };
            await createProduct(payload);
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Go Back"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Add New Product</h2>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card title="Basic Information">
                    <Field label="Product Name" required>
                        <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Minimalist Oak Chair" required />
                    </Field>
                    <Field label="Description" required>
                        <textarea className="input-field min-h-[100px] resize-y" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detailed description..." required />
                    </Field>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Category" required>
                            <select className="input-field cursor-pointer" value={form.category} onChange={e => set('category', e.target.value)} required>
                                <option value="" disabled>Select…</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </Field>
                        <Field label="Price ($)" required>
                            <input className="input-field" type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" required />
                        </Field>
                        <Field label="Stock Quantity" required>
                            <input className="input-field" type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" required />
                        </Field>
                    </div>
                    <Field label="Initial Rating (0–5)">
                        <input className="input-field" type="number" min="0" max="5" step="0.1" value={form.ratings} onChange={e => set('ratings', e.target.value)} placeholder="4.5" />
                    </Field>
                </Card>

                <Card title="Images & Colors">
                    <Field label="Image URLs (one per line)">
                        <textarea className="input-field min-h-[100px] resize-y" value={form.images} onChange={e => set('images', e.target.value)} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
                    </Field>
                    <Field label="Colors (comma-separated)">
                        <input className="input-field" value={form.colors} onChange={e => set('colors', e.target.value)} placeholder="Walnut, Ivory, Charcoal" />
                    </Field>
                </Card>

                <Card title="Features / Specifications">
                    <div className="space-y-3">
                        {form.features.map((f, i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                <input className="input-field flex-1" placeholder="Label (e.g. Material)" value={f.label} onChange={e => setFeature(i, 'label', e.target.value)} />
                                <input className="input-field flex-1" placeholder="Value (e.g. Solid Oak)" value={f.value} onChange={e => setFeature(i, 'value', e.target.value)} />
                                <button type="button" onClick={() => removeFeature(i)} className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors" title="Remove Feature">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addFeature} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Feature
                    </button>
                </Card>

                <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={loading} className="inline-flex justify-center items-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20">
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Creating...
                            </>
                        ) : 'Create Product'}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                        Cancel
                    </button>
                </div>
            </form>
            <style>{`
                .input-field {
                    width: 100%;
                    padding: 0.625rem 0.875rem;
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    color: #1e293b;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-field:focus {
                    background-color: #fff;
                    border-color: #8b5cf6;
                    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
                }
            `}</style>
        </div>
    );
}

function Card({ title, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-5">{title}</h3>
            <div className="space-y-5">
                {children}
            </div>
        </div>
    );
}

function Field({ label, required, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                {label}
                {required && <span className="text-rose-500 font-bold">*</span>}
            </label>
            {children}
        </div>
    );
}
