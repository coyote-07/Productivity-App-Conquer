import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const WorkspaceContext = createContext();

export const useWorkspace = () => useContext(WorkspaceContext);

const DEFAULT_WORKSPACE_NAME = "My Command Center";

export const WorkspaceProvider = ({ children }) => {
  // --- STATE DECLARATIONS ---
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('landing'); // landing, auth, onboarding, dashboard, domains, tasks, kanban, calendar, notes, goals-habits, databases, templates, ai, settings
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedDomainId, setSelectedDomainId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Confetti / gamification trigger states
  const [levelUpToast, setLevelUpToast] = useState(null);
  const [celebrationToast, setCelebrationToast] = useState(null);

  // App data loaded from localStorage
  const [domains, setDomains] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [events, setEvents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [integrations, setIntegrations] = useState({
    googleCalendar: false,
    github: false,
    notion: false,
    gmail: false,
    spotify: false
  });
  
  // Pomodoro local state persistence
  const [pomodoro, setPomodoro] = useState({
    activeTaskId: null,
    duration: 1500, // 25 min default
    status: 'idle', // idle, running, paused
    mode: 'focus', // focus, short-break, long-break
    sessionsCount: 0,
    elapsed: 0,
    sound: 'rain' // ticking, rain, white-noise, silent
  });

  // --- INITIALIZATION ---
  useEffect(() => {
    // Load logged in user if any
    const storedUser = localStorage.getItem('conquer_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Auto routing if logged in
      setActiveSection(parsedUser.onboarded ? 'dashboard' : 'onboarding');
      loadWorkspaceData(parsedUser.id);
    }
  }, []);

  const loadWorkspaceData = (userId) => {
    const d = localStorage.getItem(`conquer_domains_${userId}`);
    const t = localStorage.getItem(`conquer_tasks_${userId}`);
    const p = localStorage.getItem(`conquer_projects_${userId}`);
    const n = localStorage.getItem(`conquer_notes_${userId}`);
    const e = localStorage.getItem(`conquer_events_${userId}`);
    const g = localStorage.getItem(`conquer_goals_${userId}`);
    const h = localStorage.getItem(`conquer_habits_${userId}`);
    const db = localStorage.getItem(`conquer_databases_${userId}`);
    const notif = localStorage.getItem(`conquer_notifications_${userId}`);
    const integ = localStorage.getItem(`conquer_integrations_${userId}`);
    const pomo = localStorage.getItem(`conquer_pomodoro_${userId}`);

    if (d) setDomains(JSON.parse(d));
    if (t) setTasks(JSON.parse(t));
    if (p) setProjects(JSON.parse(p));
    if (n) setNotes(JSON.parse(n));
    if (e) setEvents(JSON.parse(e));
    if (g) setGoals(JSON.parse(g));
    if (h) setHabits(JSON.parse(h));
    if (db) setDatabases(JSON.parse(db));
    if (notif) setNotifications(JSON.parse(notif));
    if (integ) setIntegrations(JSON.parse(integ));
    if (pomo) setPomodoro(JSON.parse(pomo));
  };

  // Sync back to localStorage helper
  const syncData = (key, data) => {
    if (!user) return;
    localStorage.setItem(`conquer_${key}_${user.id}`, JSON.stringify(data));
  };

  // Effect-based persistence to auto-save arrays whenever they change
  useEffect(() => { if (user) syncData('domains', domains); }, [domains, user]);
  useEffect(() => { if (user) syncData('tasks', tasks); }, [tasks, user]);
  useEffect(() => { if (user) syncData('projects', projects); }, [projects, user]);
  useEffect(() => { if (user) syncData('notes', notes); }, [notes, user]);
  useEffect(() => { if (user) syncData('events', events); }, [events, user]);
  useEffect(() => { if (user) syncData('goals', goals); }, [goals, user]);
  useEffect(() => { if (user) syncData('habits', habits); }, [habits, user]);
  useEffect(() => { if (user) syncData('databases', databases); }, [databases, user]);
  useEffect(() => { if (user) syncData('notifications', notifications); }, [notifications, user]);
  useEffect(() => { if (user) syncData('integrations', integrations); }, [integrations, user]);
  useEffect(() => { if (user) syncData('pomodoro', pomodoro); }, [pomodoro, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('conquer_user', JSON.stringify(user));
      // Apply theme to document
      if (user.theme === 'light') {
        document.documentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
      }
    }
  }, [user]);

  // --- XP & LEVEL SYSTEM ---
  const addXP = (amount) => {
    if (!user) return;
    const newXP = user.xp + amount;
    const nextLevelXP = user.level * 500;
    
    if (newXP >= nextLevelXP) {
      const excessXP = newXP - nextLevelXP;
      const nextLevel = user.level + 1;
      setUser(prev => ({
        ...prev,
        level: nextLevel,
        xp: excessXP
      }));
      // Trigger full level up celebration!
      setLevelUpToast({
        level: nextLevel,
        message: "You're unstoppable. Keep conquering!"
      });
      // Fire confetti multiple times
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.4 } }), 250);
    } else {
      setUser(prev => ({ ...prev, xp: newXP }));
      showToast(`+${amount} XP Earned!`);
    }
  };

  const showToast = (message) => {
    setCelebrationToast(message);
    setTimeout(() => setCelebrationToast(null), 3000);
  };

  // --- AUTH SERVICES (MOCK) ---
  const signUp = (name, email, password) => {
    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: null,
      level: 1,
      xp: 0,
      theme: 'dark',
      activeWorkspace: DEFAULT_WORKSPACE_NAME,
      onboarded: false
    };
    setUser(newUser);
    localStorage.setItem('conquer_user', JSON.stringify(newUser));
    setActiveSection('onboarding');
  };

  const logIn = (email, password) => {
    // Basic mock user retrieval or setup new if matching mock names
    const storedUser = localStorage.getItem('conquer_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.email === email) {
        setUser(parsed);
        loadWorkspaceData(parsed.id);
        setActiveSection(parsed.onboarded ? 'dashboard' : 'onboarding');
        return true;
      }
    }
    
    // Create static mock user if none stored
    const mockUser = {
      id: 'usr_default',
      name: email.split('@')[0] || 'Conqueror',
      email,
      avatar: null,
      level: 1,
      xp: 150,
      theme: 'dark',
      activeWorkspace: DEFAULT_WORKSPACE_NAME,
      onboarded: true
    };
    setUser(mockUser);
    localStorage.setItem('conquer_user', JSON.stringify(mockUser));
    loadWorkspaceData(mockUser.id);
    // Initialize default items if none found
    prefillWorkspaceData(mockUser.id, 'Personal productivity', DEFAULT_WORKSPACE_NAME);
    setActiveSection('dashboard');
    return true;
  };

  const logOut = () => {
    setUser(null);
    localStorage.removeItem('conquer_user');
    setActiveSection('landing');
  };

  const toggleTheme = () => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  // --- ONBOARDING & PRE-FILL ---
  const completeOnboarding = (useCase, workspaceName) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      onboarded: true,
      activeWorkspace: workspaceName || DEFAULT_WORKSPACE_NAME
    };
    setUser(updatedUser);
    prefillWorkspaceData(user.id, useCase, workspaceName || DEFAULT_WORKSPACE_NAME);
    setActiveSection('dashboard');
  };

  const prefillWorkspaceData = (userId, useCase, wsName) => {
    // Generate beautiful starter content based on onboarding choice
    let starterDomain = {
      id: 'dom_1',
      name: useCase === 'Student & learning' ? 'Academics & Study' : useCase === 'Engineering & dev work' ? 'Engineering' : 'Life Admin',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
      icon: '🧠',
      status: 'active',
      link: 'https://conquer.app',
      properties: [
        { id: 'p1', name: 'Priority', type: 'select', value: 'High' }
      ],
      comments: [
        { id: 'c1', user: 'Conquer Bot', text: 'Welcome to your new domain! This is your space to organize topics and files.', time: new Date().toISOString() }
      ]
    };

    let starterTasks = [
      {
        id: 'task_1',
        title: 'Review the Conquer onboarding guide',
        status: 'todo',
        priority: 'high',
        dueDate: new Date().toISOString().split('T')[0],
        assignees: ['Conqueror'],
        domainId: 'dom_1',
        cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',
        icon: '📚',
        subtasks: [
          { id: 's1', title: 'Explore the Left Sidebar navigation', done: false },
          { id: 's2', title: 'Start a Pomodoro session in the Right Panel', done: false },
          { id: 's3', title: 'Try searching with Cmd+K spotlight search', done: false }
        ],
        comments: [],
        timeLogs: [],
        pomodorosCount: 0
      },
      {
        id: 'task_2',
        title: 'Define your top 3 goals for this week',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        assignees: ['Conqueror'],
        domainId: 'dom_1',
        subtasks: [],
        comments: [],
        timeLogs: [],
        pomodorosCount: 0
      },
      {
        id: 'task_3',
        title: 'Perform your first daily habit check-in',
        status: 'todo',
        priority: 'low',
        dueDate: new Date().toISOString().split('T')[0],
        assignees: ['Conqueror'],
        domainId: 'dom_1',
        subtasks: [],
        comments: [],
        timeLogs: [],
        pomodorosCount: 0
      }
    ];

    let starterNotes = [
      {
        id: 'note_1',
        title: 'Welcome to Conquer Notes 📝',
        content: `<h2>Master Your Work & Thoughts</h2>
<p>Conquer provides a robust writing interface. Use this space for project logs, ideas, or meeting notes.</p>
<div class="callout-block">
  <strong>Pro-tip:</strong> Select any text to activate the AI Writing Assistant, or type <code>/</code> to access block insert tools.
</div>
<h3>Suggested First Steps:</h3>
<ul>
  <li>Modify this note or click <strong>+ New Page</strong> in the sidebar.</li>
  <li>Link pages together to form a personal web of knowledge.</li>
</ul>`,
        cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
        icon: '📝',
        parentId: null,
        backlinks: [],
        wordCount: 78,
        readTime: 1
      }
    ];

    let starterGoals = [
      {
        id: 'goal_1',
        title: 'Build a solid productivity system',
        description: 'Complete onboarding, establish habits, and check off 10 tasks.',
        targetDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
        category: 'personal',
        domainId: 'dom_1',
        progress: 15,
        milestones: [
          { id: 'm1', title: 'Complete first onboarding task', completed: false },
          { id: 'm2', title: 'Log 4 focus sessions', completed: false },
          { id: 'm3', title: 'Establish 3 habits', completed: false }
        ]
      }
    ];

    let starterHabits = [
      {
        id: 'habit_1',
        name: 'Morning Planning',
        icon: '🌅',
        frequency: 'daily',
        category: 'productivity',
        targetStreak: 7,
        completions: [],
        streak: 0,
        longestStreak: 0
      },
      {
        id: 'habit_2',
        name: 'Deep Work Session',
        icon: '🧠',
        frequency: 'daily',
        category: 'productivity',
        targetStreak: 10,
        completions: [],
        streak: 0,
        longestStreak: 0
      },
      {
        id: 'habit_3',
        name: 'Hydrate 2L',
        icon: '💧',
        frequency: 'daily',
        category: 'health',
        targetStreak: 30,
        completions: [],
        streak: 0,
        longestStreak: 0
      }
    ];

    let starterDatabases = [
      {
        id: 'db_1',
        name: 'Topics & Resources',
        view: 'table',
        columns: [
          { name: 'Topic', type: 'text' },
          { name: 'Status', type: 'select' },
          { name: 'Category', type: 'multi-select' },
          { name: 'Due Date', type: 'date' }
        ],
        rows: [
          { Topic: 'System Design Overview', Status: 'in progress', Category: 'Engineering', 'Due Date': new Date().toISOString().split('T')[0] },
          { Topic: 'Product Launch Checklist', Status: 'not started', Category: 'Marketing', 'Due Date': new Date(Date.now() + 86400000).toISOString().split('T')[0] }
        ]
      }
    ];

    let starterNotif = [
      { id: 'nt_1', title: 'System Initialized', content: 'Your Conquer workspace has been successfully constructed.', unread: true, timestamp: new Date().toISOString() }
    ];

    setDomains([starterDomain]);
    setTasks(starterTasks);
    setProjects([]);
    setNotes(starterNotes);
    setEvents([]);
    setGoals(starterGoals);
    setHabits(starterHabits);
    setDatabases(starterDatabases);
    setNotifications(starterNotif);

    localStorage.setItem(`conquer_domains_${userId}`, JSON.stringify([starterDomain]));
    localStorage.setItem(`conquer_tasks_${userId}`, JSON.stringify(starterTasks));
    localStorage.setItem(`conquer_projects_${userId}`, JSON.stringify([]));
    localStorage.setItem(`conquer_notes_${userId}`, JSON.stringify(starterNotes));
    localStorage.setItem(`conquer_events_${userId}`, JSON.stringify([]));
    localStorage.setItem(`conquer_goals_${userId}`, JSON.stringify(starterGoals));
    localStorage.setItem(`conquer_habits_${userId}`, JSON.stringify(starterHabits));
    localStorage.setItem(`conquer_databases_${userId}`, JSON.stringify(starterDatabases));
    localStorage.setItem(`conquer_notifications_${userId}`, JSON.stringify(starterNotif));
  };

  // --- DOMAINS CRUD ---
  const addDomain = (name, cover, icon) => {
    const newDomain = {
      id: 'dom_' + Math.random().toString(36).substr(2, 9),
      name,
      cover: cover || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80',
      icon: icon || '🌐',
      status: 'active',
      link: '',
      properties: [],
      comments: []
    };
    setDomains(prev => [...prev, newDomain]);
    addXP(40);
  };

  const updateDomain = (id, updates) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDomain = (id) => {
    setDomains(prev => prev.filter(d => d.id !== id));
    // Clear domain relation on tasks
    setTasks(prev => prev.map(t => t.domainId === id ? { ...t, domainId: null } : t));
  };

  // --- TASKS CRUD ---
  const addTask = (title, dueDate = null, domainId = null, priority = 'medium', status = 'todo') => {
    const newTask = {
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      title,
      status,
      priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      assignees: ['Conqueror'],
      domainId: domainId || (domains[0] ? domains[0].id : null),
      subtasks: [],
      comments: [],
      timeLogs: [],
      pomodorosCount: 0
    };
    setTasks(prev => [...prev, newTask]);
    addXP(10);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        // If task is completed (done), reward XP
        if (updates.status === 'done' && t.status !== 'done') {
          setTimeout(() => {
            addXP(15);
            // Visual feedback
            confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
          }, 100);
        }
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // --- NOTES CRUD ---
  const addNote = (title, content = '', parentId = null) => {
    const newNote = {
      id: 'note_' + Math.random().toString(36).substr(2, 9),
      title: title || 'Untitled Note',
      content: content || '<h2>Untitled Note</h2><p>Start writing...</p>',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
      icon: '📝',
      parentId,
      backlinks: [],
      wordCount: 0,
      readTime: 1
    };
    setNotes(prev => [...prev, newNote]);
    setSelectedNoteId(newNote.id);
    addXP(20);
    return newNote.id;
  };

  const updateNote = (id, updates) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(notes[0]?.id || null);
  };

  // --- CALENDAR EVENTS CRUD ---
  const addEvent = (title, start, end, description = '') => {
    const newEvent = {
      id: 'evt_' + Math.random().toString(36).substr(2, 9),
      title,
      start,
      end,
      description,
      linkedTaskId: null,
      location: '',
      repeat: 'none'
    };
    setEvents(prev => [...prev, newEvent]);
    addXP(10);
  };

  const updateEvent = (id, updates) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // --- GOALS & HABITS CRUD ---
  const addGoal = (title, description, targetDate, category, domainId) => {
    const newGoal = {
      id: 'gol_' + Math.random().toString(36).substr(2, 9),
      title,
      description,
      targetDate,
      category: category || 'personal',
      domainId: domainId || null,
      progress: 0,
      milestones: []
    };
    setGoals(prev => [...prev, newGoal]);
    addXP(50);
  };

  const updateGoal = (id, updates) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const updated = { ...g, ...updates };
        // Reward big points if goal is 100% completed
        if (updates.progress === 100 && g.progress < 100) {
          setTimeout(() => {
            addXP(200);
            confetti({ particleCount: 150, spread: 80 });
          }, 100);
        }
        return updated;
      }
      return g;
    }));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addHabit = (name, icon, frequency, category) => {
    const newHabit = {
      id: 'hab_' + Math.random().toString(36).substr(2, 9),
      name,
      icon: icon || '🎯',
      frequency: frequency || 'daily',
      category: category || 'productivity',
      targetStreak: 15,
      completions: [],
      streak: 0,
      longestStreak: 0
    };
    setHabits(prev => [...prev, newHabit]);
    addXP(25);
  };

  const toggleHabit = (id, dateStr) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completions = [...h.completions];
        const index = completions.indexOf(dateStr);
        let newCompletions;
        if (index > -1) {
          newCompletions = completions.filter(c => c !== dateStr);
        } else {
          newCompletions = [...completions, dateStr].sort();
          // XP reward
          setTimeout(() => addXP(15), 50);
        }

        // Compute streak
        const streakData = calculateStreak(newCompletions);
        
        return {
          ...h,
          completions: newCompletions,
          streak: streakData.currentStreak,
          longestStreak: Math.max(h.longestStreak, streakData.currentStreak)
        };
      }
      return h;
    }));
  };

  const calculateStreak = (completions) => {
    if (completions.length === 0) return { currentStreak: 0 };
    
    // Sort and check consecutive days backwards from today
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if today or yesterday was completed
    let checkDate = new Date(today);
    const hasToday = completions.includes(formatDate(checkDate));
    
    checkDate.setDate(checkDate.getDate() - 1);
    const hasYesterday = completions.includes(formatDate(checkDate));
    
    if (!hasToday && !hasYesterday) return { currentStreak: 0 };

    // Set starting check point
    let startCheck = hasToday ? new Date(today) : checkDate;
    
    while (true) {
      const dateStr = formatDate(startCheck);
      if (completions.includes(dateStr)) {
        currentStreak++;
        startCheck.setDate(startCheck.getDate() - 1);
      } else {
        break;
      }
    }
    
    return { currentStreak };
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // --- DATABASES CRUD ---
  const addDatabase = (name, columns = [], rows = []) => {
    const newDb = {
      id: 'db_' + Math.random().toString(36).substr(2, 9),
      name,
      view: 'table',
      columns: columns.length ? columns : [
        { name: 'Name', type: 'text' },
        { name: 'Status', type: 'select' }
      ],
      rows: rows.length ? rows : []
    };
    setDatabases(prev => [...prev, newDb]);
    addXP(50);
  };

  const updateDatabase = (id, updates) => {
    setDatabases(prev => prev.map(db => db.id === id ? { ...db, ...updates } : db));
  };

  const deleteDatabase = (id) => {
    setDatabases(prev => prev.filter(db => db.id !== id));
  };

  // --- GENERAL FUNCTIONS ---
  const addComment = (type, targetId, text) => {
    const newComment = {
      id: 'com_' + Math.random().toString(36).substr(2, 9),
      user: user?.name || 'Conqueror',
      text,
      time: new Date().toISOString()
    };

    if (type === 'domain') {
      setDomains(prev => prev.map(d => d.id === targetId ? { ...d, comments: [...(d.comments || []), newComment] } : d));
    } else if (type === 'task') {
      setTasks(prev => prev.map(t => t.id === targetId ? { ...t, comments: [...(t.comments || []), newComment] } : t));
    }
    showToast("Comment added!");
  };

  const toggleIntegration = (key) => {
    setIntegrations(prev => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(`${key.charAt(0).toUpperCase() + key.slice(1)} Integration ${next[key] ? 'Connected' : 'Disconnected'}`);
      return next;
    });
  };

  const addNotification = (title, content) => {
    const newNotif = {
      id: 'nt_' + Math.random().toString(36).substr(2, 9),
      title,
      content,
      unread: true,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Export Context Values
  return (
    <WorkspaceContext.Provider value={{
      user,
      setUser,
      activeSection,
      setActiveSection,
      sidebarCollapsed,
      setSidebarCollapsed,
      rightPanelCollapsed,
      setRightPanelCollapsed,
      selectedNoteId,
      setSelectedNoteId,
      selectedDomainId,
      setSelectedDomainId,
      selectedTaskId,
      setSelectedTaskId,
      searchOpen,
      setSearchOpen,
      levelUpToast,
      setLevelUpToast,
      celebrationToast,
      setCelebrationToast,
      
      // Data sets
      domains,
      setDomains,
      tasks,
      setTasks,
      projects,
      setProjects,
      notes,
      setNotes,
      events,
      setEvents,
      goals,
      setGoals,
      habits,
      setHabits,
      databases,
      setDatabases,
      notifications,
      setNotifications,
      integrations,
      pomodoro,
      setPomodoro,

      // Operations
      signUp,
      logIn,
      logOut,
      toggleTheme,
      completeOnboarding,
      addXP,
      showToast,

      // CRUD operations
      addDomain, updateDomain, deleteDomain,
      addTask, updateTask, deleteTask,
      addNote, updateNote, deleteNote,
      addEvent, updateEvent, deleteEvent,
      addGoal, updateGoal, deleteGoal,
      addHabit, toggleHabit, deleteHabit,
      addDatabase, updateDatabase, deleteDatabase,
      addComment,
      toggleIntegration,
      markAllNotificationsAsRead,
      addNotification
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
