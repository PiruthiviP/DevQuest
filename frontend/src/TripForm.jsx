import React, { useState, useEffect } from 'react';
import { Plus, Check, X, DollarSign, MessageSquare, Clock, Users, Trash2, Bell, BookOpen, Vote, ArrowRight, Sparkles, Calendar, Target, Brain, Zap, CheckSquare } from 'lucide-react';

export default function TripForm({ onNavigateToTasks }) {
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
        quote: 'I remind you before you forget',
        desc: 'Never miss important deadlines or events again',
        icon: Bell,
        color: 'from-pink-500 to-rose-500',
        bgGlow: 'pink',
        action: 'reminder'
      },
      {
        id: 'payments',
        title: 'Payment Sharing',
        quote: 'Split costs, not friendships',
        desc: 'Easily track who paid what and settle debts fairly',
        icon: DollarSign,
        color: 'from-green-500 to-emerald-500',
        bgGlow: 'green',
        action: 'payments'
      },
      {
        id: 'tasks',
        title: 'Task-Centric Living',
        quote: 'I live between the tasks, not the people. I track not who you are but what must be done',
        desc: 'Focus on actions, not identities',
        icon: CheckSquare,
        color: 'from-orange-500 to-amber-500',
        bgGlow: 'orange',
        action: 'task-manager'
      },
      {
        id: 'memory',
        title: 'Memory Vault',
        quote: 'I store memories your brain will surely delete - but I never forget',
        desc: 'Preserve important moments forever',
        icon: Brain,
        color: 'from-purple-500 to-violet-500',
        bgGlow: 'purple',
        action: 'memories'
      },
      {
        id: 'resolver',
        title: 'Conflict Resolver',
        quote: 'When decisions conflict, I hear all voices before choosing the winner',
        desc: 'Democratic decision-making made easy',
        icon: Vote,
        color: 'from-blue-500 to-cyan-500',
        bgGlow: 'blue',
        action: 'decisions'
      },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 pt-8">
            <h2 className="text-5xl font-black text-white mb-4">
              Choose Your Companion
            </h2>
            <p className="text-xl text-purple-200 mb-6">
              {tripData.tripName}
            </p>
            <div className="inline-flex items-center gap-6 text-purple-300 bg-white/5 backdrop-blur px-6 py-3 rounded-full border border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{tripData.members} members</span>
              </div>
              <div className="w-px h-6 bg-purple-400/30"></div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{tripData.duration} days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => {
                  if (feature.action === 'task-manager' && onNavigateToTasks) {
                    onNavigateToTasks();
                  } else {
                    handleFeatureSelect(feature.action);
                  }
                }}
                style={{ animationDelay: `${index * 100}ms` }}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden animate-fade-in"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                
                {/* Icon */}
                <div className={`relative inline-flex p-5 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="relative text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">
                  {feature.title}
                </h3>
                
                {/* Quote */}
                <p className="relative text-purple-100 italic text-sm leading-relaxed mb-4 min-h-[60px] border-l-4 border-purple-400/50 pl-4">
                  "{feature.quote}"
                </p>
                
                {/* Description */}
                <p className="relative text-gray-400 text-sm leading-relaxed mb-6">
                  {feature.desc}
                </p>
                
                {/* CTA */}
                <div className="relative flex items-center text-white font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <span className={`px-4 py-2 rounded-lg bg-gradient-to-r ${feature.color} shadow-lg`}>
                    Explore
                  </span>
                  <ArrowRight className="w-5 h-5 ml-3 transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-10 rounded-bl-full`}></div>
              </button>
            ))}
          </div>

          {/* Back to Welcome */}
          <div className="text-center">
            <button
              onClick={() => setCurrentView('welcome')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-xl border border-white/20 transition-all transform hover:scale-105"
            >
              <ArrowRight className="w-5 h-5 transform rotate-180" />
              Back to Start
            </button>
          </div>
        </div>

        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }

  // Main Dashboard (rest of the code remains the same...)
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

              {/* Other tabs remain the same... */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}