/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  LayoutDashboard, BarChart3, PieChart as PieChartIcon, 
  Table as TableIcon, Settings, Search, Bell, 
  TrendingUp, Users, DollarSign, ShoppingBag,
  ArrowUpRight, ArrowDownRight, Filter, Download,
  ChevronRight, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Sample Data ---
const initialData = [
  { month: 'Jan', revenue: 4500, users: 1200, sales: 340, growth: 12 },
  { month: 'Feb', revenue: 5200, users: 1450, sales: 410, growth: 15 },
  { month: 'Mar', revenue: 4800, users: 1300, sales: 380, growth: -5 },
  { month: 'Apr', revenue: 6100, users: 1800, sales: 520, growth: 22 },
  { month: 'May', revenue: 5900, users: 1750, sales: 490, growth: -2 },
  { month: 'Jun', revenue: 7200, users: 2100, sales: 610, growth: 18 },
  { month: 'Jul', revenue: 8500, users: 2400, sales: 750, growth: 25 },
];

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Fashion', value: 300 },
  { name: 'Home', value: 200 },
  { name: 'Beauty', value: 100 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

// --- Components ---

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2"
  >
    <div className="flex justify-between items-start">
      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
        <Icon size={20} />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
        trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}>
        {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {change}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  </motion.div>
);

const ChartWrapper = ({ title, children, className }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={cn("bg-white p-6 rounded-2xl shadow-sm border border-slate-100", className)}
  >
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
        <Filter size={16} />
      </button>
    </div>
    <div className="h-[300px] w-full">
      {children}
    </div>
  </motion.div>
);

const DataInputModal = ({ isOpen, onClose, onSave }: any) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('Data must be an array of objects');
      onSave(parsed);
      onClose();
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold">Import Custom Data</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-500">Paste your JSON data here. It should be an array of objects with consistent keys.</p>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='[{"month": "Jan", "revenue": 1000}, ...]'
            className="w-full h-64 p-4 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {error && <p className="text-sm text-rose-500 font-medium">{error}</p>}
        </div>
        <div className="p-6 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-all">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-all">
            Save Data
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = useMemo(() => {
    const totalRev = data.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
    const totalUsers = data.reduce((acc, curr) => acc + (curr.users || 0), 0);
    const totalSales = data.reduce((acc, curr) => acc + (curr.sales || 0), 0);
    const avgGrowth = data.reduce((acc, curr) => acc + (curr.growth || 0), 0) / data.length;

    return [
      { title: 'Total Revenue', value: `$${totalRev.toLocaleString()}`, change: '+12.5%', icon: DollarSign, trend: 'up' },
      { title: 'Active Users', value: totalUsers.toLocaleString(), change: '+8.2%', icon: Users, trend: 'up' },
      { title: 'Total Sales', value: totalSales.toLocaleString(), change: '-2.4%', icon: ShoppingBag, trend: 'down' },
      { title: 'Avg Growth', value: `${avgGrowth.toFixed(1)}%`, change: '+4.1%', icon: TrendingUp, trend: 'up' },
    ];
  }, [data]);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'distribution', label: 'Distribution', icon: PieChartIcon },
    { id: 'data', label: 'Raw Data', icon: TableIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      <DataInputModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={setData} 
      />
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">OmniViz</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.id 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <Settings size={20} />
              Settings
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl relative transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Yasin Khan</p>
                <p className="text-xs text-slate-500">Admin Account</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img 
                  src="https://picsum.photos/seed/user/100/100" 
                  alt="User" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
                <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your data today.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setData(initialData)}
                  className="px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <Download size={18} className="rotate-180" />
                  Import Data
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <StatCard key={i} {...stat} />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartWrapper title="Revenue Growth" className="lg:col-span-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartWrapper>

              <ChartWrapper title="Category Distribution">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartWrapper title="User Acquisition">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="users" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrapper>

              <ChartWrapper title="Sales Performance">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#ec4899" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>

            {/* Data Table Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Recent Monthly Performance</h3>
                <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Users</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sales</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.month}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">${row.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{row.users.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{row.sales}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            row.growth >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          )}>
                            {row.growth >= 0 ? '+' : ''}{row.growth}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

