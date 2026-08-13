import React, { useState, useEffect, useCallback } from 'react';
import { AdminPanel } from '@/features/admin/components/AdminPanel';
import { DashboardProject, AdminProfileRow, PendingUser } from '@/features/admin/types';
import { ManageReviewsPanel } from '@/features/reviews/components/ManageReviewsPanel';
import { LogOut, User, FolderKanban, Plus, Trash2, Settings, Bell, X, Camera, Image as ImageIcon, Upload, Users, Search, Check, Loader2, Shield, Clock, CheckCircle, XCircle, Lock, UserCog, FileText, Edit3, Menu, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Cropper, { Area } from 'react-easy-crop';
import { motion, AnimatePresence } from 'motion/react';
import { getCroppedImg } from '@/lib/cropImage';
import { toast } from 'sonner';
import { Article, fetchArticlesByAuthor, createArticle, updateArticle, deleteArticle } from '@/features/articles/services/articles.service';
import { useTranslation } from 'react-i18next';
import { ThemeLanguageToggle } from '@/components/common/ThemeLanguageToggle';

// Define the type based on requirements


interface SearchedProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
}





type AdminSubSection = 'pending' | 'users';

const SYSTEM_ADMIN_ROLE = 'System Administrator';
const DEFAULT_MEMBER_ROLE = 'Member';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manage');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [personalProfileOnly, setPersonalProfileOnly] = useState(false);
  const [items, setItems] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  
  // Publish form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [publishLoading, setPublishLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
  const [selectedContributors, setSelectedContributors] = useState<{id: string, name: string, username: string}[]>([]);
  const [contributorSearchQuery, setContributorSearchQuery] = useState('');
  const [searchedProfiles, setSearchedProfiles] = useState<SearchedProfile[]>([]);
  const [contributorSearchLoading, setContributorSearchLoading] = useState(false);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [profileName, setProfileName] = useState('');
  const [profileUsername, setProfileUsername] = useState('');
  const [profileRole, setProfileRole] = useState(DEFAULT_MEMBER_ROLE);
  const [profileJobTitle, setProfileJobTitle] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Social Links State
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Admin & Account Status State
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [accountStatus, setAccountStatus] = useState<string>('pending');
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [isProfileFetching, setIsProfileFetching] = useState(true);

  // Dynamic Skills State
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // Cropper State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Articles State
  const [userArticles, setUserArticles] = useState<Article[]>([]);
  const [userArticlesLoading, setUserArticlesLoading] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleCategory, setArticleCategory] = useState(''); // Will be set with translation if needed, or keep generic keys
  const [articleReadTime, setArticleReadTime] = useState('');
  const [articleImageUrl, setArticleImageUrl] = useState('');
  const [articleSubmitting, setArticleSubmitting] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  // Edit Project Modal State
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DashboardProject | null>(null);
  const [editProjectTitle, setEditProjectTitle] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [editProjectLiveUrl, setEditProjectLiveUrl] = useState('');
  const [editProjectGithubUrl, setEditProjectGithubUrl] = useState('');
  const [editProjectPersonalProfileOnly, setEditProjectPersonalProfileOnly] = useState(false);
  const [editProjectSubmitting, setEditProjectSubmitting] = useState(false);

  // Authentication & Fetch Data
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Auth verification failed:', authError);
        navigate('/login');
        return;
      }
      
      setCurrentUserId(user.id);
      fetchItems(user.id);
      fetchProfile(user.id);
      fetchUserArticles(user.id);
    };

    checkAuthAndFetch();
  }, [navigate]);

  const fetchUserArticles = async (userId: string) => {
    setUserArticlesLoading(true);
    try {
      const articles = await fetchArticlesByAuthor(userId);
      setUserArticles(articles);
    } catch (err) {
      console.error('Error fetching user articles:', err);
    } finally {
      setUserArticlesLoading(false);
    }
  };

  const openArticleModal = (article?: Article) => {
    if (article) {
      setEditingArticleId(article.id);
      setArticleTitle(article.title);
      setArticleExcerpt(article.excerpt);
      setArticleContent(article.content || '');
      setArticleCategory(article.category);
      setArticleReadTime(article.read_time || article.readTime || '5 minutes');
      setArticleImageUrl(article.image_url || article.image || '');
    } else {
      setEditingArticleId(null);
      setArticleTitle('');
      setArticleExcerpt('');
      setArticleContent('');
      setArticleCategory(t('dashboard_articles.cat_ai'));
      setArticleReadTime('5 minutes');
      setArticleImageUrl('');
    }
    setArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle || !articleExcerpt || !currentUserId) {
      toast.error(t('dashboard_articles.fill_required'));
      return;
    }

    setArticleSubmitting(true);
    try {
      if (editingArticleId) {
        await updateArticle(editingArticleId, {
          title: articleTitle,
          excerpt: articleExcerpt,
          content: articleContent,
          category: articleCategory,
          read_time: articleReadTime,
          image_url: articleImageUrl,
        });
        toast.success(t('dashboard_articles.update_success'));
      } else {
        await createArticle({
          title: articleTitle,
          excerpt: articleExcerpt,
          content: articleContent,
          category: articleCategory,
          read_time: articleReadTime,
          image_url: articleImageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450',
          author_id: currentUserId,
          author_name: profileName || 'Tech Editor',
          author_avatar: avatarUrl || avatarPreview || 'https://i.pravatar.cc/150',
        });
        toast.success(t('dashboard_articles.publish_success'));
      }

      setArticleModalOpen(false);
      fetchUserArticles(currentUserId);
    } catch (err: any) {
      console.error('Error saving article:', err);
      toast.error(`${t('dashboard_articles.save_error')}${err.message}`);
    } finally {
      setArticleSubmitting(false);
    }
  };

  const handleConfirmDeleteArticle = async () => {
    if (!articleToDelete || !currentUserId) return;
    try {
      await deleteArticle(articleToDelete);
      toast.success(t('dashboard_articles.delete_success'));
      setArticleToDelete(null);
      fetchUserArticles(currentUserId);
    } catch (err: any) {
      console.error('Error deleting article:', err);
      toast.error(`${t('dashboard_articles.delete_error')}${err.message}`);
    }
  };

  // Block non-admins from staying on the admin tab (e.g. stale state or URL manipulation)
  useEffect(() => {
    if (!isProfileFetching && activeTab === 'admin' && !isSystemAdmin) {
      setActiveTab('manage');
    }
  }, [isProfileFetching, activeTab, isSystemAdmin]);

  const fetchProfile = async (userId: string) => {
    setIsProfileFetching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, role, job_title, bio, avatar_url, skills, whatsapp_number, instagram_url, linkedin_url, account_status')
        .eq('id', userId)
        .single();
        
      console.log('Fetched profile data:', data, 'Error:', error);
        
      if (data && !error) {
        const fetchedRole = data.role || DEFAULT_MEMBER_ROLE;
        const userIsSystemAdmin = fetchedRole === SYSTEM_ADMIN_ROLE;
        
        setProfileName(data.full_name || '');
        setProfileUsername(data.username || '');
        setProfileRole(fetchedRole);
        setProfileJobTitle(data.job_title || '');
        setProfileBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
        setSkills(data.skills || []);
        setWhatsappNumber(data.whatsapp_number || '');
        setInstagramUrl(data.instagram_url || '');
        setLinkedinUrl(data.linkedin_url || '');
        setIsSystemAdmin(userIsSystemAdmin);
        setAccountStatus(userIsSystemAdmin ? 'approved' : (data.account_status || 'pending'));
      } else {
        setIsSystemAdmin(false);
        setAccountStatus('pending');
        setProfileRole(DEFAULT_MEMBER_ROLE);
      }
    } catch (err) {
      console.error('Exception fetching profile:', err);
    } finally {
      setIsProfileFetching(false);
    }
  };

  const fetchItems = async (userId: string) => {
    setLoading(true);
    try {
      const { data: ownedProjects, error: ownedError } = await supabase
        .from('projects')
        .select('id, title, description, personal_profile_only, created_at, live_link, github_link, image_url, project_contributors(user_id)')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (ownedError) throw ownedError;

      setItems(ownedProjects || []);
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !currentUserId) return;

    setIsSubmitting(true);
    setPublishLoading(true);

    try {
      // ── Task 1: Upload images to Supabase Storage ──
      const uploadedImageUrls: string[] = [];

      if (images.length > 0) {
        for (const file of images) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${currentUserId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('project_images')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

          if (uploadError) {
            throw new Error(`Image upload failed: ${uploadError.message}`);
          }

          const { data: publicUrlData } = supabase.storage
            .from('project_images')
            .getPublicUrl(fileName);

          uploadedImageUrls.push(publicUrlData.publicUrl);
        }
      }

      // ── Task 1.5: Reorder for Main Image ──
      if (mainImageIndex > 0 && mainImageIndex < uploadedImageUrls.length) {
        const mainImg = uploadedImageUrls[mainImageIndex];
        uploadedImageUrls.splice(mainImageIndex, 1);
        uploadedImageUrls.unshift(mainImg);
      }

      // ── Task 2: Insert project into the database ──
      const { data: newProject, error: insertError } = await supabase
        .from('projects')
        .insert([
          {
            title,
            description,
            personal_profile_only: personalProfileOnly,
            owner_id: currentUserId,
            image_url: uploadedImageUrls,
            live_link: liveUrl,
            github_link: githubUrl,
          }
        ])
        .select('id')
        .single();

      if (insertError || !newProject) {
        throw new Error(insertError?.message || 'Failed to create project record.');
      }

      const newProjectId = newProject.id;

      // ── Task 3: Insert contributors into project_contributors ──
      if (selectedContributors.length > 0) {
        const contributorRows = selectedContributors.map((c) => ({
          project_id: newProjectId,
          user_id: c.id,
        }));

        const { error: contribError } = await supabase
          .from('project_contributors')
          .insert(contributorRows);

        if (contribError) {
          // Non-fatal: project was created, but contributors failed
          console.error('Contributor insert error:', contribError);
          toast.warning('Project published, but some contributors could not be added.');
        }
      }

      // ── Task 4: Success – reset form ──
      toast.success('Project published successfully!');
      setTitle('');
      setDescription('');
      setLiveUrl('');
      setGithubUrl('');
      setMainImageIndex(0);
      setPersonalProfileOnly(false);
      setImages([]);
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setImagePreviewUrls([]);
      setSelectedContributors([]);
      setActiveTab('manage');
      if (currentUserId) fetchItems(currentUserId);

    } catch (err: any) {
      console.error('Publish error:', err);
      toast.error(err.message || 'An unexpected error occurred while publishing.');
    } finally {
      setIsSubmitting(false);
      setPublishLoading(false);
    }
  };

  const openEditProjectModal = (project: DashboardProject) => {
    setEditingProject(project);
    setEditProjectTitle(project.title || '');
    setEditProjectDescription(project.description || '');
    setEditProjectLiveUrl(project.live_link || '');
    setEditProjectGithubUrl(project.github_link || '');
    setEditProjectPersonalProfileOnly(project.personal_profile_only || false);
    setEditProjectModalOpen(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !currentUserId) return;

    setEditProjectSubmitting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: editProjectTitle,
          description: editProjectDescription,
          live_link: editProjectLiveUrl,
          github_link: editProjectGithubUrl,
          personal_profile_only: editProjectPersonalProfileOnly,
        })
        .eq('id', editingProject.id);

      if (error) throw error;

      toast.success(t('dashboard.update_success', 'Project updated successfully!'));
      setEditProjectModalOpen(false);
      fetchItems(currentUserId);
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err.message || 'An error occurred while updating the project.');
    } finally {
      setEditProjectSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length > 10) {
        toast.error('You can only upload a maximum of 10 images.');
        return;
      }
      setImages((prev) => [...prev, ...selectedFiles]);
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex(prev => prev - 1);
    }
  };

  // ── Search registered profiles for contributor picker ──
  const searchProfiles = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchedProfiles([]);
      return;
    }
    setContributorSearchLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .neq('id', currentUserId || '')
        .limit(20);

      if (!error && data) {
        setSearchedProfiles(data);
      }
    } catch (err) {
      console.error('Profile search error:', err);
    } finally {
      setContributorSearchLoading(false);
    }
  }, [currentUserId]);

  // Debounced profile search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProfiles(contributorSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [contributorSearchQuery, searchProfiles]);

  const toggleContributor = (user: {id: string, name: string, username: string}) => {
    if (selectedContributors.find(c => c.id === user.id)) {
      setSelectedContributors(prev => prev.filter(c => c.id !== user.id));
    } else {
      setSelectedContributors(prev => [...prev, user]);
    }
  };

  const removeSelectedContributor = (id: string) => {
    setSelectedContributors(prev => prev.filter(c => c.id !== id));
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', itemToDelete);

    if (!error) {
      setItems(items.filter(item => item.id !== itemToDelete));
    } else {
      console.error('Error deleting item:', error);
    }
    setItemToDelete(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (imageToCrop) URL.revokeObjectURL(imageToCrop);
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setImageToCrop(fileUrl);
      setCropModalOpen(true);
    }
    // reset input
    e.target.value = '';
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    if (imageToCrop && croppedAreaPixels) {
      try {
        const croppedFile = await getCroppedImg(imageToCrop, croppedAreaPixels);
        if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        setAvatarFile(croppedFile);
        setAvatarPreview(URL.createObjectURL(croppedFile));
        setCropModalOpen(false);
        URL.revokeObjectURL(imageToCrop);
        setImageToCrop(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const userId = session.user.id;

    if (!isSystemAdmin && profileRole === SYSTEM_ADMIN_ROLE) {
      toast.error('You cannot assign yourself the System Administrator role.');
      setProfileLoading(false);
      return;
    }

    let finalAvatarUrl = avatarUrl;

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        finalAvatarUrl = publicUrlData.publicUrl;
      } else {
        console.error('Upload Error:', uploadError);
        toast.error(`Failed to upload avatar: ${uploadError.message}`);
        setProfileLoading(false);
        return;
      }
    }

    const updates = {
      id: userId,
      email: session.user.email,
      full_name: profileName,
      username: profileUsername,
      job_title: profileJobTitle,
      bio: profileBio,
      skills: skills,
      avatar_url: finalAvatarUrl,
      whatsapp_number: whatsappNumber,
      instagram_url: instagramUrl,
      linkedin_url: linkedinUrl,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updates, { onConflict: 'id' });

    if (!error) {
      setAvatarUrl(finalAvatarUrl);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarFile(null);
      setAvatarPreview(null);
    } else {
      console.error('Update Profile Error:', error.message, error.details, error.hint);
      toast.error(`Failed to update profile: ${error.message}`);
    }
    
    setProfileLoading(false);
  };


  return (
    <div className="min-h-screen bg-transparent flex font-outfit text-foreground relative">
      
      {/* SECTION A: Desktop Sidebar (fixed width) */}
      <aside className="hidden md:flex w-72 bg-card/80 backdrop-blur-xl border-r border-border flex-col shrink-0 relative z-10">
        <div>
          {/* User Profile */}
          <div className="p-8 border-b border-border flex items-center space-x-4">
            {isProfileFetching ? (
              <div className="w-full flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-full shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg border border-primary/20 overflow-hidden shrink-0">
                  {avatarPreview || avatarUrl ? (
                    <img src={avatarPreview || avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profileName ? profileName.charAt(0).toUpperCase() : 'A'
                  )}
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-medium text-foreground truncate">{profileName || 'User'}</h2>
                  <p className="text-xs text-muted-foreground truncate">{profileJobTitle || 'Developer'}</p>
                </div>
              </>
            )}
          </div>
          
          {/* Management Tabs */}
          <nav className="p-4 space-y-2 mt-4">
            <button 
              onClick={() => setActiveTab('manage')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'manage' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <FolderKanban size={18} />
              <span>{t('dashboard.my_projects')}</span>
            </button>
            {accountStatus === 'approved' && (
              <button 
                onClick={() => setActiveTab('publish')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'publish' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                <Plus size={18} />
                <span>{t('dashboard.publish_project')}</span>
              </button>
            )}
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <User size={18} />
              <span>{t('dashboard.profile')}</span>
            </button>
            {isSystemAdmin && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                <Star size={18} />
                <span>Manage Reviews</span>
              </button>
            )}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut size={18} />
            <span>{t('dashboard.sign_out')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border flex flex-col z-50 md:hidden shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold border border-primary/20 overflow-hidden">
                    {avatarPreview || avatarUrl ? (
                      <img src={avatarPreview || avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      profileName ? profileName.charAt(0).toUpperCase() : 'A'
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-foreground truncate">{profileName || 'User'}</h2>
                    <p className="text-xs text-muted-foreground truncate">{profileJobTitle || 'Developer'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-2 flex-1">
                <button 
                  onClick={() => { setActiveTab('manage'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'manage' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
                >
                  <FolderKanban size={18} />
                  <span>{t('dashboard.my_projects')}</span>
                </button>
                {accountStatus === 'approved' && (
                  <button 
                    onClick={() => { setActiveTab('publish'); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'publish' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
                  >
                    <Plus size={18} />
                    <span>{t('dashboard.publish_project')}</span>
                  </button>
                )}
                <button 
                  onClick={() => { setActiveTab('profile'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
                >
                  <User size={18} />
                  <span>{t('dashboard.profile')}</span>
                </button>
                {isSystemAdmin && (
                  <button 
                    onClick={() => { setActiveTab('admin'); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
                  >
                    <Star size={18} />
                    <span>Manage Reviews</span>
                  </button>
                )}
              </nav>

              <div className="pt-4 border-t border-border mt-auto">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut size={18} />
                  <span>{t('dashboard.sign_out')}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* SECTION B: Main Workspace */}
      <main className="flex-1 flex flex-col bg-transparent relative z-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 px-4 md:px-10 flex items-center justify-between border-b border-border bg-background/40 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="w-10 h-10 rounded-xl bg-card border border-border/80 flex items-center justify-center text-foreground md:hidden"
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg sm:text-xl font-medium text-foreground">
              {activeTab === 'manage' && t('dashboard.my_projects')}
              {activeTab === 'publish' && t('dashboard.publish_project')}
              {activeTab === 'profile' && t('dashboard.profile')}
              {activeTab === 'admin' && 'Manage Reviews'}
              {activeTab === 'team' && 'Manage Team'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeLanguageToggle />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto h-full">

            {/* Pending Account Banner */}
            {!isSystemAdmin && accountStatus === 'pending' && activeTab !== 'profile' && (
              <div className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-500">Account Under Review</h3>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    Your ELITE account is currently under review by administrators. You will be able to publish projects and appear in the community directory once your account has been approved.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'manage' && (
              <>
                {loading ? (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <p>{t('dashboard.loading_projects')}</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <FolderKanban size={48} className="mb-4 opacity-20" />
                    <p>{t('dashboard.no_projects_found')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col justify-between group hover:shadow-md transition-shadow h-64">
                        <div>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${item.personal_profile_only ? 'bg-violet-500/10 text-violet-500' : item.is_masterpiece ? 'bg-amber-500/10 text-amber-500' : 'bg-teal-500/10 text-teal-500'}`}>
                            <FolderKanban size={20} />
                          </div>
                          <h3 className="font-semibold text-foreground mb-1 line-clamp-1" title={item.title}>{item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${item.is_masterpiece ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                              {item.is_masterpiece ? 'Masterpiece' : 'Standard'}
                            </span>
                            {item.personal_profile_only && (
                              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20">
                                Profile Only
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEditProjectModal(item)}
                              className="text-muted-foreground hover:text-purple-500 transition-colors"
                              title="Edit Project"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => setItemToDelete(item.id)}
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'publish' && accountStatus !== 'approved' && !isSystemAdmin && (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Lock size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-medium text-foreground">Publishing Locked</p>
                <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">Your account must be approved by an administrator before you can publish projects.</p>
              </div>
            )}

            {activeTab === 'publish' && (accountStatus === 'approved' || isSystemAdmin) && (
              <form onSubmit={handlePublish} className="bg-card rounded-3xl p-10 shadow-sm border border-border max-w-2xl">
                <h2 className="text-2xl font-medium text-foreground mb-8">{t('dashboard.project_details')}</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t('dashboard.project_title')}</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                      placeholder={t('dashboard.title_placeholder')}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      {t('dashboard.description')} <span className="text-xs text-primary ml-2 font-normal">(Markdown supported)</span>
                    </label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground resize-none h-32"
                      placeholder={t('dashboard.description_placeholder')}
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Live URL</label>
                      <input 
                        type="url" 
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                        placeholder="https://your-project.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">GitHub URL</label>
                      <input 
                        type="url" 
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t('dashboard.project_images')}</label>
                    <div className="bg-background border border-dashed border-input rounded-xl p-6 flex flex-col items-center justify-center transition-colors hover:bg-secondary">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                        <ImageIcon size={24} />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">{t('dashboard.click_to_upload')}</p>
                      <p className="text-xs text-muted-foreground mb-4">{t('dashboard.supported_formats')}</p>
                      <label className="px-4 py-2 bg-card border border-input text-foreground rounded-lg text-sm font-medium cursor-pointer hover:bg-secondary transition-colors shadow-sm flex items-center space-x-2">
                        <Upload size={16} />
                        <span>{t('dashboard.select_files')}</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                    {imagePreviewUrls.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className={`relative group rounded-lg overflow-hidden border-2 aspect-square bg-muted ${mainImageIndex === index ? 'border-primary' : 'border-transparent'}`}>
                            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              {mainImageIndex !== index && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); setMainImageIndex(index); }}
                                  className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-sm hover:bg-primary/90 transition-colors"
                                >
                                  Set Main
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="w-8 h-8 bg-white/20 hover:bg-red-500/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            {mainImageIndex === index && (
                              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                MAIN
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Contributors Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-muted-foreground">{t('dashboard.contributors')}</label>
                      <button 
                        type="button" 
                        onClick={() => setIsContributorModalOpen(true)}
                        className="text-sm text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
                      >
                        <Plus size={16} />
                        <span>{t('dashboard.add_team_member')}</span>
                      </button>
                    </div>
                    {selectedContributors.length === 0 ? (
                      <div className="w-full px-4 py-4 rounded-xl bg-background border border-input text-sm text-muted-foreground flex items-center space-x-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span>{t('dashboard.no_contributors')}</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedContributors.map(user => (
                          <div key={user.id} className="flex items-center space-x-2 bg-card border border-input text-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs md:text-sm font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <span>{user.name}</span>
                            <button
                              type="button"
                              onClick={() => removeSelectedContributor(user.id)}
                              className="text-muted-foreground hover:text-red-500 transition-colors focus:outline-none"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Personal Profile Only Toggle */}
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div>
                      <h4 className="font-medium text-foreground flex items-center space-x-2">
                        <span>{t('dashboard.personal_profile_only')}</span>
                        <span className="bg-violet-500/20 text-violet-600 dark:text-violet-400 text-xs md:text-sm px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">{t('dashboard.new_badge')}</span>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{t('dashboard.personal_profile_desc')}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const next = !personalProfileOnly;
                        setPersonalProfileOnly(next);
                      }}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${personalProfileOnly ? 'bg-violet-500' : 'bg-input'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${personalProfileOnly ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[160px] justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>{t('dashboard.publishing')}</span>
                        </>
                      ) : (
                        <span>{t('dashboard.publish_now')}</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="bg-card rounded-3xl p-10 shadow-sm border border-border max-w-2xl">
                <h2 className="text-2xl font-medium text-foreground mb-8 text-center">{t('dashboard.profile_settings')}</h2>
                
                {/* Avatar Upload */}
                <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-card shadow-md mx-auto mb-8 bg-muted">
                  {avatarPreview || avatarUrl ? (
                    <img src={avatarPreview || avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-primary font-semibold bg-primary/10">
                      {profileName ? profileName.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300">
                    <Camera className="text-white w-8 h-8" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t('dashboard.full_name')}</label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">{t('dashboard.username')}</label>
                    <input 
                      type="text" 
                      value={profileUsername}
                      onChange={(e) => setProfileUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">{t('dashboard.role_title')}</label>
                  <input 
                    type="text" 
                    value={profileJobTitle}
                    onChange={(e) => setProfileJobTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    placeholder="e.g. Senior Frontend Engineer"
                    required
                  />
                  {isSystemAdmin && (
                    <p className="text-xs text-indigo-500 mt-1.5 flex items-center gap-1 font-medium bg-indigo-500/10 px-1.5 py-0.5 rounded-lg w-fit border border-indigo-500/20">
                      <Shield size={12} className="text-indigo-600" />
                      {t('dashboard.system_administrator')}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">{t('dashboard.bio')}</label>
                  <textarea 
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground resize-none h-32"
                    placeholder="..."
                  ></textarea>
                </div>

                {/* Dynamic Skills System */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">{t('dashboard.skills_tech')}</label>
                  <div className="flex space-x-2 mb-3">
                    <input 
                      type="text" 
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      className="flex-1 px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                      placeholder={t('dashboard.skills_placeholder')}
                    />
                    <button 
                      type="button"
                      onClick={addSkill}
                      className="w-12 h-12 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl flex items-center justify-center transition-colors border border-input"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {skills.map((skill) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          layout
                          className="flex items-center space-x-2 bg-card border border-input text-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-muted-foreground hover:text-red-500 transition-colors focus:outline-none"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>



                <div className="pt-4 flex justify-end border-t border-border">
                  <button 
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center min-w-[150px]"
                  >
                    {profileLoading ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{t('dashboard.saving')}</span>
                      </span>
                    ) : t('dashboard.save_changes')}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'admin' && !isProfileFetching && !isSystemAdmin && (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <Lock size={32} />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Access Denied</h2>
                <p className="text-muted-foreground max-w-md">
                  You do not have permission to access the Admin Panel. This area is restricted to System Administrators only.
                </p>
                <button
                  onClick={() => setActiveTab('manage')}
                  className="mt-8 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {activeTab === 'admin' && isSystemAdmin && (
              <ManageReviewsPanel />
            )}

            {activeTab === 'team' && isSystemAdmin && (
              <AdminPanel 
                isSystemAdmin={isSystemAdmin}
                pendingUsers={pendingUsers}
                setPendingUsers={setPendingUsers}
                adminLoading={adminLoading}
                setAdminLoading={setAdminLoading}
              />
            )}
            
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl p-6 shadow-xl w-full max-w-sm border border-border transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Confirm Deletion</h3>
              <button onClick={() => setItemToDelete(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editProjectModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-card rounded-3xl p-6 md:p-10 shadow-2xl w-full max-w-2xl border border-border my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground font-alexandria">Edit Project</h3>
              <button 
                onClick={() => setEditProjectModalOpen(false)} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">{t('dashboard.project_title', 'Project Title')}</label>
                <input
                  type="text"
                  value={editProjectTitle}
                  onChange={(e) => setEditProjectTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t('dashboard.description', 'Description')} <span className="text-xs text-primary ml-2 font-normal">(Markdown supported)</span>
                </label>
                <textarea
                  value={editProjectDescription}
                  onChange={(e) => setEditProjectDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground resize-none h-32"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Live URL</label>
                  <input
                    type="url"
                    value={editProjectLiveUrl}
                    onChange={(e) => setEditProjectLiveUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={editProjectGithubUrl}
                    onChange={(e) => setEditProjectGithubUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <h4 className="font-medium text-foreground flex items-center space-x-2">
                    <span>{t('dashboard.personal_profile_only', 'Personal Profile Only')}</span>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Only show on your developer profile (hide from public feed).</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !editProjectPersonalProfileOnly;
                    setEditProjectPersonalProfileOnly(next);
                  }}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${editProjectPersonalProfileOnly ? 'bg-violet-500' : 'bg-input'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${editProjectPersonalProfileOnly ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex justify-end pt-4 space-x-3 space-x-reverse">
                <button
                  type="button"
                  onClick={() => setEditProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {t('dashboard_articles.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={editProjectSubmitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2 space-x-reverse"
                >
                  {editProjectSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{t('dashboard.saving', 'Saving...')}</span>
                    </>
                  ) : (
                    <span>{t('dashboard.save_changes', 'Save Changes')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {cropModalOpen && imageToCrop && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md p-4">
          <div className="bg-card rounded-3xl p-6 shadow-2xl w-full max-w-lg border border-border flex flex-col">
            <h3 className="text-lg font-medium text-foreground mb-4">Crop Avatar</h3>
            <div className="relative w-full h-80 bg-muted rounded-xl overflow-hidden mb-6">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  if (imageToCrop) {
                    URL.revokeObjectURL(imageToCrop);
                    setImageToCrop(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleApplyCrop}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors shadow-sm"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contributor Search Modal */}
      {isContributorModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-md border border-border flex flex-col h-[500px] overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center bg-card shrink-0">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <Users size={20} className="text-primary" />
                <span>Add Contributors</span>
              </h3>
              <button type="button" onClick={() => setIsContributorModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 border-b border-border bg-secondary/50 shrink-0">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  value={contributorSearchQuery}
                  onChange={(e) => setContributorSearchQuery(e.target.value)}
                  placeholder="Search by name or @username..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-foreground"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {contributorSearchLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Loader2 size={24} className="animate-spin mb-3" />
                  <p className="text-sm">Searching developers...</p>
                </div>
              ) : !contributorSearchQuery.trim() ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
                  <Users size={32} className="mb-3 opacity-20" />
                  <p className="text-sm">Type a name or username to search</p>
                </div>
              ) : searchedProfiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
                  <Search size={32} className="mb-3 opacity-20" />
                  <p className="text-sm">No developers found matching "{contributorSearchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {searchedProfiles.map(user => {
                    const isSelected = !!selectedContributors.find(c => c.id === user.id);
                    return (
                      <button 
                        key={user.id}
                        type="button"
                        onClick={() => toggleContributor({ id: user.id, name: user.full_name || user.username, username: user.username })}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-secondary'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground font-medium shrink-0 overflow-hidden">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                            ) : (
                              (user.full_name || user.username || '?').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">{user.full_name || user.username}</p>
                            <p className="text-xs text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                            <Check size={14} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="p-5 border-t border-border bg-card shrink-0 flex justify-end">
              <button 
                type="button"
                onClick={() => setIsContributorModalOpen(false)}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-all shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// ------------------------------------------------------------------

export default Dashboard;

