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
      <section className="hero">
          <h1>
            Overcome Social Anxiety with AI Support
          </h1>
          <p>
            24/7 empathetic conversations with AI psychologists and coaches trained in social anxiety management
          </p>
          <Link href="/chat" className="cta-button">
            Begin Your Journey
          </Link>
      </section>

      <section className="coaches-grid">
        {coaches.map((coach) => (
          <CoachCard key={coach.name} {...coach} />
        ))}
      </section>
    </main>
  )
}