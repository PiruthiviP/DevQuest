import React, { useState, useEffect } from 'react';
import { Plus, Check, X, DollarSign, MessageSquare, Clock, Users, Trash2, Bell, BookOpen, Vote, ArrowRight, Sparkles, Calendar, Target, Brain, Zap } from 'lucide-react';

export default function SharedLifeCompanion() {
  const [currentView, setCurrentView] = useState('welcome');
  const [tripData, setTripData] = useState({ tripName: '', members: '', duration: '' });
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [memories, setMemories] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    if (currentView === 'dashboard') {
      loadAllData();
    }
  }, [currentView]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [tasksRes, paymentsRes, memoriesRes, decisionsRes, tripRes] = await Promise.all([
        window.storage.get('shared-tasks', true).catch(() => null),
        window.storage.get('shared-payments', true).catch(() => null),
        window.storage.get('shared-memories', true).catch(() => null),
        window.storage.get('shared-decisions', true).catch(() => null),
        window.storage.get('trip-data', true).catch(() => null)
      ]);

      setTasks(tasksRes ? JSON.parse(tasksRes.value) : []);
      setPayments(paymentsRes ? JSON.parse(paymentsRes.value) : []);
      setMemories(memoriesRes ? JSON.parse(memoriesRes.value) : []);
      setDecisions(decisionsRes ? JSON.parse(decisionsRes.value) : []);
      if (tripRes) setTripData(JSON.parse(tripRes.value));
    } catch (error) {
      console.log('Starting fresh');
    }
    setLoading(false);
  };

  const handleTripSubmit = async (e) => {
    e.preventDefault();
    if (!tripData.tripName || !tripData.members || !tripData.duration) return;
    await window.storage.set('trip-data', JSON.stringify(tripData), true);
    setCurrentView('features');
  };

  const handleFeatureSelect = (feature) => {
    setActiveTab(feature);
    setCurrentView('dashboard');
  };

  // Tasks
  const [newTask, setNewTask] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');

  const addTask = async () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now(),
      text: newTask,
      deadline: taskDeadline,
      completed: false,
      createdAt: new Date().toISOString()
    };
    const updated = [...tasks, task];
    setTasks(updated);
    await window.storage.set('shared-tasks', JSON.stringify(updated), true);
    setNewTask('');
    setTaskDeadline('');
  };

  const toggleTask = async (id) => {
    const updated = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    setTasks(updated);
    await window.storage.set('shared-tasks', JSON.stringify(updated), true);
  };

  const deleteTask = async (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    await window.storage.set('shared-tasks', JSON.stringify(updated), true);
  };

  // Payments
  const [newPayment, setNewPayment] = useState({ description: '', amount: '', paidBy: '', splitWith: '' });

  const addPayment = async () => {
    if (!newPayment.description || !newPayment.amount || !newPayment.paidBy) return;
    const payment = {
      id: Date.now(),
      ...newPayment,
      amount: parseFloat(newPayment.amount),
      createdAt: new Date().toISOString(),
      settled: false
    };
    const updated = [...payments, payment];
    setPayments(updated);
    await window.storage.set('shared-payments', JSON.stringify(updated), true);
    setNewPayment({ description: '', amount: '', paidBy: '', splitWith: '' });
  };

  const settlePayment = async (id) => {
    const updated = payments.map(p => p.id === id ? {...p, settled: true} : p);
    setPayments(updated);
    await window.storage.set('shared-payments', JSON.stringify(updated), true);
  };

  // Memories
  const [newMemory, setNewMemory] = useState('');

  const addMemory = async () => {
    if (!newMemory.trim()) return;
    const memory = {
      id: Date.now(),
      text: newMemory,
      createdAt: new Date().toISOString()
    };
    const updated = [...memories, memory];
    setMemories(updated);
    await window.storage.set('shared-memories', JSON.stringify(updated), true);
    setNewMemory('');
  };

  // Decisions
  const [newDecision, setNewDecision] = useState({ question: '', options: ['', ''] });

  const addDecision = async () => {
    if (!newDecision.question || newDecision.options.some(o => !o.trim())) return;
    const decision = {
      id: Date.now(),
      question: newDecision.question,
      options: newDecision.options.map(o => ({ text: o, votes: [] })),
      createdAt: new Date().toISOString(),
      resolved: false
    };
    const updated = [...decisions, decision];
    setDecisions(updated);
    await window.storage.set('shared-decisions', JSON.stringify(updated), true);
    setNewDecision({ question: '', options: ['', ''] });
  };

  const vote = async (decisionId, optionIndex, voterName) => {
    if (!voterName.trim()) return;
    const updated = decisions.map(d => {
      if (d.id === decisionId) {
        const newOptions = d.options.map((opt, idx) => {
          if (idx === optionIndex && !opt.votes.includes(voterName)) {
            return { ...opt, votes: [...opt.votes, voterName] };
          }
          return opt;
        });
        return { ...d, options: newOptions };
      }
      return d;
    });
    setDecisions(updated);
    await window.storage.set('shared-decisions', JSON.stringify(updated), true);
  };

  const resolveDecision = async (id) => {
    const updated = decisions.map(d => d.id === id ? {...d, resolved: true} : d);
    setDecisions(updated);
    await window.storage.set('shared-decisions', JSON.stringify(updated), true);
  };

  // Welcome Screen
  if (currentView === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-2xl w-full">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <Sparkles className="w-20 h-20 text-yellow-300 animate-pulse" />
            </div>
            <h1 className="text-6xl font-black text-white mb-4 tracking-tight">
              Life Companion
            </h1>
            <p className="text-xl text-purple-100 font-light mb-2">
              I track what must be done, remember what you'll forget
            </p>
            <p className="text-lg text-purple-200 italic">
              and hear all voices before choosing the winner
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
            <form onSubmit={handleTripSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trip Name
                </label>
                <input
                  type="text"
                  name="tripName"
                  value={tripData.tripName}
                  onChange={(e) => setTripData({ ...tripData, tripName: e.target.value })}
                  placeholder="Weekend Getaway, Summer Adventure..."
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition text-gray-800 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Members
                  </label>
                  <input
                    type="number"
                    name="members"
                    value={tripData.members}
                    onChange={(e) => setTripData({ ...tripData, members: e.target.value })}
                    placeholder="4"
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={tripData.duration}
                    onChange={(e) => setTripData({ ...tripData, duration: e.target.value })}
                    placeholder="7"
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition text-gray-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                Start Your Journey
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Features Selection Screen
  if (currentView === 'features') {
    const features = [
      {
        id: 'reminders',
        title: 'Smart Reminders',
        desc: 'Reminds you before you forget important tasks and events',
        icon: Bell,
        color: 'from-pink-500 to-rose-500',
        tab: 'tasks'
      },
      {
        id: 'payments',
        title: 'Payment & Task Sharing',
        desc: 'Easily split bills and manage shared responsibilities',
        icon: DollarSign,
        color: 'from-green-500 to-emerald-500',
        tab: 'payments'
      },
      {
        id: 'memory',
        title: 'Memory Vault',
        desc: 'Stores memories and important notes so you never forget',
        icon: Brain,
        color: 'from-purple-500 to-violet-500',
        tab: 'memories'
      },
      {
        id: 'resolver',
        title: 'Conflict Resolver',
        desc: 'Helps decide when multiple choices conflict',
        icon: Vote,
        color: 'from-blue-500 to-cyan-500',
        tab: 'decisions'
      },
      {
        id: 'design',
        title: 'Task-Centric Design',
        desc: 'Focuses on what must be done, not who you are',
        icon: Target,
        color: 'from-orange-500 to-amber-500',
        tab: 'tasks'
      },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 pt-8">
            <h2 className="text-5xl font-black text-white mb-4">
              Choose Your Power
            </h2>
            <p className="text-xl text-purple-200">
              Select a feature to begin managing your {tripData.tripName}
            </p>
            <div className="mt-4 inline-flex items-center gap-4 text-purple-300">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{tripData.members} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{tripData.duration} days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureSelect(feature.tab)}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 transform group-hover:rotate-6 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.desc}
                </p>
                <div className="mt-4 flex items-center text-purple-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Top Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('features')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowRight className="w-5 h-5 transform rotate-180 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {tripData.tripName}
                </h1>
                <p className="text-sm text-gray-500">
                  {tripData.members} members • {tripData.duration} days
                </p>
              </div>
            </div>
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'tasks', icon: Check, label: 'Tasks', color: 'purple' },
            { id: 'payments', icon: DollarSign, label: 'Payments', color: 'green' },
            { id: 'memories', icon: BookOpen, label: 'Memories', color: 'amber' },
            { id: 'decisions', icon: MessageSquare, label: 'Decisions', color: 'blue' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg transform scale-105`
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {/* Tasks Tab */}
              {activeTab === 'tasks' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">What Must Be Done</h2>
                  <div className="flex gap-3 mb-8">
                    <input
                      type="text"
                      placeholder="Add a task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
                    />
                    <input
                      type="date"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
                    />
                    <button
                      onClick={addTask}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition transform hover:scale-105"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tasks.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No tasks yet. What needs doing?</p>
                      </div>
                    ) : (
                      tasks.map(task => (
                        <div key={task.id} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:shadow-md'}`}>
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                              task.completed ? 'bg-green-500 border-green-500 scale-110' : 'border-purple-400 hover:border-purple-600'
                            }`}
                          >
                            {task.completed && <Check size={18} className="text-white" />}
                          </button>
                          <div className="flex-1">
                            <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.text}</p>
                            {task.deadline && (
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Clock size={14} />
                                {new Date(task.deadline).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Split The Cost</h2>
                  <div className="grid gap-4 mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                    <input
                      type="text"
                      placeholder="What was paid for?"
                      value={newPayment.description}
                      onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                      className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                        className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                      />
                      <input
                        type="text"
                        placeholder="Paid by"
                        value={newPayment.paidBy}
                        onChange={(e) => setNewPayment({...newPayment, paidBy: e.target.value})}
                        className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                      />
                      <input
                        type="text"
                        placeholder="Split with"
                        value={newPayment.splitWith}
                        onChange={(e) => setNewPayment({...newPayment, splitWith: e.target.value})}
                        className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                      />
                    </div>
                    <button
                      onClick={addPayment}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Add Payment
                    </button>
                  </div>
                  <div className="space-y-4">
                    {payments.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No payments tracked yet</p>
                      </div>
                    ) : (
                      payments.map(payment => (
                        <div key={payment.id} className={`p-6 rounded-2xl border-2 transition-all duration-300 ${payment.settled ? 'bg-gray-50 border-gray-200' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-md'}`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-lg text-gray-800">{payment.description}</p>
                              <p className="text-gray-600 mt-1">
                                <span className="font-semibold">{payment.paidBy}</span> paid <span className="text-green-600 font-bold">${payment.amount.toFixed(2)}</span>
                                {payment.splitWith && <span className="text-gray-500"> • Split with {payment.splitWith}</span>}
                              </p>
                            </div>
                            {!payment.settled && (
                              <button
                                onClick={() => settlePayment(payment.id)}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                              >
                                Settle
                              </button>
                            )}
                          </div>
                          {payment.settled && (
                            <div className="flex items-center gap-2 text-green-600 font-semibold">
                              <Check size={18} />
                              Settled
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Memories Tab */}
              {activeTab === 'memories' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Never Forget</h2>
                  <div className="flex gap-3 mb-8">
                    <input
                      type="text"
                      placeholder="A memory your brain will delete..."
                      value={newMemory}
                      onChange={(e) => setNewMemory(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addMemory()}
                      className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition"
                    />
                    <button
                      onClick={addMemory}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition transform hover:scale-105"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {memories.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No memories stored yet. I never forget.</p>
                      </div>
                    ) : (
                      memories.map(memory => (
                        <div key={memory.id} className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl hover:shadow-md transition-all duration-300">
                          <p className="text-gray-800 text-lg mb-3">{memory.text}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Clock size={14} />
                            {new Date(memory.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Decisions Tab */}
              {activeTab === 'decisions' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Hear All Voices</h2>
                  <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                    <input
                      type="text"
                      placeholder="What needs deciding?"
                      value={newDecision.question}
                      onChange={(e) => setNewDecision({...newDecision, question: e.target.value})}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                    />
                    {newDecision.options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...newDecision.options];
                          newOpts[idx] = e.target.value;
                          setNewDecision({...newDecision, options: newOpts});
                        }}
                        className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl mb-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                      />
                    ))}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setNewDecision({...newDecision, options: [...newDecision.options, '']})}
                        className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 font-semibold transition"
                      >
                        Add Option
                      </button>
                      <button
                        onClick={addDecision}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105"
                      >
                        Create Decision
                      </button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {decisions.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Vote className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No decisions pending. I hear all voices.</p>
                      </div>
                    ) : (
                      decisions.map(decision => {
                        const [voterInputs, setVoterInputs] = useState({});
                        return (
                          <div key={decision.id} className={`p-6 rounded-2xl border-2 transition-all duration-300 ${decision.resolved ? 'bg-gray-50 border-gray-200' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:shadow-md'}`}>
                            <p className="font-bold text-xl text-gray-800 mb-4">{decision.question}</p>
                            <div className="space-y-3 mb-4">
                              {decision.options.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="flex-1 p-4 bg-white/80 backdrop-blur rounded-xl border border-gray-200 flex justify-between items-center">
                                    <span className="font-medium text-gray-700">{opt.text}</span>
                                    <div className="flex items-center gap-3">
                                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                        {opt.votes.length} {opt.votes.length === 1 ? 'vote' : 'votes'}
                                      </span>
                                      {opt.votes.length > 0 && (
                                        <span className="text-xs text-gray-500">
                                          {opt.votes.join(', ')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {!decision.resolved && (
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder="Your name"
                                        value={voterInputs[`${decision.id}-${idx}`] || ''}
                                        onChange={(e) => setVoterInputs({...voterInputs, [`${decision.id}-${idx}`]: e.target.value})}
                                        className="w-28 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                      />
                                      <button
                                        onClick={() => {
                                          const voterName = voterInputs[`${decision.id}-${idx}`];
                                          if (voterName) {
                                            vote(decision.id, idx, voterName);
                                            setVoterInputs({...voterInputs, [`${decision.id}-${idx}`]: ''});
                                          }
                                        }}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition transform hover:scale-105"
                                      >
                                        Vote
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            {!decision.resolved ? (
                              <button
                                onClick={() => resolveDecision(decision.id)}
                                className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                              >
                                Resolve Decision
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 text-green-600 font-semibold text-lg">
                                <Check size={20} />
                                Decision Resolved
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-sm text-gray-600 bg-white/60 backdrop-blur inline-block px-6 py-3 rounded-full shadow-sm">
            <span className="font-semibold">🌐 Shared Data</span> • All information is visible to everyone using this companion
          </p>
        </div>
      </div>
    </div>
  );
}