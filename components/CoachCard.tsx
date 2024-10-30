import Image from 'next/image'
import Link from 'next/link'

interface CoachCardProps {
  name: string
  specialty: string
  tags: string[]
  rating: string
  satisfaction: string
  description: string
  imagePath: string
}

const CoachCard = ({
  name,
  specialty,
  tags,
  rating,
  satisfaction,
  description,
  imagePath,
}: CoachCardProps) => {
  return (
    <div className="bg-white/95 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm border border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="w-full h-[200px] bg-gradient-to-r from-[--gradient-start] to-[--gradient-end] flex items-center justify-center p-8">
        <div className="relative w-[120px] h-[120px]">
          <Image
            src={imagePath}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-[--text-dark]">{name}</h3>
        <p className="text-[--text-light] text-sm mb-4">{specialty}</p>
        
        <div className="flex flex-wrap gap-2 my-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[--gradient-start] to-[--gradient-end]"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between text-sm text-[--text-light] my-4">
          <div className="text-[--accent-color] font-semibold">{rating}</div>
          <div>{satisfaction}</div>
        </div>
        
        <p className="text-[--text-light] text-sm my-4 leading-relaxed">
          {description}
        </p>
        
        <Link 
          href="/chat" 
          className="w-full block text-center cta-button"
        >
          Start Session
        </Link>
      </div>
    </div>
  )
}

export default CoachCard