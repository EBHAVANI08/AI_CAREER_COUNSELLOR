'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { ArrowLeft, Loader2, FileText, Copy, Download, Sparkles } from 'lucide-react';

export default function ResumeBuilder() {
  const {
    resumeContent, setResumeContent, navigateTo, goBack,
    user, userType, riasecResult, mbtiResult, careerQuizResult,
    skills, interests, education, targetRole,
  } = useStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    summary: '',
    education: education || '',
    skills: skills.join(', '),
    experience: '',
    projects: '',
    achievements: '',
  });

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const profile = {
        name: user?.name,
        email: user?.email,
        userType,
        riasecResult,
        mbtiResult,
        careerQuizResult,
        skills,
        interests,
        education,
        targetRole,
      };

      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData, profile }),
      });

      const data = await res.json();
      if (data.content) {
        setResumeContent(data.content);
      }
    } catch (error) {
      console.error('Failed to generate resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!resumeContent) return;
    try {
      await navigator.clipboard.writeText(resumeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = resumeContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!resumeContent) return;
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'Enter your full name', type: 'text' },
    { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
    { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210', type: 'tel' },
  ];

  const textAreas = [
    { key: 'summary', label: 'Professional Summary', placeholder: 'Brief overview of your professional background and goals...', rows: 3 },
    { key: 'education', label: 'Education', placeholder: 'B.Tech Computer Science, IIT Delhi (2020-2024)\nClass 12 - CBSE, 95% (2020)', rows: 3 },
    { key: 'skills', label: 'Skills (comma-separated)', placeholder: 'Python, React, Node.js, SQL, Machine Learning, Docker', rows: 2 },
    { key: 'experience', label: 'Work Experience', placeholder: 'Software Engineer at Google India (Jul 2024 - Present)\n- Developed microservices for Google Pay\n- Reduced API latency by 40%', rows: 4 },
    { key: 'projects', label: 'Projects', placeholder: 'E-Commerce Platform (React + Node.js)\n- Built full-stack marketplace with 10K+ users\n- Implemented payment integration with Razorpay', rows: 4 },
    { key: 'achievements', label: 'Achievements', placeholder: 'JEE Advanced AIR 500\nHackathon Winner, TechFest 2023\nOpen-source contributor (500+ GitHub stars)', rows: 3 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="section-title">Resume Builder</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Form */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Resume Details
            </h3>

            <div className="space-y-4">
              {fields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="premium-input"
                  />
                </div>
              ))}

              {textAreas.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">{field.label}</label>
                  <textarea
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={field.rows}
                    className="premium-input resize-none"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="premium-btn w-full mt-6"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? 'Generating with AI...' : 'Generate with AI'}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4" /> Preview
              </h3>
              {resumeContent && (
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="btn-ghost text-xs py-1.5">
                    <Copy className="h-3 w-3" /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleDownload} className="btn-ghost text-xs py-1.5">
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              )}
            </div>

            {resumeContent ? (
              <div className="rounded-lg border border-gray-200 bg-white p-4 max-h-[600px] overflow-y-auto custom-scroll">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                  {resumeContent}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 mb-4 border border-gray-100">
                  <FileText className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No resume yet</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  Fill in your details on the left and click &ldquo;Generate with AI&rdquo; to create your ATS-optimized resume.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
