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
    <div className="coach-card">
      <div className="coach-avatar">
        <div className="relative avatar-img">
          <Image
            src={imagePath}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <div className="coach-info">
        <h3>{name}</h3>
        <p className="specialty">{specialty}</p>
        
        <div className="tags">
          {tags.map((tag) => (
            <span
              key={tag}
              className="tag"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="coach-stats">
          <div className="rating">★ {rating}</div>
          <div>{satisfaction}</div>
        </div>
        
        <p className="description">
          {description}
        </p>
        
        <Link 
          href="/chat" 
          className="chat-button"
        >
          Start Session
        </Link>
      </div>
    </div>
  )
}

export default CoachCard