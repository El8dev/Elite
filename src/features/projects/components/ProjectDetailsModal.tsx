import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '@/types';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (project) {
      setCurrentIndex(0);
      setDirection(0);
      
      // Preload images to avoid flickering
      const images = project.imageUrls || project.imageUrl || [];
      const displayImages = Array.isArray(images) ? images : [images];
      
      displayImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [project]);

  if (!project) return null;

  const images = project.imageUrls || project.imageUrl || [];
  const displayImages = Array.isArray(images) ? images : [images];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = displayImages.length - 1;
      if (nextIndex >= displayImages.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const handleSwipe = (e: React.MouseEvent | React.TouchEvent, dir: number) => {
    e.stopPropagation();
    paginate(dir);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0f]/95 border border-white/10 rounded-2xl shadow-2xl shadow-black/80 flex flex-col md:grid md:grid-cols-12 overflow-x-hidden backdrop-blur-xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-25 p-2 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 rounded-full transition-colors backdrop-blur-md min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={20} />
          </button>
          
          {/* Left Column - Carousel Section */}
          {displayImages.length > 0 && (
            <div className="relative w-full h-64 sm:h-80 md:h-full md:min-h-[480px] bg-black/40 border-b md:border-b-0 md:border-r border-white/5 flex-shrink-0 overflow-hidden group md:col-span-6">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={currentIndex}
                  src={displayImages[currentIndex]}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={`${project.title} - ${currentIndex + 1}`}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    onClick={(e) => handleSwipe(e, -1)}
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    onClick={(e) => handleSwipe(e, 1)}
                  >
                    <ChevronRight size={28} />
                  </button>

                  {/* Luxury Gold Pagination Dots */}
                  <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
                    {displayImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDirection(idx > currentIndex ? 1 : -1);
                          setCurrentIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all box-content p-2 bg-clip-content ${
                          idx === currentIndex 
                            ? 'bg-[#F59E0B] w-4 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                            : 'bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Right Column - Details Section */}
          <div className="p-6 md:p-8 flex-1 md:col-span-6 flex flex-col justify-between overflow-y-auto md:max-h-[85vh]">
            <div>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-outfit">{project.title}</h2>
                  <div className="flex gap-4 mt-3">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-[#8B5CF6] hover:text-[#A855F7] transition-colors font-outfit">
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-white/55 hover:text-white/80 transition-colors font-outfit">
                        <Github size={16} /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed mb-8 font-outfit prose-headings:text-white prose-a:text-[#8B5CF6] hover:prose-a:text-[#A855F7] prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.description}
                </ReactMarkdown>
              </div>
              
              {project.techStack && project.techStack.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 font-outfit">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 text-purple-300 text-xs font-medium rounded-md font-outfit">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Overlapping Contributors Group */}
            {project.contributors && project.contributors.length > 0 && (
              <div className="pt-6 border-t border-white/5 mt-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 font-outfit">Contributors</h3>
                <TooltipProvider>
                  <div className="flex -space-x-3 overflow-hidden">
                    {project.contributors.map((c: any) => {
                      const name = c.full_name || c.username || c.name || 'User';
                      const avatar = c.avatar_url || c.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
                      const role = c.role || 'Contributor';
                      return (
                        <Tooltip key={c.id || c.profile_id}>
                          <TooltipTrigger asChild>
                            <img 
                              src={avatar} 
                              alt={name} 
                              className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0a0a0f] object-cover hover:-translate-y-1 transition-transform cursor-pointer" 
                            />
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#111113] border border-white/10 text-white p-2.5 rounded-lg shadow-xl font-outfit z-[100]">
                            <p className="font-semibold text-xs text-white">{name}</p>
                            <p className="text-xs md:text-sm text-purple-400/80 font-medium">{role}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
