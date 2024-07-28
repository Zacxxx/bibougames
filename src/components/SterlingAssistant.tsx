import React, { useState } from 'react';
import { Send, CheckCircle, XCircle, AlertTriangle, MessageCircle, FileText, BarChart, Calendar } from 'lucide-react';

const SterlingAIPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I'm Sterling, your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [automationTasks, setAutomationTasks] = useState([
    { id: 1, name: 'Daily Report Generation', status: 'active' },
    { id: 2, name: 'Weekly Team Performance Analysis', status: 'inactive' },
  ]);
  const [checkItems, setCheckItems] = useState([
    { id: 1, name: 'Project Deadlines', status: 'ok' },
    { id: 2, name: 'Budget Overruns', status: 'warning' },
    { id: 3, name: 'Team Productivity', status: 'error' },
  ]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'user', text: input.trim() }]);
      setInput('');
      // Simuler une réponse de l'IA
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: 'ai', text: "I'm processing your request. How else can I assist you?" },
        ]);
      }, 1000);
    }
  };

  const toggleAutomationTask = (id) => {
    setAutomationTasks(automationTasks.map(task => 
      task.id === id ? { ...task, status: task.status === 'active' ? 'inactive' : 'active' } : task
    ));
  };

  const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
        isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
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
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        );
      case 'automation':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Automation Tasks</h3>
            {automationTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                <span>{task.name}</span>
                <button
                  onClick={() => toggleAutomationTask(task.id)}
                  className={`px-3 py-1 rounded-md ${
                    task.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {task.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Add New Automation Task
            </button>
          </div>
        );
      case 'checks':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Checks</h3>
            {checkItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                <span>{item.name}</span>
                {item.status === 'ok' && <CheckCircle className="text-green-500" />}
                {item.status === 'warning' && <AlertTriangle className="text-yellow-500" />}
                {item.status === 'error' && <XCircle className="text-red-500" />}
              </div>
            ))}
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Run All Checks
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sterling AI Assistant</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      <div className="flex space-x-2 mb-4">
        <TabButton icon={MessageCircle} label="Chat" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <TabButton icon={Calendar} label="Automation" isActive={activeTab === 'automation'} onClick={() => setActiveTab('automation')} />
        <TabButton icon={CheckCircle} label="Checks" isActive={activeTab === 'checks'} onClick={() => setActiveTab('checks')} />
      </div>
      {renderTabContent()}
    </div>
  );
};

export default SterlingAIPanel;