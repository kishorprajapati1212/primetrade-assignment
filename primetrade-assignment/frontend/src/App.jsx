import React, { useState, useEffect } from 'react';
import axios from 'axios';

// RELATIVE URL: This is crucial for the Vite Proxy in Project IDX to work!
const API_URL = '/api/v1'; 

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({ title: '', description: '', status: 'pending' });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.token}` }
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await axios.post(`${API_URL}${endpoint}`, formData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      showMsg(`Authentication successful. Protocol initiated.`);
    } catch (err) {
      showMsg(err.response?.data?.message || 'Access Denied', 'error');
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tasks`, getHeaders());
      setTasks(data);
    } catch (err) {
      showMsg('Failed to sync data streams', 'error');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/tasks`, taskData, getHeaders());
      setTasks([...tasks, data]);
      setTaskData({ title: '', description: '', status: 'pending' });
      showMsg('Entity registered successfully');
    } catch (err) {
      showMsg('Failed to register entity', 'error');
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'in-progress' : 'completed';
    try {
      const { data } = await axios.put(`${API_URL}/tasks/${id}`, { status: nextStatus }, getHeaders());
      setTasks(tasks.map(t => t._id === id ? data : t));
    } catch (err) {
      showMsg('State mutation failed', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wider">PRIME<span className="text-cyan-400 font-light">TRADE</span><span className="text-slate-500 text-xs ml-1">v1.0.4</span></h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-400">{user.email}</span>
              <span className="text-xs px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">{user.role}</span>
            </div>
            <button onClick={logout} className="text-sm text-slate-500 hover:text-red-400 transition-colors duration-200">logout</button>
          </div>
        )}
      </nav>

      {/* Notifications */}
      {message.text && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg border shadow-2xl z-50 text-sm font-medium backdrop-blur-md transition-all ${
          message.type === 'error' ? 'bg-red-950/80 border-red-900 text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.15)]' 
          : 'bg-cyan-950/80 border-cyan-900 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
        }`}>
          {message.text}
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-6 mt-8">
        {!user ? (
          /* AUTH PANEL */
          <div className="max-w-md mx-auto mt-16 p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-2">{isLogin ? 'System Access' : 'Initialize Account'}</h2>
            <p className="text-sm text-slate-500 mb-8">Secure JWT authentication gateway.</p>
            
            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Identifier</label>
                  <input type="text" required onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="Enter full name" />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Network Email</label>
                <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="operator@primetrade.ai" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Passphrase</label>
                <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="••••••••" />
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Clearance Level</label>
                  <select onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all">
                    <option value="USER">Standard Operator</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>
              )}
              
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 mt-4">
                {isLogin ? 'Login' : 'Sign in'}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-xs text-slate-500 hover:text-cyan-400 uppercase tracking-widest transition-colors">
                {isLogin ? '→ Switch to Registration' : '← Return to Login'}
              </button>
            </div>
          </div>
        ) : (
          /* DASHBOARD PANEL */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Input Terminal */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  New Module Registration
                </h3>
                
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <input type="text" value={taskData.title} required onChange={e => setTaskData({...taskData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-600 transition-all" placeholder="Module Title" />
                  </div>
                  <div>
                    <textarea value={taskData.description} onChange={e => setTaskData({...taskData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-600 transition-all resize-none" rows="4" placeholder="Execution parameters..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-3 px-4 rounded-lg border border-slate-700 hover:border-cyan-500 transition-all duration-300 shadow-lg flex justify-center items-center gap-2">
                    Deploy Module
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Active Modules Feed */}
            <div className="lg:col-span-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl min-h-[500px]">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    Active Data Feed
                  </h3>
                  <span className="bg-slate-950 text-slate-400 text-xs px-3 py-1 rounded-full border border-slate-800">{tasks.length} Records found</span>
                </div>
                
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-600">
                    <svg className="w-16 h-16 mb-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    <p className="text-sm">Database empty. Awaiting stream injection.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map(task => (
                      <div key={task._id} className="group bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
                        
                        {/* Status Indicator Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          task.status === 'completed' ? 'bg-emerald-500' : 
                          task.status === 'in-progress' ? 'bg-amber-500' : 
                          'bg-slate-700'
                        }`}></div>

                        <div className="flex-1 pl-3">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-slate-200">{task.title}</h4>
                            <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${
                              task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              task.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                              'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm">{task.description}</p>
                          <p className="text-slate-700 text-xs mt-2 font-mono">ID: {task._id.substring(0,8)}...{task._id.substring(task._id.length-4)}</p>
                        </div>
                        
                        {task.status !== 'completed' && (
                          <div className="pl-3 sm:pl-0 border-t border-slate-800 sm:border-t-0 pt-3 sm:pt-0">
                            <button onClick={() => handleUpdateStatus(task._id, task.status)} className="text-xs font-medium text-slate-400 hover:text-cyan-400 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-900 px-4 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto">
                              {task.status === 'pending' ? 'Initiate Process' : 'Finalize Module'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}