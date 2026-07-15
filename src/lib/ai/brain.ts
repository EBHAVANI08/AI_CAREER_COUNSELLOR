// ===== AI Agentic Brain — Multi-Agent Orchestrator =====
import type { UserProfile, AIRoutingResult, CareerPathStep, SuggestedAction, AssessmentAnalysis, ChatMessage } from '@/types';
import { riasecMbtiCombinations, careerFields, inDemandSkills } from './knowledge';

// ===== Agent System Prompts =====

const CAREER_ANALYST_PROMPT = `You are CareerAI's Career Analyst Agent — a senior career strategist specializing in the Indian job market with 20+ years of experience guiding students and professionals across India.

EXPERTISE:
- Career trajectory planning for Indian students (Class 10 onward) and working professionals
- Deep knowledge of Indian education system: CBSE, ICSE, State Boards, and their impact on career pathways
- Understanding of tier-1 vs tier-2 college dynamics and their career implications in India
- Salary benchmarking across Indian cities: Bangalore, Mumbai, Delhi-NCR, Hyderabad, Pune, Chennai
- Knowledge of Indian hiring cycles: campus placements (July-March), off-campus hiring, referral networks
- Understanding of Indian work culture: hierarchical structures, notice periods (2-3 months), PF/gratuity

RULES:
1. Always provide salary ranges in LPA (Lakhs Per Annum) with city context
2. Reference specific Indian companies, startups, and MNCs with India offices
3. Mention relevant entrance exams and their timelines when discussing career transitions
4. Consider Indian family expectations and cultural factors in career advice
5. Address both service sector (IT, banking) and manufacturing sector opportunities
6. Include government job pathways (UPSC, SSC, state PSCs) when relevant
7. Factor in the growing startup ecosystem (Bangalore, Delhi, Mumbai, Hyderabad)

INDIAN MARKET DATA:
- Freshers: IT services (3-6 LPA), Product companies (8-25 LPA), Startups (5-15 LPA)
- Mid-level (3-7 yrs): IT (10-25 LPA), Product (20-45 LPA), Startups (15-35 LPA)
- Senior (8+ yrs): IT (25-50 LPA), Product (40-80 LPA), Leadership (60+ LPA)
- Top hiring companies: TCS, Infosys, Wipro, Google, Amazon, Microsoft, Flipkart, Razorpay, Swiggy

RESPONSE FORMAT: Provide structured, actionable career advice with specific steps, timelines, and Indian market context. Use bullet points and clear sections.`;

const PERSONALITY_PROFILER_PROMPT = `You are CareerAI's Personality Profiler Agent — an expert psychologist specializing in RIASEC (Holland Codes) and MBTI personality assessments for career guidance in the Indian context.

EXPERTISE:
- RIASEC interpretation: Realistic, Investigative, Artistic, Social, Enterprising, Conventional
- MBTI 16-type analysis with career implications specific to the Indian job market
- Cross-assessment synthesis: How RIASEC + MBTI combinations inform career fit
- Personality-career alignment research adapted for Indian cultural context
- Understanding how Indian family dynamics, societal expectations, and personality interact
- Knowledge of personality assessments used in Indian corporate hiring (SHL, Myers-Briggs)

RULES:
1. Never label any personality type as "better" or "worse" — all types have unique strengths
2. Provide specific career matches from the Indian job market for each type combination
3. Address cultural factors: Indian students often face family pressure to choose "safe" careers
4. Highlight both traditional and non-traditional career paths for each personality type
5. Include development areas with specific, actionable improvement strategies
6. Reference RIASEC-MBTI combinations from the knowledge base for deep insights
7. Consider the Indian context where personality expression may differ from Western norms

CROSS-ASSESSMENT SYNTHESIS APPROACH:
- When user has both RIASEC and MBTI results, identify the combination code (e.g., IA-INFP)
- Explain how the two assessments complement each other
- Highlight unique strengths of the combination
- Address any tensions between the two profiles
- Provide combined career recommendations with Indian market context

RESPONSE FORMAT: Empathetic, insightful analysis with clear personality-career connections, using the user's specific assessment scores. Always end with 3-5 actionable next steps.`;

const INDUSTRY_EXPERT_PROMPT = `You are CareerAI's Industry Expert Agent — a veteran Indian job market analyst with deep expertise across Technology, Finance, Healthcare, Manufacturing, and Services sectors.

EXPERTISE:
- Indian job market trends: hiring patterns, skill demand, salary benchmarks across sectors
- Sector-specific insights: IT/ITeS (largest employer), BFSI, Pharma, Healthcare, E-commerce, EdTech
- Knowledge of Indian startup ecosystem: Unicorn club (100+ unicorns), funding trends, hiring patterns
- Regional job markets: Bangalore (IT hub), Mumbai (Finance), Delhi-NCR (Diverse), Hyderabad (Tech+Pharma), Pune (IT+Auto), Chennai (Auto+IT)
- Indian education-to-employment gap and how to bridge it
- Government initiatives: Skill India, Digital India, Make in India and their career implications
- Understanding of Indian corporate hierarchy, appraisal cycles, and promotion timelines

SALARY BENCHMARKS (2024-25 Indian Market):
- Software Engineer: Fresher 4-12 LPA | Mid 10-25 LPA | Senior 25-60 LPA
- Data Scientist: Fresher 6-15 LPA | Mid 15-35 LPA | Senior 35-80 LPA
- Product Manager: Fresher 8-18 LPA | Mid 18-40 LPA | Senior 40-70 LPA
- UX Designer: Fresher 4-10 LPA | Mid 10-25 LPA | Senior 25-50 LPA
- Financial Analyst: Fresher 4-8 LPA | Mid 8-20 LPA | Senior 20-45 LPA
- Doctor (MBBS): Fresher 6-12 LPA | Mid 12-25 LPA | Senior 25-50+ LPA
- Management Consultant: Fresher 8-15 LPA | Mid 15-30 LPA | Senior 30-60 LPA

RULES:
1. Always provide specific salary ranges with city context and experience level
2. Name specific Indian companies and their hiring patterns
3. Mention relevant entrance exams and certifications for career transitions
4. Include both traditional and emerging career paths
5. Reference specific job platforms: Naukri, LinkedIn India, Instahyre, Wellfound
6. Consider the impact of remote work and global opportunities for Indian professionals

RESPONSE FORMAT: Data-driven, market-specific insights with concrete numbers, company names, and actionable market intelligence.`;

const RESUME_ARCHITECT_PROMPT = `You are CareerAI's Resume Architect Agent — a professional resume writer specializing in ATS-optimized resumes for the Indian job market.

EXPERTISE:
- ATS (Applicant Tracking System) optimization for Indian job platforms (Naukri, iCIMS, Taleo)
- Indian resume formats: academic-focused (fresher) vs experience-focused (professional)
- Understanding of Indian recruiter expectations: photo, personal details, academic scores, references
- Knowledge of Indian-specific resume elements: percentage/GPA conversion, board exam scores, backlogs disclosure
- Industry-specific resume strategies for Indian market: IT, BFSI, Consulting, Manufacturing, Government
- LinkedIn profile optimization for Indian recruiters

ATS OPTIMIZATION RULES:
1. Use standard section headers: Summary, Experience, Education, Skills, Projects, Achievements
2. Include relevant keywords from the job description naturally
3. Quantify achievements with specific numbers and percentages
4. Use standard fonts: Arial, Calibri, Times New Roman (10-12pt)
5. Avoid tables, graphics, headers/footers that ATS cannot parse
6. Keep format clean and scannable: bullet points, consistent formatting

INDIAN RESUME CONVENTIONS:
- Fresher resumes: 1 page, emphasis on education, projects, internships, certifications
- Professional resumes: 2-3 pages, emphasis on experience, impact, leadership
- Include: Name, Phone (+91), Email, LinkedIn, Location (City, State)
- Optional but common: GitHub, Portfolio, Languages known
- Academic details: Board exam percentages (10th, 12th), Graduation GPA/percentage
- For freshers: Include relevant coursework, mini/major projects, hackathons

RESPONSE FORMAT: Generate a complete, ATS-optimized resume in clean text format with clear sections. Include specific Indian-market keywords and quantified achievements.`;

const LEARNING_PATH_DESIGNER_PROMPT = `You are CareerAI's Learning Path Designer Agent — an expert career roadmap creator specializing in skill development pathways for the Indian education and professional ecosystem.

EXPERTISE:
- Career roadmaps from Class 10 onward: stream selection, college entrance, specialization, career entry
- Indian entrance exam preparation pathways: JEE, NEET, CAT, GATE, CLAT, UPSC, NID/UCEED
- Skill gap analysis specific to Indian job market requirements
- Knowledge of Indian learning resources: NPTEL, Coursera (IIT courses), Unacademy, Scaler, UpGrad
- Certification paths valued in Indian market: AWS, GCP, PMP, CFA, FRM, CA
- Understanding of Indian academic timelines: board exams (Feb-March), entrance exams (Apr-July), admissions (July-Aug)
- Bridge courses and alternative pathways for career switchers

CAREER ROADMAP STRUCTURE:
1. Foundation Phase (0-6 months): Core skills, fundamentals, tools setup
2. Learning Phase (6-12 months): Intermediate skills, projects, certifications
3. Practice Phase (12-18 months): Advanced skills, portfolio building, internships
4. Specialization Phase (18-24 months): Domain expertise, contributions, networking
5. Career Entry/Growth Phase (24+ months): Job search, interviews, continuous learning

INDIAN EXAM TIMELINES:
- JEE Main: Jan & Apr sessions | JEE Advanced: May | Results: June
- NEET UG: May | Results: June | Counseling: July-Aug
- CAT: Nov | Results: Jan | GD/PI: Feb-Apr
- GATE: Feb | Results: March | M.Tech admissions: Apr-June
- UPSC CSE Prelims: May | Mains: Sept | Interview: Mar-Apr

RULES:
1. Always provide a step-by-step roadmap with specific timelines
2. Include Indian-specific resources: NPTEL, Unacademy, Scaler, UpGrad, IIT online courses
3. Mention relevant entrance exams with their schedules
4. Include free and paid learning options with cost estimates in INR
5. Provide alternative pathways for different starting points
6. Include milestone checkpoints and self-assessment methods

RESPONSE FORMAT: Structured career roadmap with phases, milestones, resources, and timeline. Use clear headers and bullet points.`;

const ASSESSMENT_ANALYZER_PROMPT = `You are CareerAI's Assessment Analyzer Agent — a psychometric assessment specialist with deep expertise in interpreting and synthesizing results from multiple career assessments.

EXPERTISE:
- RIASEC (Holland Code) deep interpretation: primary code, secondary code, two-letter and three-letter codes
- MBTI cognitive function analysis: dominant, auxiliary, tertiary, and inferior functions
- Career Quiz field-matching analysis with Indian market alignment
- Cross-assessment synthesis: combining RIASEC + MBTI + Career Quiz for holistic career guidance
- Understanding assessment validity, reliability, and limitations
- Cultural adaptation of Western assessment frameworks for Indian students
- Knowledge of how Indian context influences personality expression and career choice

ANALYSIS FRAMEWORK:
1. Individual Assessment Deep Dive: Strengths, preferences, natural tendencies
2. Cross-Assessment Pattern Recognition: Where assessments agree and diverge
3. RIASEC-MBTI Combination Analysis: Using the combination code for deep insights
4. Career Field Alignment: Mapping assessment results to Indian job market fields
5. Skill Gap Identification: Current profile vs desired career path
6. Actionable Recommendations: Specific next steps based on combined analysis

CROSS-ASSESSMENT SYNTHESIS:
- When RIASEC and MBTI align (e.g., Investigative + INTP = strong research orientation)
- When they diverge (e.g., Enterprising + INFP = creative entrepreneurship potential)
- How Career Quiz field preferences reinforce or challenge personality-based careers
- Identifying "hidden strengths" that emerge from the combination

RIASEC-MBTI COMBINATIONS (15+ in knowledge base):
- Each combination has a title, description, career matches, strengths, and development areas
- Use these as foundation, then add personalized insights based on specific scores
- Example: IA-INFP "The Creative Researcher" — research + values + creativity

RULES:
1. Never present assessment results as deterministic — they are guides, not destiny
2. Acknowledge that Indian students often have limited exposure to career options
3. Provide both "safe" and "bold" career suggestions
4. Include development areas with specific, actionable improvement strategies
5. Factor in Indian family and cultural context without reinforcing stereotypes
6. Always validate the user's self-perception alongside assessment results
7. End with 5 prioritized, actionable next steps

RESPONSE FORMAT: Comprehensive analysis with clear sections, specific scores referenced, cross-assessment synthesis, and actionable recommendations. Use empathetic but professional tone.`;

// ===== AI Singleton =====

let aiInstance: any = null;

async function getAI() {
  if (aiInstance) return aiInstance;
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  aiInstance = await ZAI.create();
  return aiInstance;
}

// ===== Core AI Call =====

interface AICallOptions {
  temperature?: number;
  maxTokens?: number;
}

async function callAI(messages: { role: string; content: string }[], options: AICallOptions = {}): Promise<string> {
  try {
    const ai = await getAI();
    const response = await ai.chat.completions.create({
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1000,
    });
    return response.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('AI call failed:', error);
    return '';
  }
}

// ===== Profile Context Builder =====

export function buildProfileContext(profile: UserProfile): string {
  const parts: string[] = [];
  parts.push(`User: ${profile.name || 'Student'}`);
  if (profile.country) parts.push(`Country: ${profile.countryName || profile.country}`);
  if (profile.userType) parts.push(`Type: ${profile.userType === 'school' ? 'School Student' : 'College Graduate'}`);
  if (profile.education) parts.push(`Education: ${profile.education}`);
  if (profile.targetRole) parts.push(`Target Role: ${profile.targetRole}`);
  if (profile.skills.length > 0) parts.push(`Skills: ${profile.skills.join(', ')}`);
  if (profile.interests.length > 0) parts.push(`Interests: ${profile.interests.join(', ')}`);
  if (profile.riasecResult) {
    const r = profile.riasecResult;
    parts.push(`RIASEC: Top ${r.topCode} (${r.topTwoCode}) | R=${r.scores.R} I=${r.scores.I} A=${r.scores.A} S=${r.scores.S} E=${r.scores.E} C=${r.scores.C}`);
  }
  if (profile.mbtiResult) {
    parts.push(`MBTI: ${profile.mbtiResult.type}`);
  }
  if (profile.careerQuizResult) {
    const top = profile.careerQuizResult.topFields.map(f => `${f.field}(${f.matchPercentage}%)`).join(', ');
    parts.push(`Career Quiz Top Fields: ${top}`);
  }
  return parts.join(' | ');
}

// ===== Orchestrator Routing =====

interface AgentScore {
  agent: string;
  score: number;
  keywords: string[];
}

const AGENT_KEYWORDS: Record<string, string[]> = {
  CAREER_ANALYST: ['career', 'job', 'switch', 'transition', 'growth', 'trajectory', 'plan', 'future', 'path', 'opportunity', 'promotion', 'next step', 'what should i do', 'career change', 'stream selection'],
  PERSONALITY_PROFILER: ['personality', 'riasec', 'mbti', 'type', 'holland', 'trait', 'behavior', 'style', 'who am i', 'strength', 'weakness', 'fit', 'suitable', 'my type'],
  INDUSTRY_EXPERT: ['salary', 'pay', 'package', 'lpa', 'company', 'market', 'trend', 'hire', 'recruit', 'industry', 'sector', 'demand', 'scope', 'growth rate', 'hiring'],
  RESUME_ARCHITECT: ['resume', 'cv', 'ats', 'cover letter', 'application', 'interview', 'portfolio', 'linkedin', 'bio', 'biodata'],
  LEARNING_PATH_DESIGNER: ['learn', 'course', 'certification', 'skill', 'roadmap', 'study', 'exam', 'prepare', 'entrance', 'jee', 'neet', 'cat', 'gate', 'upsc', 'training', 'internship', 'discover', 'unique course', 'short course', 'government course', 'nptel', 'swayam'],
  ASSESSMENT_ANALYZER: ['assessment', 'result', 'analysis', 'score', 'test', 'quiz', 'combine', 'cross', 'interpret', 'understand', 'meaning', 'report'],
};

export function orchestratorRoute(message: string, profile: UserProfile): AgentScore {
  const lowerMessage = message.toLowerCase();
  const scores: AgentScore[] = [];

  for (const [agent, keywords] of Object.entries(AGENT_KEYWORDS)) {
    let score = 0;
    const matchedKeywords: string[] = [];

    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        score += 3;
        matchedKeywords.push(keyword);
      }
    }

    // Context scoring based on profile
    if (agent === 'ASSESSMENT_ANALYZER' && (profile.riasecResult || profile.mbtiResult || profile.careerQuizResult)) {
      score += 2;
    }
    if (agent === 'CAREER_ANALYST' && profile.targetRole) {
      score += 2;
    }
    if (agent === 'LEARNING_PATH_DESIGNER' && profile.userType === 'school') {
      score += 1;
    }
    if (agent === 'RESUME_ARCHITECT' && profile.userType === 'college') {
      score += 1;
    }
    if (agent === 'INDUSTRY_EXPERT' && (lowerMessage.includes('salary') || lowerMessage.includes('lpa') || lowerMessage.includes('package'))) {
      score += 3;
    }

    scores.push({ agent, score, keywords: matchedKeywords });
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // If no strong match, default to CAREER_ANALYST
  if (scores[0].score === 0) {
    return { agent: 'CAREER_ANALYST', score: 1, keywords: [] };
  }

  return scores[0];
}

// ===== Agent Prompt Selector =====

function getAgentPrompt(agentName: string): string {
  const prompts: Record<string, string> = {
    CAREER_ANALYST: CAREER_ANALYST_PROMPT,
    PERSONALITY_PROFILER: PERSONALITY_PROFILER_PROMPT,
    INDUSTRY_EXPERT: INDUSTRY_EXPERT_PROMPT,
    RESUME_ARCHITECT: RESUME_ARCHITECT_PROMPT,
    LEARNING_PATH_DESIGNER: LEARNING_PATH_DESIGNER_PROMPT,
    ASSESSMENT_ANALYZER: ASSESSMENT_ANALYZER_PROMPT,
  };
  return prompts[agentName] || CAREER_ANALYST_PROMPT;
}

// ===== Main Agentic Chat =====

export async function agenticChat(
  message: string,
  profile: UserProfile,
  history: ChatMessage[] = []
): Promise<{ content: string; suggestedActions: SuggestedAction[]; agentUsed: string; confidence: number }> {
  const routing = orchestratorRoute(message, profile);
  const agentPrompt = getAgentPrompt(routing.agent);
  const profileContext = buildProfileContext(profile);

  // Build messages array
  const systemMessage = `${agentPrompt}\n\nUSER PROFILE CONTEXT:\n${profileContext}\n\nINSTRUCTIONS: Respond concisely and helpfully. Use Indian market data. Provide specific, actionable advice. If the user asks about something outside your expertise, acknowledge it and suggest what they should explore instead.`;

  const chatMessages = history.slice(-10).map(m => ({
    role: m.role === 'user' ? 'user' as const : 'assistant' as const,
    content: m.content,
  }));

  const aiMessages = [
    { role: 'system', content: systemMessage },
    ...chatMessages,
    { role: 'user', content: message },
  ];

  const aiResponse = await callAI(aiMessages, { temperature: 0.7, maxTokens: 800 });

  const content = aiResponse || generateIntelligentFallback(message, profile);
  const suggestedActions = extractSuggestedActions(content, profile);
  const confidence = Math.min(routing.score / 10, 1);

  return {
    content,
    suggestedActions,
    agentUsed: routing.agent,
    confidence,
  };
}

// ===== Career Path Generator =====

export async function generateCareerPath(targetRole: string, profile: UserProfile): Promise<CareerPathStep[]> {
  const profileContext = buildProfileContext(profile);

  const aiMessages = [
    { role: 'system', content: LEARNING_PATH_DESIGNER_PROMPT },
    { role: 'user', content: `Create a detailed 5-step career roadmap for becoming a "${targetRole}" in India.\n\nMy Profile: ${profileContext}\n\nRespond with ONLY a JSON array of 5 steps. Each step must have: title, description (2-3 sentences), timeline (e.g., "Month 1-3"), skills (array of 3-4 skills), milestones (array of 2-3 milestones), resources (array of 2-3 Indian-specific resources).\n\nExample format:\n[{"title":"Step 1","description":"...","timeline":"Month 1-3","skills":["skill1"],"milestones":["milestone1"],"resources":["resource1"]}]` },
  ];

  const aiResponse = await callAI(aiMessages, { temperature: 0.6, maxTokens: 1500 });

  if (aiResponse) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const steps = JSON.parse(jsonMatch[0]);
        if (Array.isArray(steps) && steps.length > 0) {
          return steps.map((step: any, index: number) => ({
            id: `step-${index + 1}`,
            title: step.title || `Step ${index + 1}`,
            description: step.description || '',
            timeline: step.timeline || `Phase ${index + 1}`,
            skills: Array.isArray(step.skills) ? step.skills : [],
            milestones: Array.isArray(step.milestones) ? step.milestones : [],
            resources: Array.isArray(step.resources) ? step.resources : [],
            completed: false,
          }));
        }
      }
    } catch (e) {
      console.error('Failed to parse AI career path:', e);
    }
  }

  // Fallback: Generate a structured 5-step path
  return generateFallbackCareerPath(targetRole, profile);
}

function generateFallbackCareerPath(targetRole: string, profile: UserProfile): CareerPathStep[] {
  const role = targetRole.toLowerCase();
  const isTech = ['developer', 'engineer', 'programmer', 'software', 'data', 'ml', 'ai', 'devops', 'cloud'].some(k => role.includes(k));
  const isDesign = ['designer', 'ux', 'ui', 'product design', 'graphic'].some(k => role.includes(k));
  const isManagement = ['manager', 'consultant', 'analyst', 'product'].some(k => role.includes(k));

  const baseSteps: CareerPathStep[] = [
    {
      id: 'step-1',
      title: 'Foundation & Fundamentals',
      description: `Build the core skills and knowledge needed for ${targetRole}. Focus on understanding fundamental concepts and setting up your learning environment.`,
      timeline: 'Month 1-3',
      skills: isTech ? ['Programming basics', 'Problem-solving', 'Version Control (Git)'] : isDesign ? ['Design principles', 'Figma basics', 'User research'] : ['Business fundamentals', 'Analytical thinking', 'Communication'],
      milestones: ['Complete foundational course', 'Build first small project', 'Set up development environment'],
      resources: ['NPTEL free courses', 'Coursera IIT series', 'YouTube tutorials'],
      completed: false,
    },
    {
      id: 'step-2',
      title: 'Core Skill Development',
      description: `Deep dive into the primary skills required for ${targetRole}. Start building practical projects and gain hands-on experience.`,
      timeline: 'Month 4-6',
      skills: isTech ? ['Data Structures & Algorithms', 'Core technology stack', 'Database fundamentals'] : isDesign ? ['Interaction design', 'Prototyping', 'Design systems'] : ['Domain expertise', 'Data analysis', 'Project management'],
      milestones: ['Complete 2-3 portfolio projects', 'Earn a relevant certification', 'Contribute to open-source or community'],
      resources: ['Scaler Academy', 'Udemy courses', 'Industry blogs & documentation'],
      completed: false,
    },
    {
      id: 'step-3',
      title: 'Advanced Skills & Portfolio',
      description: `Master advanced concepts and build a strong portfolio that showcases your expertise in ${targetRole}. Start networking and seeking mentorship.`,
      timeline: 'Month 7-12',
      skills: isTech ? ['System design', 'Advanced algorithms', 'Cloud computing'] : isDesign ? ['Advanced prototyping', 'User testing', 'Accessibility'] : ['Strategic thinking', 'Leadership', 'Stakeholder management'],
      milestones: ['Build 3 significant projects', 'Get portfolio reviewed by professionals', 'Attend industry meetups/conferences'],
      resources: ['GitHub for projects', 'LinkedIn networking', 'Industry conferences (NASSCOM, etc.)'],
      completed: false,
    },
    {
      id: 'step-4',
      title: 'Specialization & Industry Experience',
      description: `Choose a specialization within ${targetRole} and gain real-world experience through internships, freelancing, or open-source contributions.`,
      timeline: 'Month 13-18',
      skills: isTech ? ['Specialized domain skills', 'CI/CD pipelines', 'Performance optimization'] : isDesign ? ['Specialized design area', 'Design leadership', 'Cross-functional collaboration'] : ['Industry certifications', 'Advanced analytics', 'Client management'],
      milestones: ['Complete internship/freelance project', 'Earn industry-recognized certification', 'Build professional network of 50+ connections'],
      resources: ['Internshala for internships', 'Upwork for freelancing', 'AWS/GCP certification paths'],
      completed: false,
    },
    {
      id: 'step-5',
      title: 'Career Launch & Growth',
      description: `Prepare for job applications, interviews, and successfully launch your career as a ${targetRole} in the Indian market.`,
      timeline: 'Month 19-24',
      skills: isTech ? ['Interview preparation', 'System design interviews', 'Technical communication'] : isDesign ? ['Design challenges', 'Portfolio presentation', 'Interview skills'] : ['Case interviews', 'Resume optimization', 'Negotiation skills'],
      milestones: ['Apply to 20+ relevant positions', 'Clear 3+ technical interviews', 'Receive and evaluate offers'],
      resources: ['Naukri.com & LinkedIn Jobs', 'Instahyre for product companies', 'Glassdoor for salary research'],
      completed: false,
    },
  ];

  return baseSteps;
}

// ===== AI Resume Generator =====

export async function generateAIResume(data: {
  name: string; email: string; phone: string; summary: string;
  education: string; skills: string; experience: string; projects: string; achievements: string;
}, profile: UserProfile): Promise<string> {
  const profileContext = buildProfileContext(profile);

  const aiMessages = [
    { role: 'system', content: RESUME_ARCHITECT_PROMPT },
    { role: 'user', content: `Generate a professional, ATS-optimized resume for the Indian job market with the following details:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Professional Summary: ${data.summary}
Education: ${data.education}
Skills: ${data.skills}
Experience: ${data.experience}
Projects: ${data.projects}
Achievements: ${data.achievements}

Profile Context: ${profileContext}

Generate a complete resume in clean text format with clear section headers. Make it ATS-friendly with relevant keywords. Quantify achievements where possible. Tailor it for the Indian job market.` },
  ];

  const aiResponse = await callAI(aiMessages, { temperature: 0.5, maxTokens: 1500 });

  if (aiResponse) return aiResponse;

  // Fallback resume template
  return `=======================================
${data.name.toUpperCase()}
=======================================
📧 ${data.email} | 📱 ${data.phone}
${profile.targetRole ? `🎯 Target Role: ${data.targetRole}` : ''}

---------------------------------------
PROFESSIONAL SUMMARY
---------------------------------------
${data.summary || 'Motivated professional seeking opportunities to contribute and grow in a dynamic organization.'}

---------------------------------------
EDUCATION
---------------------------------------
${data.education || 'Details to be added'}

---------------------------------------
SKILLS
---------------------------------------
${data.skills || 'Skills to be added'}

---------------------------------------
EXPERIENCE
---------------------------------------
${data.experience || 'No professional experience yet. Seeking entry-level opportunities.'}

---------------------------------------
PROJECTS
---------------------------------------
${data.projects || 'Projects to be added'}

---------------------------------------
ACHIEVEMENTS
---------------------------------------
${data.achievements || 'Achievements to be added'}

---------------------------------------
Note: This resume was generated by CareerAI. Please review and customize before applying.`;
}

// ===== AI Router =====

export async function aiRouter(profile: UserProfile): Promise<AIRoutingResult> {
  const profileContext = buildProfileContext(profile);

  const aiMessages = [
    { role: 'system', content: CAREER_ANALYST_PROMPT },
    { role: 'user', content: `Based on this user profile, recommend the best career path and next steps:\n\n${profileContext}\n\nProvide:\n1. Primary recommended career path\n2. Secondary alternative path\n3. Confidence level (0-1)\n4. Reasoning (2-3 sentences)\n5. 3-5 recommended actions\n\nRespond in JSON format:\n{"primaryPath":"","secondaryPath":"","confidence":0.8,"reasoning":"","recommendedActions":[{"id":"1","label":"","section":"dashboard","description":""}]}` },
  ];

  const aiResponse = await callAI(aiMessages, { temperature: 0.6, maxTokens: 800 });

  if (aiResponse) {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          primaryPath: parsed.primaryPath || 'Technology & Software',
          secondaryPath: parsed.secondaryPath || 'Data Science & Analytics',
          confidence: parsed.confidence || 0.7,
          reasoning: parsed.reasoning || 'Based on your profile analysis.',
          recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : [],
        };
      }
    } catch (e) {
      console.error('Failed to parse AI routing:', e);
    }
  }

  // Fallback routing logic
  return generateFallbackRouting(profile);
}

function generateFallbackRouting(profile: UserProfile): AIRoutingResult {
  let primaryPath = 'Technology & Software Development';
  let secondaryPath = 'Data Science & Analytics';
  let confidence = 0.6;
  let reasoning = 'Based on your profile, we recommend exploring technology careers. Complete assessments for more personalized guidance.';

  if (profile.riasecResult) {
    const topCode = profile.riasecResult.topCode;
    if (topCode === 'I') { primaryPath = 'Data Science & Research'; secondaryPath = 'Software Engineering'; confidence = 0.8; }
    else if (topCode === 'A') { primaryPath = 'UX/UI Design & Creative Tech'; secondaryPath = 'Product Management'; confidence = 0.75; }
    else if (topCode === 'S') { primaryPath = 'Healthcare & Education'; secondaryPath = 'Human Resources'; confidence = 0.75; }
    else if (topCode === 'E') { primaryPath = 'Business Management & Entrepreneurship'; secondaryPath = 'Product Management'; confidence = 0.8; }
    else if (topCode === 'C') { primaryPath = 'Finance & Accounting'; secondaryPath = 'Operations Management'; confidence = 0.75; }
    else if (topCode === 'R') { primaryPath = 'Engineering & Manufacturing'; secondaryPath = 'Civil Services'; confidence = 0.7; }
    reasoning = `Based on your RIASEC profile (${profile.riasecResult.topTwoCode}), your strongest orientation is toward ${riasecMbtiCombinations[profile.riasecResult.topTwoCode + '-' + (profile.mbtiResult?.type || 'INTJ')]?.title || profile.riasecResult.topCode} careers.`;
  }

  if (profile.mbtiResult) {
    const mbti = profile.mbtiResult.type;
    if (['INTJ', 'INTP', 'ENTJ'].includes(mbti)) { secondaryPath = 'AI & Machine Learning'; }
    else if (['ENFP', 'ENTP'].includes(mbti)) { secondaryPath = 'Product Management & Startups'; }
    else if (['ISFP', 'INFP'].includes(mbti)) { secondaryPath = 'UX Design & Creative Fields'; }
    else if (['ESTJ', 'ENTJ'].includes(mbti)) { secondaryPath = 'Business Leadership & Consulting'; }
    reasoning += ` Your MBTI type (${mbti}) aligns well with ${secondaryPath.toLowerCase()}.`;
    confidence = Math.min(confidence + 0.1, 0.95);
  }

  if (profile.careerQuizResult && profile.careerQuizResult.topFields.length > 0) {
    const topField = profile.careerQuizResult.topFields[0].field;
    const fieldData = careerFields[topField];
    if (fieldData) {
      primaryPath = fieldData.name;
      confidence = Math.min(confidence + 0.1, 0.95);
      reasoning += ` Your career quiz strongly indicates interest in ${fieldData.name}.`;
    }
  }

  const recommendedActions: SuggestedAction[] = [];
  if (!profile.riasecResult) recommendedActions.push({ id: '1', label: 'Take RIASEC Assessment', section: 'riasec', description: 'Discover your career personality type' });
  if (!profile.mbtiResult) recommendedActions.push({ id: '2', label: 'Take MBTI Assessment', section: 'mbti', description: 'Understand your work personality' });
  if (!profile.careerQuizResult) recommendedActions.push({ id: '3', label: 'Take Career Quiz', section: 'career-quiz', description: 'Find your ideal career field' });
  if (profile.riasecResult && profile.mbtiResult) recommendedActions.push({ id: '4', label: 'Chat with AI Coach', section: 'chat', description: 'Get personalized career guidance' });
  recommendedActions.push({ id: '5', label: 'Discover Courses & Programs', section: 'discover', description: 'Explore unique courses, internships & government programs' });

  return { primaryPath, secondaryPath, confidence, reasoning, recommendedActions };
}

// ===== Assessment Analyzer =====

export async function analyzeAssessmentResults(profile: UserProfile): Promise<AssessmentAnalysis> {
  const profileContext = buildProfileContext(profile);

  const aiMessages = [
    { role: 'system', content: ASSESSMENT_ANALYZER_PROMPT },
    { role: 'user', content: `Analyze this user's assessment results and provide comprehensive career guidance:\n\n${profileContext}\n\nProvide analysis in JSON format:\n{"summary":"","strengths":[],"careerMatches":[],"skillGaps":[],"recommendations":[],"crossAssessmentInsights":[]}` },
  ];

  const aiResponse = await callAI(aiMessages, { temperature: 0.6, maxTokens: 1200 });

  if (aiResponse) {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || 'Analysis complete.',
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          careerMatches: Array.isArray(parsed.careerMatches) ? parsed.careerMatches : [],
          skillGaps: Array.isArray(parsed.skillGaps) ? parsed.skillGaps : [],
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
          crossAssessmentInsights: Array.isArray(parsed.crossAssessmentInsights) ? parsed.crossAssessmentInsights : [],
        };
      }
    } catch (e) {
      console.error('Failed to parse AI assessment analysis:', e);
    }
  }

  // Fallback analysis
  return generateFallbackAnalysis(profile);
}

function generateFallbackAnalysis(profile: UserProfile): AssessmentAnalysis {
  const strengths: string[] = [];
  const careerMatches: string[] = [];
  const skillGaps: string[] = [];
  const recommendations: string[] = [];
  const crossAssessmentInsights: string[] = [];

  if (profile.riasecResult) {
    const code = profile.riasecResult.topCode;
    const desc = { R: 'practical execution', I: 'analytical thinking', A: 'creative innovation', S: 'people development', E: 'leadership & persuasion', C: 'systematic organization' };
    strengths.push(`Strong ${desc[code as keyof typeof desc] || 'problem-solving'} orientation (${profile.riasecResult.topTwoCode})`);

    if (code === 'I') careerMatches.push('Data Scientist', 'Software Developer', 'Research Analyst');
    else if (code === 'A') careerMatches.push('UX Designer', 'Product Designer', 'Creative Director');
    else if (code === 'S') careerMatches.push('HR Manager', 'Counselor', 'Healthcare Professional');
    else if (code === 'E') careerMatches.push('Business Manager', 'Sales Director', 'Entrepreneur');
    else if (code === 'C') careerMatches.push('Financial Analyst', 'Operations Manager', 'Accountant');
    else careerMatches.push('Engineer', 'Project Manager', 'Technical Architect');
  }

  if (profile.mbtiResult) {
    const mbti = profile.mbtiResult.type;
    crossAssessmentInsights.push(`Your MBTI type (${mbti}) ${profile.riasecResult ? `combined with your RIASEC code (${profile.riasecResult.topTwoCode}) ` : ''}suggests a unique blend of cognitive strengths.`);

    if (['INTJ', 'INTP'].includes(mbti)) { strengths.push('Strategic and analytical thinking'); skillGaps.push('Communication and collaboration skills'); }
    else if (['ENFJ', 'ESFJ'].includes(mbti)) { strengths.push('Strong interpersonal and leadership skills'); skillGaps.push('Technical depth and analytical skills'); }
    else if (['ISTP', 'ISFP'].includes(mbti)) { strengths.push('Practical problem-solving ability'); skillGaps.push('Long-term planning and networking'); }
  }

  if (profile.careerQuizResult) {
    const topField = profile.careerQuizResult.topFields[0];
    if (topField) {
      const fieldData = careerFields[topField.field];
      if (fieldData) {
        careerMatches.push(...fieldData.hotRoles.slice(0, 3));
        crossAssessmentInsights.push(`Your career quiz indicates strong interest in ${fieldData.name} (${topField.matchPercentage}% match), which is growing at ${fieldData.growthPercent}% in India.`);
      }
    }
  }

  if (strengths.length === 0) {
    strengths.push('Open to learning and exploration');
    recommendations.push('Complete RIASEC assessment to discover your career personality');
    recommendations.push('Take MBTI assessment to understand your work style');
    recommendations.push('Try the Career Quiz to explore your ideal field');
  }

  recommendations.push(
    'Build a strong portfolio with 3-5 relevant projects',
    'Network actively on LinkedIn with industry professionals',
    'Stay updated with Indian job market trends'
  );

  if (skillGaps.length === 0) {
    skillGaps.push('Industry-specific technical skills', 'Professional communication');
  }

  return {
    summary: `Based on your assessment profile, you show strong potential for ${careerMatches.length > 0 ? careerMatches.slice(0, 2).join(' and ') : 'a variety of career paths'}. ${crossAssessmentInsights.length > 0 ? crossAssessmentInsights[0] : 'Complete more assessments for deeper insights.'}`,
    strengths: strengths.slice(0, 5),
    careerMatches: careerMatches.slice(0, 6),
    skillGaps: skillGaps.slice(0, 4),
    recommendations: recommendations.slice(0, 5),
    crossAssessmentInsights: crossAssessmentInsights.slice(0, 3),
  };
}

// ===== Suggested Action Extractor =====

export function extractSuggestedActions(response: string, profile: UserProfile): SuggestedAction[] {
  const actions: SuggestedAction[] = [];
  const lower = response.toLowerCase();

  if (lower.includes('riasec') || lower.includes('personality assessment')) {
    actions.push({ id: 'sa-riasec', label: 'Take RIASEC Assessment', section: 'riasec', description: 'Discover your career personality type' });
  }
  if (lower.includes('mbti') || lower.includes('myers-briggs')) {
    actions.push({ id: 'sa-mbti', label: 'Take MBTI Assessment', section: 'mbti', description: 'Understand your work personality' });
  }
  if (lower.includes('career quiz') || lower.includes('career field')) {
    actions.push({ id: 'sa-quiz', label: 'Take Career Quiz', section: 'career-quiz', description: 'Find your ideal career field' });
  }
  if (lower.includes('resume') || lower.includes('cv')) {
    actions.push({ id: 'sa-resume', label: 'Build Your Resume', section: 'resume', description: 'Create an ATS-optimized resume' });
  }
  if (lower.includes('roadmap') || lower.includes('career path') || lower.includes('learning path')) {
    actions.push({ id: 'sa-path', label: 'Generate Career Roadmap', section: 'career-path', description: 'Get a personalized career roadmap' });
  }
  if (lower.includes('market') || lower.includes('salary') || lower.includes('industry') || lower.includes('trend')) {
    actions.push({ id: 'sa-insights', label: 'Discover Courses & Programs', section: 'discover', description: 'Explore courses, internships & government programs' });
  }

  // Add contextual actions based on profile completeness
  if (actions.length < 2) {
    if (!profile.riasecResult) {
      actions.push({ id: 'sa-riasec-auto', label: 'Take RIASEC Assessment', section: 'riasec', description: 'Discover your career personality' });
    }
    if (!profile.mbtiResult) {
      actions.push({ id: 'sa-mbti-auto', label: 'Take MBTI Test', section: 'mbti', description: 'Understand your personality type' });
    }
  }

  return actions.slice(0, 4);
}

// ===== Intelligent Fallback =====

function generateIntelligentFallback(message: string, profile: UserProfile): string {
  const lower = message.toLowerCase();

  // Greeting
  if (lower.match(/^(hi|hello|hey|good morning|good evening)/)) {
    return `Hello${profile.name ? ` ${profile.name}` : ''}! 👋 I'm CareerAI, your intelligent career counsellor. I can help you with:

• **Career Planning** — Explore career paths and make informed decisions
• **Assessment Analysis** — Understand your RIASEC, MBTI, and career quiz results
• **Salary Insights** — Get Indian market salary benchmarks and company data
• **Resume Building** — Create ATS-optimized resumes for the Indian market
• **Learning Paths** — Get structured roadmaps with Indian-specific resources
• **Industry Trends** — Stay updated on the Indian job market

What would you like to explore today?`;
  }

  // Salary queries
  if (lower.includes('salary') || lower.includes('package') || lower.includes('lpa')) {
    return `Here are current Indian market salary benchmarks (2024-25):

**Software Engineer:**
- Fresher: 4-12 LPA | Mid-level: 10-25 LPA | Senior: 25-60 LPA

**Data Scientist:**
- Fresher: 6-15 LPA | Mid-level: 15-35 LPA | Senior: 35-80 LPA

**Product Manager:**
- Fresher: 8-18 LPA | Mid-level: 18-40 LPA | Senior: 40-70 LPA

**UX Designer:**
- Fresher: 4-10 LPA | Mid-level: 10-25 LPA | Senior: 25-50 LPA

*Note: Salaries vary significantly by city (Bangalore/Delhi pay more), company type (product > service), and skills.*

Would you like salary insights for a specific role?`;
  }

  // Career change
  if (lower.includes('career change') || lower.includes('switch') || lower.includes('transition')) {
    return `Career transitions are increasingly common in India! Here's a strategic approach:

1. **Assess Your Transferable Skills** — Identify what carries over to your target field
2. **Bridge the Gap** — Use platforms like Scaler, UpGrad, or Coursera for targeted upskilling
3. **Build Portfolio Evidence** — Projects speak louder than certificates in India
4. **Leverage Your Network** — LinkedIn and referrals are the #1 hiring channel in India
5. **Consider Lateral Moves** — Sometimes a side-step leads to the big leap

*Indian context: 60% of tech professionals consider career switches within 5 years.*

Would you like me to create a specific transition roadmap?`;
  }

  // Exam/entrance related
  if (lower.includes('exam') || lower.includes('jee') || lower.includes('neet') || lower.includes('cat') || lower.includes('gate')) {
    return `Here are key Indian entrance exam timelines:

**Engineering:** JEE Main (Jan & Apr) → JEE Advanced (May) → Admissions (July)
**Medical:** NEET UG (May) → Counseling (July-Aug)
**MBA:** CAT (Nov) → GD/PI (Feb-Apr) → Admissions (May-June)
**M.Tech:** GATE (Feb) → M.Tech admissions (Apr-June)
**Civil Services:** UPSC Prelims (May) → Mains (Sept) → Interview (Mar-Apr)

Preparation tips:
• Start 12-18 months before the exam
• Use NPTEL (free) + Unacademy for structured prep
• Practice previous year papers — they repeat patterns
• Join study groups on Telegram/Discord for peer learning

Which exam are you preparing for? I can provide more specific guidance.`;
  }

  // Default fallback
  return `That's a great question! Based on your profile, here are my thoughts:

**Key Considerations for the Indian Market:**
• The Indian job market is rapidly evolving with 25%+ growth in tech roles
• Skill-based hiring is increasing — degrees matter less than demonstrable skills
• Remote work has opened global opportunities for Indian professionals

**Recommended Next Steps:**
1. Complete your assessments (RIASEC, MBTI, Career Quiz) for personalized insights
2. Build a strong portfolio with real-world projects
3. Network actively on LinkedIn India
4. Stay updated with industry trends through our Market Insights section

Would you like me to dive deeper into any specific aspect of your career journey?`;
}
