'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import type { ChatMessage, SuggestedAction } from '@/types';
import { Send, Trash2, Sparkles, Loader2, ArrowRight, MessageSquare, Zap } from 'lucide-react';

export default function ChatCoach() {
  const {
    chatMessages, addChatMessage, clearChat, chatLoading, setChatLoading,
    navigateTo, user, userType, riasecResult, mbtiResult, careerQuizResult,
    skills, interests, education, targetRole,
  } = useStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const suggestedPrompts = [
    'What career path suits me best?',
    'Tell me about AI/ML careers in India',
    'How do I prepare for JEE?',
    'What salary can I expect as a fresher?',
  ];

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || chatLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInput('');
    setChatLoading(true);

    try {
      const profile = {
        name: user?.name,
        email: user?.email,
        userType,
        country: useStore.getState().country,
        countryName: useStore.getState().countryName,
        riasecResult,
        mbtiResult,
        careerQuizResult,
        skills,
        interests,
        education,
        targetRole,
      };

      const history = chatMessages.slice(-10);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, profile }),
      });

      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.message || 'I apologize, but I couldn\'t process your request. Please try again.',
        timestamp: new Date().toISOString(),
        suggestedActions: data.suggestedActions || [],
        agentUsed: data.agentUsed,
      };

      addChatMessage(aiMessage);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      };
      addChatMessage(errorMessage);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Career Coach</h1>
            <span className="text-xs text-gray-500">Powered by 6 specialized agents</span>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="btn-ghost text-xs py-1.5 text-gray-500 hover:text-red-500"
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scroll space-y-4 pb-4">
        {chatMessages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 mb-4">
              <MessageSquare className="h-8 w-8 text-violet-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Start a conversation</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Ask me anything about careers, assessments, salary, or learning paths in the Indian market.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="card-hover text-left p-3 text-sm text-gray-700"
                >
                  <Sparkles className="h-3 w-3 text-violet-400 mb-1" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          <>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? '' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="h-3 w-3 text-violet-500" />
                      <span className="text-xs font-medium text-violet-600">CareerAI</span>
                      {msg.agentUsed && (
                        <span className="text-xs text-gray-400">• {msg.agentUsed.replace(/_/g, ' ')}</span>
                      )}
                    </div>
                  )}
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white rounded-tr-md'
                      : 'bg-gray-100 text-gray-800 rounded-tl-md'
                  }`}>
                    {msg.content}
                  </div>

                  {/* Suggested Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.suggestedActions.map((action: SuggestedAction) => (
                        <button
                          key={action.id}
                          onClick={() => navigateTo(action.section)}
                          className="inline-flex items-center gap-1 rounded-full bg-white border border-violet-200 px-3 py-1 text-xs font-medium text-violet-600 hover:bg-violet-50 transition-colors"
                        >
                          {action.label} <ArrowRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {chatLoading && (
              <div className="flex justify-start">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="h-3 w-3 text-violet-500" />
                    <span className="text-xs font-medium text-violet-600">CareerAI</span>
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-gray-400 typing-dot" />
                    <div className="h-2 w-2 rounded-full bg-gray-400 typing-dot" />
                    <div className="h-2 w-2 rounded-full bg-gray-400 typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-200 pt-4 mt-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about careers, salary, exams..."
            className="input-field flex-1"
            disabled={chatLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || chatLoading}
            className="btn-primary px-4"
          >
            {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
