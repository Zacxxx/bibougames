import React, { useState } from 'react';
import { Home, Briefcase, Users, FileText, Map, Bell, Settings, DollarSign, BarChart, Calendar, ChevronDown, ChevronRight, Check, X, Plus, Search } from 'lucide-react';
import SterlingAssistant from './components/SterlingAssistant';
const MenuButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-200"
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

const Tab = ({ label, activeTab, setActiveTab }) => (
  <button
    className={`px-3 py-2 font-medium text-sm ${
      activeTab === label ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
    }`}
    onClick={() => setActiveTab(label)}
  >
    {label}
  </button>
);

const FloatingPanel = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div>{children}</div>
    </div>
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const ProjectCard = ({ title, description, progress, budget, team }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-2">{description}</p>
    <ProgressBar progress={progress} />
    <div className="flex justify-between items-center mt-2">
      <span className="text-sm text-gray-500">Budget: ${budget.toLocaleString()}</span>
      <span className="text-sm text-gray-500">Team: {team} members</span>
    </div>
  </div>
);

const Dashboard = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Active Projects</h3>
        <p className="text-2xl font-bold">12</p>
      </div>
      <div className="bg-green-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Team Members</h3>
        <p className="text-2xl font-bold">48</p>
      </div>
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Monthly Revenue</h3>
        <p className="text-2xl font-bold">$125,000</p>
      </div>
    </div>
    <h2 className="text-xl font-semibold mb-4">Key Projects</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ProjectCard
        title="AI Integration"
        description="Implementing AI across product line"
        progress={60}
        budget={500000}
        team={8}
      />
      <ProjectCard
        title="Market Expansion"
        description="Entering Asian markets"
        progress={35}
        budget={750000}
        team={12}
      />
    </div>
  </div>
);

const ProjectManagement = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "AI Integration", progress: 60, budget: 500000, team: 8 },
    { id: 2, name: "Market Expansion", progress: 35, budget: 750000, team: 12 },
    { id: 3, name: "Product Redesign", progress: 80, budget: 300000, team: 6 },
  ]);

  const [newProject, setNewProject] = useState({ name: '', budget: '' });

  const handleAddProject = () => {
    if (newProject.name && newProject.budget) {
      setProjects([...projects, {
        id: projects.length + 1,
        name: newProject.name,
        progress: 0,
        budget: parseInt(newProject.budget),
        team: 0
      }]);
      setNewProject({ name: '', budget: '' });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Project Management</h1>
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Add New Project</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
            className="flex-grow p-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Budget"
            value={newProject.budget}
            onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
            className="w-1/4 p-2 border rounded-lg"
          />
          <button
            onClick={handleAddProject}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
};

const TeamManagement = () => {
  const [team, setTeam] = useState([
    { id: 1, name: "John Doe", role: "Project Manager", projects: 3, tasks: 12 },
    { id: 2, name: "Jane Smith", role: "UI/UX Designer", projects: 2, tasks: 8 },
    { id: 3, name: "Mike Johnson", role: "Backend Developer", projects: 4, tasks: 15 },
  ]);

  const [newMember, setNewMember] = useState({ name: '', role: '' });

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      setTeam([...team, {
        id: team.length + 1,
        name: newMember.name,
        role: newMember.role,
        projects: 0,
        tasks: 0
      }]);
      setNewMember({ name: '', role: '' });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Add Team Member</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Name"
            value={newMember.name}
            onChange={(e) => setNewMember({...newMember, name: e.target.value})}
            className="flex-grow p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Role"
            value={newMember.role}
            onChange={(e) => setNewMember({...newMember, role: e.target.value})}
            className="flex-grow p-2 border rounded-lg"
          />
          <button
            onClick={handleAddMember}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => (
          <div key={member.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <p className="text-gray-600">{member.role}</p>
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>Projects: {member.projects}</span>
              <span>Tasks: {member.tasks}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TaskManagement = () => {
  const [activeTaskTab, setActiveTaskTab] = useState('Etapes');
  const [selectedEtape, setSelectedEtape] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const etapes = [
    { id: 1, name: "Projet Bridge - Lancement", progress: 30 },
    { id: 2, name: "Projet Bridge - Développement", progress: 0 },
    { id: 3, name: "Projet Bridge - Test", progress: 0 },
  ];

  const tasks = [
    { id: 1, etapeId: 1, name: "Définir les objectifs du projet", progress: 100 },
    { id: 2, etapeId: 1, name: "Créer le cahier des charges", progress: 75 },
    { id: 3, etapeId: 1, name: "Assembler l'équipe de développement", progress: 50 },
    { id: 4, etapeId: 2, name: "Mettre en place l'environnement de développement", progress: 0 },
    { id: 5, etapeId: 2, name: "Développer les fonctionnalités de base", progress: 0 },
  ];

  const subtasks = [
    { id: 1, taskId: 2, name: "Rédiger l'introduction", completed: true },
    { id: 2, taskId: 2, name: "Définir les spécifications techniques", completed: true },
    { id: 3, taskId: 2, name: "Établir le calendrier du projet", completed: false },
    { id: 4, taskId: 3, name: "Recruter un développeur frontend", completed: true },
    { id: 5, taskId: 3, name: "Recruter un développeur backend", completed: false },
    { id: 6, taskId: 3, name: "Recruter un designer UI/UX", completed: false },
  ];

  const TaskTab = ({ label, isActive, onClick }) => (
    <button
      className={`px-4 py-2 font-medium ${
        isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const EtapeItem = ({ etape }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{etape.name}</h3>
        <span className="text-sm text-gray-500">{etape.progress}%</span>
      </div>
      <ProgressBar progress={etape.progress} />
      <button
        className="mt-2 text-blue-600 hover:text-blue-800"
        onClick={() => {
          setSelectedEtape(etape);
          setActiveTaskTab('Taches');
        }}
      >
        Voir les tâches
      </button>
    </div>
  );

  const TaskItem = ({ task }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{task.name}</h3>
        <span className="text-sm text-gray-500">{task.progress}%</span>
      </div>
      <ProgressBar progress={task.progress} />
      <button
        className="mt-2 text-blue-600 hover:text-blue-800"
        onClick={() => {
          setSelectedTask(task);
          setActiveTaskTab('Sous-taches');
        }}
      >
        Voir les sous-tâches
      </button>
    </div>
  );

  const SubtaskItem = ({ subtask }) => (
    <div className="flex items-center bg-white p-4 rounded-lg shadow mb-4">
      <input
        type="checkbox"
        checked={subtask.completed}
        onChange={() => {}}
        className="mr-4"
      />
      <span className={subtask.completed ? 'line-through' : ''}>{subtask.name}</span>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestion des Tâches</h1>
      <div className="mb-4 border-b border-gray-200">
        <TaskTab label="Etapes" isActive={activeTaskTab === 'Etapes'} onClick={() => setActiveTaskTab('Etapes')} />
        <TaskTab label="Taches" isActive={activeTaskTab === 'Taches'} onClick={() => setActiveTaskTab('Taches')} />
        <TaskTab label="Sous-taches" isActive={activeTaskTab === 'Sous-taches'} onClick={() => setActiveTaskTab('Sous-taches')} />
      </div>

     {activeTaskTab === 'Etapes' && (
  <div>
    {etapes.map(etape => <EtapeItem key={etape.id} etape={etape} />)}
  </div>
)}

{activeTaskTab === 'Taches' && (
  <div>
    <h2 className="text-xl font-semibold mb-4">{selectedEtape ? selectedEtape.name : 'Toutes les tâches'}</h2>
    {tasks
      .filter(task => !selectedEtape || task.etapeId === selectedEtape.id)
      .map(task => <TaskItem key={task.id} task={task} />)}
  </div>
)}

{activeTaskTab === 'Sous-taches' && (
  <div>
    <h2 className="text-xl font-semibold mb-4">{selectedTask ? selectedTask.name : 'Toutes les sous-tâches'}</h2>
    {subtasks
      .filter(subtask => !selectedTask || subtask.taskId === selectedTask.id)
      .map(subtask => <SubtaskItem key={subtask.id} subtask={subtask} />)}
  </div>
)}
    </div>
  );
};

const FinancialManagement = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Project Alpha Payment", amount: 50000, type: "income" },
    { id: 2, description: "Office Rent", amount: 5000, type: "expense" },
    { id: 3, description: "Employee Salaries", amount: 75000, type: "expense" },
  ]);

  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', type: 'income' });

  const handleAddTransaction = () => {
    if (newTransaction.description && newTransaction.amount) {
      setTransactions([...transactions, {
        id: transactions.length + 1,
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type
      }]);
      setNewTransaction({ description: '', amount: '', type: 'income' });
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Financial Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Balance</h3>
          <p className="text-2xl font-bold text-blue-600">${balance.toLocaleString()}</p>
        </div>
      </div>
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Add Transaction</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
            className="flex-grow p-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
            className="w-1/4 p-2 border rounded-lg"
          />
          <select
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
            className="p-2 border rounded-lg"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button
            onClick={handleAddTransaction}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <span>{transaction.description}</span>
            <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Analytics = () => {
  const projectSuccessRate = 85;
  const employeeProductivity = 92;
  const customerSatisfaction = 4.7;
  const marketShare = 23;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Business Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-2">Project Success Rate</h3>
          <p className="text-3xl font-bold text-blue-600">{projectSuccessRate}%</p>
          <ProgressBar progress={projectSuccessRate} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-2">Employee Productivity</h3>
          <p className="text-3xl font-bold text-green-600">{employeeProductivity}%</p>
          <ProgressBar progress={employeeProductivity} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-2">Customer Satisfaction</h3>
          <p className="text-3xl font-bold text-yellow-600">{customerSatisfaction}/5</p>
          <ProgressBar progress={(customerSatisfaction / 5) * 100} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-2">Market Share</h3>
          <p className="text-3xl font-bold text-purple-600">{marketShare}%</p>
          <ProgressBar progress={marketShare} />
        </div>
      </div>
    </div>
  );
};

const WorldMapPanel = ({ onClose }) => (
  <FloatingPanel title="World Map" onClose={onClose}>
    <div className="space-y-4">
      <p className="text-gray-600">Interactive world map showing real-time user and project interactions.</p>
      <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">Interactive World Map Placeholder</span>
      </div>
      <div className="flex space-x-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          View Active Projects
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          Connect with Users
        </button>
      </div>
    </div>
  </FloatingPanel>
);

const NotificationsPanel = ({ onClose }) => {
  const notifications = [
    { id: 1, type: 'info', message: 'New team member joined: Sarah Wilson' },
    { id: 2, type: 'success', message: 'Project "AI Integration" reached 60% completion' },
    { id: 3, type: 'warning', message: 'Upcoming deadline: Market Expansion report due in 2 days' },
  ];

  return (
    <FloatingPanel title="Notifications" onClose={onClose}>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg ${
              notification.type === 'info'
                ? 'bg-blue-100 text-blue-800'
                : notification.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {notification.message}
          </div>
        ))}
        <button className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          View All Notifications
        </button>
      </div>
    </FloatingPanel>
  );
};

const SettingsPanel = ({ onClose }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <FloatingPanel title="Settings" onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    darkMode ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              <button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  notifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setNotifications(!notifications)}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notifications ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Company Settings</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Manage Integrations
            </button>
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Update Company Profile
            </button>
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
};

const SterlingAIPanel = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I'm Sterling, your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'user', text: input.trim() }]);
      setInput('');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: 'ai', text: "I'm processing your request. How else can I assist you?" },
        ]);
      }, 1000);
    }
  };

  return (
    <FloatingPanel title="Sterling AI Assistant" onClose={onClose}>
      <div className="flex flex-col h-[60vh]">
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded-lg ${
                message.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              } max-w-[80%]`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sterling..."
            className="flex-grow p-2 border rounded-lg"
          />
          <button
            onClick={handleSend}
            className="bg-black text-green-400 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </FloatingPanel>
  );
};

const BridgeUI = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [activePanel, setActivePanel] = useState(null);

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white bg-opacity-80 backdrop-blur-lg fixed top-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <img className="h-8 w-auto" src="https://www.logo-meta.com/wp-content/uploads/2021/11/logo-meta-facebook-embleme-bleu-3D-650x366-1.jpeg" alt="Bridge logo"/>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MenuButton icon={Home} label="Dashboard" onClick={() => setActiveTab('Dashboard')}/>
                <MenuButton icon={Briefcase} label="Projects" onClick={() => setActiveTab('Projects')}/>
                <MenuButton icon={Users} label="Team" onClick={() => setActiveTab('Team')}/>
                <MenuButton icon={Calendar} label="Tasks" onClick={() => setActiveTab('Tasks')}/>
                <MenuButton icon={DollarSign} label="Finances" onClick={() => setActiveTab('Finances')}/>
                <MenuButton icon={BarChart} label="Analytics" onClick={() => setActiveTab('Analytics')}/>
                <MenuButton icon={Map} label="World Map" onClick={() => togglePanel('map')}/>
                <MenuButton icon={Bell} label="Notifications" onClick={() => togglePanel('notifications')}/>
                <MenuButton icon={Settings} label="Settings" onClick={() => togglePanel('settings')}/>
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'Dashboard' && <Dashboard/>}
            {activeTab === 'Projects' && <ProjectManagement/>}
            {activeTab === 'Team' && <TeamManagement/>}
            {activeTab === 'Tasks' && <TaskManagement/>}
            {activeTab === 'Finances' && <FinancialManagement/>}
            {activeTab === 'Analytics' && <Analytics/>}
          </div>
        </main>

        {activePanel === 'map' && <WorldMapPanel onClose={() => setActivePanel(null)}/>}
        {activePanel === 'notifications' && <NotificationsPanel onClose={() => setActivePanel(null)}/>}
        {activePanel === 'settings' && <SettingsPanel onClose={() => setActivePanel(null)}/>}

        <button
            onClick={() => setShowSterlingAssistant(true)}
            className="fixed bottom-4 right-4 bg-transparent rounded-full p-0 shadow-lg hover:opacity-80 transition-opacity"
        >
          <img
              src="https://i.imgur.com/PT4Mi7L.png"
              alt="Sterling Assistant"
              className="w-16 h-16"
          />
        </button>

        {activePanel === 'sterling' && <SterlingAssistant onClose={() => setActivePanel(null)}/>}
      </div>
  );
};

export default BridgeUI;