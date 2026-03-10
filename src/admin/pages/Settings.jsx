export default function Settings() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Store Settings</h2>
                <p className="text-sm text-slate-500 font-medium">Configure your shop's global parameters and admin profile.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider">Coming Soon</span>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-indigo-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        General Preferences
                    </h3>
                    <div className="space-y-4 opacity-50 pointer-events-none">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Store Name</label>
                            <input type="text" value="Prabott Premium Furniture" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Email</label>
                            <input type="email" value="admin@prabott.com" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Currency</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700">
                                <option>USD ($)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications Settings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider">Coming Soon</span>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-indigo-500"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        Admin Notifications
                    </h3>
                    <div className="space-y-6 opacity-50 pointer-events-none">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-700">Order Alerts</p>
                                <p className="text-xs text-slate-500">Receive email for every new purchase</p>
                            </div>
                            <div className="w-10 h-5 bg-indigo-500 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-700">Stock Warnings</p>
                                <p className="text-xs text-slate-500">Alert when items fall below threshold</p>
                            </div>
                            <div className="w-10 h-5 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-700">Service Logs</p>
                                <p className="text-xs text-slate-500">Weekly technical performance reports</p>
                            </div>
                            <div className="w-10 h-5 bg-indigo-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
