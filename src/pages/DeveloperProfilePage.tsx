import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfileByUsernameOrId } from '@/features/profiles/services/profiles.service';
import { fetchProjectsByOwner } from '@/features/projects/services/projects.service';
import { sendContactMessage } from '@/features/landing/services/contacts.service';
import { PremiumFooter } from '@/components/common/PremiumFooter';
import { MessageCircle, Instagram, Linkedin, ArrowLeft, ExternalLink, Github, Heart, Eye } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

// --- Local Components ---
const ProfileHeader: React.FC<{ developer: any }> = ({ developer }) => {
  return (
    <div className="flex flex-col items-center text-center mt-8">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur-md opacity-40 animate-pulse" />
        <img
          src={developer.avatarUrl}
          alt={developer.name}
          className="relative h-32 w-32 rounded-full border-2 border-purple-500/20 object-cover shadow-2xl z-10"
        />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-white font-outfit md:text-4xl">{developer.name}</h1>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-purple-400 font-outfit">{developer.role}</p>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 font-outfit">{developer.bio}</p>
    </div>
  );
};

const SkillsSection: React.FC<{ skills: string[] }> = ({ skills }) => {
  if (!skills || !skills.length) return null;
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 font-outfit">Skills</h3>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {skills.map((skill) => (
          <span key={skill} className="inline-flex items-center rounded-md bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-semibold text-purple-300 font-outfit">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProjectGrid: React.FC<{ projects: any[], onProjectClick: (id: string) => void }> = ({ projects, onProjectClick }) => {
  if (!projects || !projects.length) return <p className="text-center text-white/50">No projects yet.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(proj => (
        <div 
          key={proj.id} 
          onClick={() => onProjectClick(proj.id)}
          className="group cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all"
        >
          <div className="aspect-video relative overflow-hidden">
            <img src={proj.imageUrls[0]} alt={proj.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-white font-outfit line-clamp-1">{proj.title}</h3>
            <p className="text-sm text-white/50 mt-1 line-clamp-2">{proj.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};


const DeveloperProfilePage: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState<any>(null);
  const [devProjects, setDevProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Contact Drawer state
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  useEffect(() => {
    const loadDeveloperData = async () => {
      if (!identifier) return;
      setLoading(true);
      setError(null);
      try {
        const profile = await fetchProfileByUsernameOrId(identifier);
        
        const mappedProfile = {
          id: profile.id,
          username: profile.username || '',
          name: profile.full_name || '',
          role: profile.role || '',
          bio: profile.bio || '',
          avatarUrl: profile.avatar_url || 'https://via.placeholder.com/150',
          skills: profile.skills || [],
          whatsappNumber: profile.whatsapp_number,
          instagramUrl: profile.instagram_url,
          linkedinUrl: profile.linkedin_url,
          websiteUrl: profile.website_url,
        };

        setDeveloper(mappedProfile);

        // Fetch projects
        const projectsData = await fetchProjectsByOwner(profile.id);
        const mappedProjects = projectsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          imageUrls: p.image_urls || [p.image_url || 'https://via.placeholder.com/800x600'],
          technologies: p.technologies || [],
          liveUrl: p.live_url,
          githubUrl: p.github_url,
          likes: p.likes || 0,
          views: p.views || 0,
        }));
        
        setDevProjects(mappedProjects);
      } catch (err: any) {
        setError(err.message || 'Failed to load developer profile');
      } finally {
        setLoading(false);
      }
    };

    loadDeveloperData();
  }, [identifier]);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`, { state: { backgroundLocation: location } });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    setIsSubmittingContact(true);
    try {
      await sendContactMessage({
        developer_id: developer?.id,
        sender_name: contactName,
        sender_email: contactEmail,
        message: contactMessage
      });
      toast.success(`Message sent successfully to ${developer?.name}!`);
      setIsContactOpen(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-center items-center p-8">
        <p className="text-red-400 mb-4 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error || 'Developer not found'}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 pb-20">
      <Helmet>
        <title>{`${developer.name} | ${developer.role} - Elite Code`}</title>
        <meta name="description" content={developer.bio.substring(0, 155)} />
        <meta property="og:title" content={`${developer.name} | ${developer.role}`} />
        <meta property="og:description" content={developer.bio.substring(0, 155)} />
        <meta property="og:image" content={developer.avatarUrl} />
        <link rel="canonical" href={`https://elite-code.com/developer/${developer.username || developer.id}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2 mb-8 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium tracking-wide">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <ProfileHeader developer={developer} />
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-semibold rounded-full transition-all shadow-lg shadow-purple-950/20 font-outfit text-xs tracking-wider uppercase"
            >
              Direct Contact Form
            </button>
          </div>

          <div className="mt-8">
            <SkillsSection skills={developer.skills} />
          </div>

          {(developer.whatsappNumber || developer.instagramUrl || developer.linkedinUrl) && (
            <motion.div
              className="mt-8 flex justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {developer.whatsappNumber && (
                <a
                  href={`https://wa.me/${developer.whatsappNumber.replace(/[\s+]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 text-emerald-400 rounded-full hover:bg-white/15 hover:scale-110 transition-all shadow-md"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle size={24} />
                </a>
              )}
              {developer.instagramUrl && (
                <a
                  href={developer.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 text-pink-400 rounded-full hover:bg-white/15 hover:scale-110 transition-all shadow-md"
                  title="Instagram Profile"
                >
                  <Instagram size={24} />
                </a>
              )}
              {developer.linkedinUrl && (
                <a
                  href={developer.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 text-blue-400 rounded-full hover:bg-white/15 hover:scale-110 transition-all shadow-md"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={24} />
                </a>
              )}
            </motion.div>
          )}

          <div className="mt-10">
            <ProjectGrid projects={devProjects} onProjectClick={handleProjectClick} />
          </div>
        </motion.div>
      </div>

      <Sheet open={isContactOpen} onOpenChange={setIsContactOpen}>
        <SheetContent className="bg-[#09090b]/95 border-l border-white/5 text-white backdrop-blur-xl p-8 max-w-md w-full">
          <SheetHeader className="mb-6 text-left">
            <SheetTitle className="text-xl font-bold text-white font-outfit">Contact {developer.name}</SheetTitle>
            <SheetDescription className="text-sm text-white/50 font-outfit mt-1">
              Send a direct message to this developer. They will get back to you shortly.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleContactSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 font-outfit">Your Name</label>
              <input 
                type="text" 
                required 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                disabled={isSubmittingContact}
                className="w-full input-flat font-outfit" 
                placeholder="e.g. Alex Chen" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 font-outfit">Your Email</label>
              <input 
                type="email" 
                required 
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                disabled={isSubmittingContact}
                className="w-full input-flat font-outfit" 
                placeholder="alex@example.com" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 font-outfit">Message</label>
              <textarea 
                required 
                rows={4} 
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                disabled={isSubmittingContact}
                className="w-full input-flat font-outfit resize-none" 
                placeholder="Describe your project request..." 
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmittingContact}
              className="w-full btn-flat mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingContact ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </SheetContent>
      </Sheet>

      <PremiumFooter />
    </div>
  );
};

export default DeveloperProfilePage;
