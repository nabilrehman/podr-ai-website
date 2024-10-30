import Link from 'next/link'
import CoachCard from '@/components/CoachCard'

const coaches = [
  {
    name: 'Dr. Emma AI',
    specialty: 'Social Situations Specialist',
    tags: ['Group Settings', 'Social Confidence'],
    rating: '★ 4.9/5',
    satisfaction: '98.8% Success Rate',
    description: 'Specialized in helping with social anxiety in group settings and building lasting confidence.',
    imagePath: '/images/profiles/ai-coach-1.svg'
  },
  {
    name: 'Dr. Alex AI',
    specialty: 'Public Speaking Expert',
    tags: ['Presentation Skills', 'Performance Anxiety'],
    rating: '★ 4.8/5',
    satisfaction: '97.2% Success Rate',
    description: 'Expert in transforming public speaking anxiety into confident performance abilities.',
    imagePath: '/images/profiles/ai-coach-2.svg'
  },
  {
    name: 'Dr. Sam AI',
    specialty: 'Workplace Anxiety Specialist',
    tags: ['Career Growth', 'Work-Life Balance'],
    rating: '★ 4.9/5',
    satisfaction: '98.4% Success Rate',
    description: 'Helping professionals overcome workplace anxiety and achieve career goals with confidence.',
    imagePath: '/images/profiles/ai-coach-3.svg'
  }
]

export default function Home() {
  return (
    <main>
      <section className="text-center py-24 px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[--text-dark] to-[--accent-color] inline-block text-transparent bg-clip-text leading-tight">
            Overcome Social Anxiety with AI Support
          </h1>
          <p className="text-xl text-[--text-light] mb-10 max-w-2xl mx-auto">
            24/7 empathetic conversations with AI psychologists and coaches trained in social anxiety management
          </p>
          <Link href="/chat" className="cta-button">
            Begin Your Journey
          </Link>
        </div>
      </section>

      <section className="px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches.map((coach) => (
            <CoachCard key={coach.name} {...coach} />
          ))}
        </div>
      </section>
    </main>
  )
}