import Link from 'next/link';
import CoachCard from '@/components/CoachCard';
import { CardSlider } from '@/components/CardSlider';

const coaches = [
  {
    name: 'Dr. Emma AI',
    specialty: 'Social Situations Specialist',
    tags: ['Group Settings', 'Social Confidence'],
    rating: '4.9',
    satisfaction: '98.8% Success Rate',
    description: 'Specialized in helping with social anxiety in group settings and building lasting confidence.',
    imagePath: '/images/profiles/ai-coach-1.svg'
  },
  {
    name: 'Dr. Alex AI',
    specialty: 'Public Speaking Expert',
    tags: ['Presentation Skills', 'Performance Anxiety'],
    rating: '4.8',
    satisfaction: '97.2% Success Rate',
    description: 'Expert in transforming public speaking anxiety into confident performance abilities.',
    imagePath: '/images/profiles/ai-coach-2.svg'
  },
  {
    name: 'Dr. Sam AI',
    specialty: 'Workplace Anxiety Specialist',
    tags: ['Career Growth', 'Work-Life Balance'],
    rating: '4.9',
    satisfaction: '98.4% Success Rate',
    description: 'Helping professionals overcome workplace anxiety and achieve career goals with confidence.',
    imagePath: '/images/profiles/ai-coach-3.svg'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <section className="hero relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 text-center bg-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Overcome Social Anxiety with AI Support
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            24/7 empathetic conversations with AI psychologists and coaches trained in social anxiety management
          </p>
          <Link 
            href="/chat" 
            className="inline-block bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Begin Your Journey
          </Link>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-b from-purple-50/50 to-transparent -z-10" />
        <div className="absolute -top-10 left-0 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10" />
        <div className="absolute -top-10 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 -z-10" />
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Expert AI Coaches
            </h2>
            <Link 
              href="/coaches" 
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              See all coaches
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <CardSlider>
            {coaches.map((coach) => (
              <CoachCard key={coach.name} {...coach} />
            ))}
          </CardSlider>
        </div>
      </section>
    </main>
  );
}