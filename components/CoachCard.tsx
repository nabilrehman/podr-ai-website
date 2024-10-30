import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { StarIcon, VideoCameraIcon } from '@heroicons/react/24/solid';

interface CoachCardProps {
  name: string;
  specialty: string;
  tags: string[];
  rating: string;
  satisfaction: string;
  description: string;
  imagePath: string;
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
    <motion.div 
      className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden min-w-[320px] max-w-[380px] hover:shadow-xl transition-all duration-300 relative group"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card Header with Image */}
      <div className="relative aspect-[4/3] w-full bg-purple-50">
        <Image
          src={imagePath}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 380px) 100vw, 380px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Video icon overlay */}
        <div className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-lg shadow-md backdrop-blur-sm">
          <VideoCameraIcon className="w-5 h-5 text-purple-600" />
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          Available Today
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-600">{specialty}</p>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full font-medium hover:bg-purple-100 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-gray-900">{rating}</span>
          </div>
          <div className="text-gray-600 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2" />
            {satisfaction}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        {/* Action Button */}
        <Link 
          href="/chat" 
          className="mt-2 block w-full bg-purple-600 text-white py-3 px-4 rounded-xl hover:bg-purple-700 transition-colors duration-200 text-center font-medium shadow-sm hover:shadow-md active:scale-[0.98] transform"
        >
          Start Session
        </Link>
      </div>
    </motion.div>
  );
};

export default CoachCard;