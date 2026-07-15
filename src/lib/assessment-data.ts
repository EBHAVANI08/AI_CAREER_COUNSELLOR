// ===== Assessment Data — RIASEC, MBTI, Career Quiz =====

export interface AssessmentQuestion {
  id: number;
  text: string;
  category: string;
}

export interface MBTIQuestion {
  id: number;
  text: string;
  optionA: { text: string; dimension: string; value: string };
  optionB: { text: string; dimension: string; value: string };
}

export interface CareerQuizQuestion {
  id: number;
  text: string;
  options: { text: string; field: string }[];
}

export const riasecQuestions: AssessmentQuestion[] = [
  { id: 1, text: 'I enjoy working with tools, machines, or my hands to build or fix things.', category: 'R' },
  { id: 2, text: 'I like to study and solve complex problems through research and analysis.', category: 'I' },
  { id: 3, text: 'I enjoy creating original works through art, music, writing, or design.', category: 'A' },
  { id: 4, text: 'I find fulfillment in helping, teaching, or counseling others.', category: 'S' },
  { id: 5, text: 'I am motivated by leading projects, persuading people, and achieving business goals.', category: 'E' },
  { id: 6, text: 'I prefer organized, detail-oriented work with clear procedures and systems.', category: 'C' },
  { id: 7, text: 'I prefer outdoor or physically active work over desk jobs.', category: 'R' },
  { id: 8, text: 'I am curious about how things work and enjoy exploring scientific concepts.', category: 'I' },
  { id: 9, text: 'I value self-expression and prefer unstructured, creative environments.', category: 'A' },
  { id: 10, text: 'I am a good listener and people often come to me for advice.', category: 'S' },
  { id: 11, text: 'I enjoy taking risks and competing to achieve ambitious goals.', category: 'E' },
  { id: 12, text: 'I am meticulous about keeping records, data, and information organized.', category: 'C' },
  { id: 13, text: 'I would enjoy operating heavy machinery or working with mechanical systems.', category: 'R' },
  { id: 14, text: 'I like to understand the underlying principles behind natural phenomena.', category: 'I' },
  { id: 15, text: 'I enjoy improvising and creating without following strict guidelines.', category: 'A' },
  { id: 16, text: 'I feel energized by teamwork and collaborative problem-solving.', category: 'S' },
  { id: 17, text: 'I can easily persuade others to see things from my perspective.', category: 'E' },
  { id: 18, text: 'I follow rules and procedures carefully and expect others to do the same.', category: 'C' },
  { id: 19, text: 'I am interested in agriculture, construction, or technical trades.', category: 'R' },
  { id: 20, text: 'I enjoy mathematics, logic puzzles, and analytical reasoning.', category: 'I' },
  { id: 21, text: 'I would enjoy a career in performing arts, graphic design, or creative writing.', category: 'A' },
  { id: 22, text: 'I want a career where I can make a positive impact on people\'s lives.', category: 'S' },
  { id: 23, text: 'I am interested in entrepreneurship, sales, or business management.', category: 'E' },
  { id: 24, text: 'I prefer jobs with predictable routines and clear expectations.', category: 'C' },
  { id: 25, text: 'I enjoy sports, fitness training, or physical challenges.', category: 'R' },
  { id: 26, text: 'I would enjoy working in a laboratory, research center, or university.', category: 'I' },
  { id: 27, text: 'I have a strong imagination and often think of new ideas or concepts.', category: 'A' },
  { id: 28, text: 'I am patient and empathetic when dealing with people\'s problems.', category: 'S' },
  { id: 29, text: 'I thrive in high-pressure, competitive business environments.', category: 'E' },
  { id: 30, text: 'I am skilled at managing budgets, schedules, and administrative tasks.', category: 'C' },
];

export const mbtiQuestions: MBTIQuestion[] = [
  {
    id: 1,
    text: 'At a social gathering, you typically:',
    optionA: { text: 'Engage with many people, including strangers', dimension: 'EI', value: 'E' },
    optionB: { text: 'Talk with a few people you already know', dimension: 'EI', value: 'I' },
  },
  {
    id: 2,
    text: 'When learning something new, you prefer to:',
    optionA: { text: 'Focus on practical, concrete details', dimension: 'SN', value: 'S' },
    optionB: { text: 'Explore the big picture and underlying theory', dimension: 'SN', value: 'N' },
  },
  {
    id: 3,
    text: 'When making an important decision, you rely more on:',
    optionA: { text: 'Logic and objective analysis', dimension: 'TF', value: 'T' },
    optionB: { text: 'Personal values and how the decision affects others', dimension: 'TF', value: 'F' },
  },
  {
    id: 4,
    text: 'In your daily life, you prefer to:',
    optionA: { text: 'Have a structured plan and stick to it', dimension: 'JP', value: 'J' },
    optionB: { text: 'Stay flexible and adapt as things come up', dimension: 'JP', value: 'P' },
  },
  {
    id: 5,
    text: 'After a long week, you recharge by:',
    optionA: { text: 'Going out with friends or attending an event', dimension: 'EI', value: 'E' },
    optionB: { text: 'Spending quiet time alone with a book or hobby', dimension: 'EI', value: 'I' },
  },
  {
    id: 6,
    text: 'When solving a problem, you first look at:',
    optionA: { text: 'The facts and what has worked before', dimension: 'SN', value: 'S' },
    optionB: { text: 'The patterns and possibilities for innovation', dimension: 'SN', value: 'N' },
  },
  {
    id: 7,
    text: 'In a team disagreement, you prioritize:',
    optionA: { text: 'Finding the most rational solution', dimension: 'TF', value: 'T' },
    optionB: { text: 'Maintaining team harmony and relationships', dimension: 'TF', value: 'F' },
  },
  {
    id: 8,
    text: 'When working on a project, you prefer to:',
    optionA: { text: 'Set milestones and finish before the deadline', dimension: 'JP', value: 'J' },
    optionB: { text: 'Work in bursts of energy and adapt the timeline', dimension: 'JP', value: 'P' },
  },
  {
    id: 9,
    text: 'In conversations, you tend to:',
    optionA: { text: 'Think out loud and talk things through', dimension: 'EI', value: 'E' },
    optionB: { text: 'Think quietly first, then share your conclusion', dimension: 'EI', value: 'I' },
  },
  {
    id: 10,
    text: 'You are more interested in:',
    optionA: { text: 'What is real and present right now', dimension: 'SN', value: 'S' },
    optionB: { text: 'What could be and future possibilities', dimension: 'SN', value: 'N' },
  },
  {
    id: 11,
    text: 'When giving feedback, you focus on:',
    optionA: { text: 'Honest critique to help improve performance', dimension: 'TF', value: 'T' },
    optionB: { text: 'Encouragement and positive reinforcement', dimension: 'TF', value: 'F' },
  },
  {
    id: 12,
    text: 'Your workspace is usually:',
    optionA: { text: 'Neat, organized, and systematically arranged', dimension: 'JP', value: 'J' },
    optionB: { text: 'Creative chaos — you know where everything is', dimension: 'JP', value: 'P' },
  },
];

export const careerQuizQuestions: CareerQuizQuestion[] = [
  {
    id: 1,
    text: 'Which work environment excites you the most?',
    options: [
      { text: 'A tech startup building the next big app', field: 'technology' },
      { text: 'A research lab pushing the boundaries of AI', field: 'ai_ml' },
      { text: 'A design studio creating beautiful products', field: 'design' },
      { text: 'A hospital or biotech company saving lives', field: 'healthcare' },
    ],
  },
  {
    id: 2,
    text: 'Which skill would you most like to master?',
    options: [
      { text: 'Building scalable software systems', field: 'technology' },
      { text: 'Training machine learning models', field: 'ai_ml' },
      { text: 'Creating intuitive user experiences', field: 'design' },
      { text: 'Analyzing financial data and markets', field: 'finance' },
    ],
  },
  {
    id: 3,
    text: 'What kind of impact do you want to make?',
    options: [
      { text: 'Build products used by millions', field: 'product' },
      { text: 'Advance human knowledge through AI', field: 'ai_ml' },
      { text: 'Improve people\'s health and wellbeing', field: 'healthcare' },
      { text: 'Help businesses grow and succeed', field: 'finance' },
    ],
  },
  {
    id: 4,
    text: 'Which book would you most likely read?',
    options: [
      { text: '"Clean Code" by Robert C. Martin', field: 'technology' },
      { text: '"Deep Learning" by Ian Goodfellow', field: 'ai_ml' },
      { text: '"The Design of Everyday Things" by Don Norman', field: 'design' },
      { text: '"The Intelligent Investor" by Benjamin Graham', field: 'finance' },
    ],
  },
  {
    id: 5,
    text: 'Your ideal weekend project involves:',
    options: [
      { text: 'Building a personal app or website', field: 'technology' },
      { text: 'Experimenting with a new ML model', field: 'ai_ml' },
      { text: 'Redesigning your room or creating art', field: 'design' },
      { text: 'Reading about market trends and investing', field: 'finance' },
    ],
  },
  {
    id: 6,
    text: 'Which role model inspires you the most?',
    options: [
      { text: 'Sundar Pichai — CEO of Google', field: 'technology' },
      { text: 'Andrew Ng — AI pioneer', field: 'ai_ml' },
      { text: 'Steve Jobs — Design visionary', field: 'design' },
      { text: 'Ratan Tata — Industrialist & philanthropist', field: 'product' },
    ],
  },
  {
    id: 7,
    text: 'What frustrates you most in a project?',
    options: [
      { text: 'Poorly written, unmaintainable code', field: 'technology' },
      { text: 'Lack of data or evidence for decisions', field: 'ai_ml' },
      { text: 'Ugly, unusable interfaces', field: 'design' },
      { text: 'Inefficient processes and waste', field: 'product' },
    ],
  },
  {
    id: 8,
    text: 'Which company would you love to work for?',
    options: [
      { text: 'Google or Microsoft', field: 'technology' },
      { text: 'DeepMind or OpenAI', field: 'ai_ml' },
      { text: 'Figma or Adobe', field: 'design' },
      { text: 'Razorpay or Zerodha', field: 'finance' },
    ],
  },
  {
    id: 9,
    text: 'In a team, you naturally take on the role of:',
    options: [
      { text: 'The builder who codes the solution', field: 'technology' },
      { text: 'The analyst who finds the insights', field: 'ai_ml' },
      { text: 'The designer who crafts the experience', field: 'design' },
      { text: 'The strategist who plans the direction', field: 'product' },
    ],
  },
  {
    id: 10,
    text: 'What would make you most proud in your career?',
    options: [
      { text: 'Shipping a product that millions use daily', field: 'product' },
      { text: 'Publishing a widely-cited research paper', field: 'ai_ml' },
      { text: 'Winning a design award for innovation', field: 'design' },
      { text: 'Making healthcare accessible to underserved communities', field: 'healthcare' },
    ],
  },
];

export const riasecDescriptions: Record<string, {
  title: string;
  description: string;
  careers: string[];
  traits: string[];
}> = {
  R: {
    title: 'Realistic — The Doer',
    description: 'You are practical, hands-on, and action-oriented. You prefer working with things rather than ideas or people. You enjoy physical activities, mechanical tasks, and working outdoors. You value tangible results and take pride in building, fixing, or creating things with your own hands.',
    careers: ['Mechanical Engineer', 'Civil Engineer', 'Agricultural Scientist', 'Electrician', 'Pilot', 'Surgeon', 'Athlete', 'Forester'],
    traits: ['Practical', 'Physical', 'Hands-on', 'Mechanical', 'Outdoorsy'],
  },
  I: {
    title: 'Investigative — The Thinker',
    description: 'You are analytical, intellectual, and curious. You enjoy observing, learning, and solving complex problems through research and analysis. You prefer working with ideas rather than people or things. You are drawn to science, mathematics, and understanding how the world works.',
    careers: ['Data Scientist', 'Research Scientist', 'Software Developer', 'Physician', 'Pharmacist', 'Professor', 'Economist', 'Psychologist'],
    traits: ['Analytical', 'Curious', 'Scientific', 'Independent', 'Intellectual'],
  },
  A: {
    title: 'Artistic — The Creator',
    description: 'You are creative, expressive, and imaginative. You prefer unstructured environments where you can express your originality. You value beauty, aesthetics, and self-expression. You are drawn to art, music, writing, and design where you can create something unique.',
    careers: ['UX Designer', 'Graphic Designer', 'Writer', 'Filmmaker', 'Architect', 'Musician', 'Animator', 'Interior Designer'],
    traits: ['Creative', 'Expressive', 'Imaginative', 'Independent', 'Intuitive'],
  },
  S: {
    title: 'Social — The Helper',
    description: 'You are caring, empathetic, and people-oriented. You enjoy helping, teaching, and counseling others. You prefer working with people rather than things or data. You are drawn to education, healthcare, and community service where you can make a positive difference.',
    careers: ['Teacher', 'Counselor', 'Nurse', 'Social Worker', 'HR Manager', 'Therapist', 'Community Organizer', 'Doctor'],
    traits: ['Empathetic', 'Supportive', 'Cooperative', 'Patient', 'Nurturing'],
  },
  E: {
    title: 'Enterprising — The Persuader',
    description: 'You are ambitious, confident, and persuasive. You enjoy leading, influencing, and managing people and projects. You prefer competitive, goal-oriented environments. You are drawn to business, sales, politics, and leadership roles where you can drive results.',
    careers: ['Business Manager', 'Sales Director', 'Entrepreneur', 'Marketing Manager', 'Lawyer', 'Real Estate Developer', 'Consultant', 'Politician'],
    traits: ['Ambitious', 'Persuasive', 'Leadership', 'Competitive', 'Confident'],
  },
  C: {
    title: 'Conventional — The Organizer',
    description: 'You are organized, detail-oriented, and systematic. You prefer structured environments with clear rules and procedures. You enjoy managing data, records, and systems efficiently. You are drawn to finance, administration, and operations where precision and reliability matter.',
    careers: ['Accountant', 'Financial Analyst', 'Banker', 'Auditor', 'Office Manager', 'Data Entry Specialist', 'Tax Consultant', 'Compliance Officer'],
    traits: ['Organized', 'Detail-oriented', 'Reliable', 'Systematic', 'Efficient'],
  },
};

export const mbtiDescriptions: Record<string, {
  title: string;
  description: string;
  strengths: string[];
  careers: string[];
  famous: string[];
}> = {
  INTJ: {
    title: 'The Architect',
    description: 'Strategic and independent, you combine imagination with reliability. You see the big picture and devise innovative solutions. You value knowledge and competence, and you are driven to turn your ideas into reality.',
    strengths: ['Strategic thinking', 'Independence', 'Determination', 'Innovation', 'Self-confidence'],
    careers: ['Software Architect', 'Data Scientist', 'Strategy Consultant', 'Research Director', 'CTO'],
    famous: ['Elon Musk', 'Nikola Tesla', 'Christopher Nolan'],
  },
  INTP: {
    title: 'The Logician',
    description: 'Analytical and creative, you love exploring ideas and finding patterns. You are driven by intellectual curiosity and the desire to understand how things work at their deepest level.',
    strengths: ['Analytical thinking', 'Creativity', 'Objectivity', 'Intellectual curiosity', 'Adaptability'],
    careers: ['Software Developer', 'Research Scientist', 'Data Analyst', 'Professor', 'Systems Architect'],
    famous: ['Albert Einstein', 'Bill Gates', 'Marie Curie'],
  },
  ENTJ: {
    title: 'The Commander',
    description: 'Bold and strategic, you are a natural leader who thrives on challenge. You can see inefficiencies and devise solutions, organizing people and resources to achieve ambitious goals.',
    strengths: ['Leadership', 'Strategic vision', 'Efficiency', 'Confidence', 'Decisiveness'],
    careers: ['CEO', 'Management Consultant', 'Investment Banker', 'Entrepreneur', 'General Manager'],
    famous: ['Steve Jobs', 'Indra Nooyi', 'Julius Caesar'],
  },
  ENTP: {
    title: 'The Debater',
    description: 'Quick-witted and bold, you love intellectual challenges and exploring new ideas. You are energized by debate and enjoy playing devil\'s advocate to find the best solutions.',
    strengths: ['Innovation', 'Persuasion', 'Quick thinking', 'Adaptability', 'Intellectual curiosity'],
    careers: ['Entrepreneur', 'Product Manager', 'Marketing Strategist', 'Consultant', 'Venture Capitalist'],
    famous: ['Benjamin Franklin', 'Mark Twain', 'Thomas Edison'],
  },
  INFJ: {
    title: 'The Advocate',
    description: 'Quiet and mystical, yet inspiring and tireless. You have a deep sense of idealism and integrity, and you seek meaning in your work and relationships.',
    strengths: ['Insight', 'Empathy', 'Vision', 'Determination', 'Integrity'],
    careers: ['Counselor', 'UX Researcher', 'Non-profit Director', 'Writer', 'Psychologist'],
    famous: ['Martin Luther King Jr.', 'Nelson Mandela', 'Mother Teresa'],
  },
  INFP: {
    title: 'The Mediator',
    description: 'Idealistic and compassionate, you seek the good in everything. You are creative and driven by your values, wanting to make the world a better place.',
    strengths: ['Empathy', 'Creativity', 'Idealism', 'Dedication', 'Open-mindedness'],
    careers: ['Writer', 'Counselor', 'UX Designer', 'Social Worker', 'Artist'],
    famous: ['William Shakespeare', 'J.R.R. Tolkien', 'Princess Diana'],
  },
  ENFJ: {
    title: 'The Protagonist',
    description: 'Charismatic and inspiring, you are a natural leader who genuinely cares about people. You have a unique ability to bring out the best in others.',
    strengths: ['Leadership', 'Empathy', 'Charisma', 'Organization', 'Altruism'],
    careers: ['HR Director', 'Teacher', 'Sales Manager', 'Coach', 'Public Relations Manager'],
    famous: ['Barack Obama', 'Oprah Winfrey', 'Peyton Manning'],
  },
  ENFP: {
    title: 'The Campaigner',
    description: 'Enthusiastic and creative, you see life as full of possibilities. You make connections between events and information quickly, and proceed based on patterns you observe.',
    strengths: ['Enthusiasm', 'Creativity', 'Sociability', 'Adaptability', 'Optimism'],
    careers: ['Marketing Director', 'Journalist', 'Event Planner', 'Startup Founder', 'Counselor'],
    famous: ['Robin Williams', 'Walt Disney', 'Robert Downey Jr.'],
  },
  ISTJ: {
    title: 'The Logistician',
    description: 'Practical and fact-minded, you are reliable and methodical. You value tradition and are dedicated to duty, always following through on your commitments.',
    strengths: ['Reliability', 'Organization', 'Honesty', 'Dedication', 'Methodical approach'],
    careers: ['Accountant', 'Project Manager', 'Civil Engineer', 'Government Official', 'Quality Analyst'],
    famous: ['George Washington', 'Angela Merkel', 'Warren Buffett'],
  },
  ISFJ: {
    title: 'The Defender',
    description: 'Very dedicated and warm, you are always ready to protect your loved ones. You are meticulous and responsible, with a deep sense of loyalty.',
    strengths: ['Loyalty', 'Meticulousness', 'Supportiveness', 'Patience', 'Reliability'],
    careers: ['Nurse', 'Teacher', 'Social Worker', 'HR Manager', 'Pharmacist'],
    famous: ['Beyoncé', 'Vincent van Gogh', 'Anne Hathaway'],
  },
  ESTJ: {
    title: 'The Executive',
    description: 'Excellent organizers, you are dedicated to tradition and order. You take charge and ensure everything is done correctly and on time.',
    strengths: ['Organization', 'Dedication', 'Leadership', 'Honesty', 'Practicality'],
    careers: ['Business Manager', 'Judge', 'Financial Officer', 'School Principal', 'Military Officer'],
    famous: ['Henry Ford', 'Sonia Sotomayor', 'Michelle Obama'],
  },
  ESFJ: {
    title: 'The Consul',
    description: 'Caring and sociable, you are always attentive to others. You enjoy helping and take genuine pleasure in making others happy.',
    strengths: ['Caring nature', 'Sociability', 'Loyalty', 'Practicality', 'Organization'],
    careers: ['Healthcare Worker', 'Teacher', 'Sales Representative', 'Event Coordinator', 'HR Specialist'],
    famous: ['Taylor Swift', 'Jennifer Garner', 'Hugh Jackman'],
  },
  ISTP: {
    title: 'The Virtuoso',
    description: 'Bold and practical, you love exploring the world through hands-on experimentation. You are a natural maker who enjoys understanding how things work.',
    strengths: ['Practicality', 'Problem-solving', 'Adaptability', 'Calmness under pressure', 'Independence'],
    careers: ['Engineer', 'Pilot', 'Forensic Scientist', 'Mechanic', 'Software Developer'],
    famous: ['Clint Eastwood', 'Michael Jordan', 'Bruce Lee'],
  },
  ISFP: {
    title: 'The Adventurer',
    description: 'Flexible and charming, you are always ready to explore new things. You have a keen aesthetic sense and enjoy expressing yourself through action.',
    strengths: ['Creativity', 'Adaptability', 'Charm', 'Sensitivity', 'Artistic sense'],
    careers: ['Graphic Designer', 'Photographer', 'Veterinarian', 'Musician', 'Interior Designer'],
    famous: ['Michael Jackson', 'Bob Dylan', 'David Bowie'],
  },
  ESTP: {
    title: 'The Entrepreneur',
    description: 'Smart and energetic, you enjoy living on the edge. You are an action-oriented problem solver who makes quick decisions and thrives in fast-paced environments.',
    strengths: ['Energetic', 'Perceptive', 'Sociable', 'Direct', 'Resourceful'],
    careers: ['Sales Manager', 'Entrepreneur', 'Sports Professional', 'Emergency Medicine', 'Police Detective'],
    famous: ['Donald Trump', 'Ernest Hemingway', 'Madonna'],
  },
  ESFP: {
    title: 'The Entertainer',
    description: 'Spontaneous and energetic, you are the life of the party. You love being in the spotlight and making others happy with your warmth and enthusiasm.',
    strengths: ['Energetic', 'Sociable', 'Spontaneous', 'Practical', 'Fun-loving'],
    careers: ['Event Manager', 'Actor', 'Tour Guide', 'Sales Representative', 'Fashion Designer'],
    famous: ['Marilyn Monroe', 'Elton John', 'Jamie Oliver'],
  },
};
