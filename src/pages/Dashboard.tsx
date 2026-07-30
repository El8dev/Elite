import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, User, FolderKanban, Plus, Trash2, Settings, Bell, X, Camera, Image as ImageIcon, Upload, Users, Search, Check, Loader2, Shield, Clock, CheckCircle, XCircle, Lock, UserCog, FileText, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Cropper, { Area } from 'react-easy-crop';
import { motion, AnimatePresence } from 'motion/react';
import { getCroppedImg } from '@/lib/cropImage';
import { toast } from 'sonner';
import { Article, fetchArticlesByAuthor, createArticle, updateArticle, deleteArticle } from '@/features/articles/services/articles.service';

// Define the type based on requirements
interface DashboardProject {
  id: string;
  title: string;
  description: string;
  is_masterpiece: boolean;
  personal_profile_only: boolean;
  image_url?: string[];
  created_at?: string;
}

interface SearchedProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
}

interface AdminProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  account_status: string | null;
  role: string | null;
  job_title: string | null;
}

interface PendingUser {
  id: string;
  full_name: string | null;
  username: string | null;
  role: string | null;
  job_title: string | null;
  bio: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  account_status: string | null;
  created_at: string | null;
}

type AdminSubSection = 'pending' | 'users';

const SYSTEM_ADMIN_ROLE = 'System Administrator';
const DEFAULT_MEMBER_ROLE = 'Member';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manage');
  const [isMasterpiece, setIsMasterpiece] = useState(false);
  const [personalProfileOnly, setPersonalProfileOnly] = useState(false);
  const [items, setItems] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Publish form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
  const [articleCategory, setArticleCategory] = useState('الذكاء الاصطناعي');
  const [articleReadTime, setArticleReadTime] = useState('5 دقائق');
  const [articleImageUrl, setArticleImageUrl] = useState('');
  const [articleSubmitting, setArticleSubmitting] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

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
      setArticleReadTime(article.read_time || article.readTime || '5 دقائق');
      setArticleImageUrl(article.image_url || article.image || '');
    } else {
      setEditingArticleId(null);
      setArticleTitle('');
      setArticleExcerpt('');
      setArticleContent('');
      setArticleCategory('الذكاء الاصطناعي');
      setArticleReadTime('5 دقائق');
      setArticleImageUrl('');
    }
    setArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle || !articleExcerpt || !currentUserId) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
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
        toast.success('تم تحديث المقال بنجاح!');
      } else {
        await createArticle({
          title: articleTitle,
          excerpt: articleExcerpt,
          content: articleContent,
          category: articleCategory,
          read_time: articleReadTime,
          image_url: articleImageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450',
          author_id: currentUserId,
          author_name: profileName || 'محرر التقنية',
          author_avatar: avatarUrl || avatarPreview || 'https://i.pravatar.cc/150',
        });
        toast.success('تم نشر المقال بنجاح!');
      }

      setArticleModalOpen(false);
      fetchUserArticles(currentUserId);
    } catch (err: any) {
      console.error('Error saving article:', err);
      toast.error(`حدث خطأ أثناء حفظ المقال: ${err.message}`);
    } finally {
      setArticleSubmitting(false);
    }
  };

  const handleConfirmDeleteArticle = async () => {
    if (!articleToDelete || !currentUserId) return;
    try {
      await deleteArticle(articleToDelete);
      toast.success('تم حذف المقال بنجاح');
      setArticleToDelete(null);
      fetchUserArticles(currentUserId);
    } catch (err: any) {
      console.error('Error deleting article:', err);
      toast.error(`فشل حذف المقال: ${err.message}`);
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
        .select('id, title, description, is_masterpiece, personal_profile_only, created_at, project_contributors(user_id)')
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

      // ── Task 2: Insert project into the database ──
      const { data: newProject, error: insertError } = await supabase
        .from('projects')
        .insert([
          {
            title,
            description,
            is_masterpiece: isMasterpiece,
            personal_profile_only: personalProfileOnly,
            owner_id: currentUserId,
            image_url: uploadedImageUrls,
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
      setIsMasterpiece(false);
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
    <div className="h-screen w-full bg-[#F5F7F9] flex overflow-hidden font-sans text-slate-800 relative">
      
      {/* SECTION A: Sidebar Panel */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between shadow-[2px_0_15px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <div>
          {/* User Profile */}
          <div className="p-8 border-b border-slate-100 flex items-center space-x-4">
            {isProfileFetching ? (
              <div className="w-full flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-semibold text-lg border border-blue-100 overflow-hidden shrink-0">
                  {avatarPreview || avatarUrl ? (
                    <img src={avatarPreview || avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profileName ? profileName.charAt(0).toUpperCase() : 'A'
                  )}
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-medium text-slate-800 truncate">{profileName || 'User'}</h2>
                  <p className="text-xs text-slate-500 truncate">{profileJobTitle || 'Developer'}</p>
                </div>
              </>
            )}
          </div>
          
          {/* Management Tabs */}
          <nav className="p-4 space-y-2 mt-4">
            <button 
              onClick={() => setActiveTab('manage')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'manage' ? 'bg-[#F0F4F8] text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <FolderKanban size={18} />
              <span>Manage Projects</span>
            </button>
            {accountStatus === 'approved' && (
              <>
                <button 
                  onClick={() => setActiveTab('publish')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'publish' ? 'bg-[#F0F4F8] text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Plus size={18} />
                  <span>Publish Project</span>
                </button>
                <button 
                  onClick={() => setActiveTab('articles')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'articles' ? 'bg-[#F0F4F8] text-purple-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <FileText size={18} />
                  <span>Manage Articles</span>
                </button>
              </>
            )}
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-[#F0F4F8] text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <User size={18} />
              <span>Profile Settings</span>
            </button>
            {isSystemAdmin && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-[#F0F4F8] text-purple-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Shield size={18} />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* SECTION B: Main Workspace */}
      <main className="flex-1 flex flex-col bg-[#F5F7F9] relative z-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 px-10 flex items-center justify-between border-b border-slate-200/50 bg-white/50 backdrop-blur-sm shrink-0">
          <h1 className="text-xl font-medium text-slate-800">
            {activeTab === 'manage' && 'My Projects'}
            {activeTab === 'publish' && 'Publish New Project'}
            {activeTab === 'articles' && 'Articles & Blog Management'}
            {activeTab === 'profile' && 'Profile Settings'}
            {activeTab === 'admin' && 'Admin Panel'}
          </h1>
          <div className="flex items-center space-x-4 text-slate-400">
            <button className="hover:text-slate-600 transition-colors"><Settings size={20} /></button>
            <button className="hover:text-slate-600 transition-colors"><Bell size={20} /></button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto h-full">

            {/* Pending Account Banner */}
            {!isSystemAdmin && accountStatus === 'pending' && activeTab !== 'profile' && (
              <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-800">Account Under Review</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Your ELITE account is currently under review by administrators. You will be able to publish projects and appear in the community directory once your account has been approved.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'manage' && (
              <>
                {loading ? (
                  <div className="flex items-center justify-center h-64 text-slate-400">
                    <p>Loading projects...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <FolderKanban size={48} className="mb-4 opacity-20" />
                    <p>No projects found. Publish your first project!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-shadow h-64">
                        <div>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${item.personal_profile_only ? 'bg-violet-50 text-violet-500' : item.is_masterpiece ? 'bg-amber-50 text-amber-500' : 'bg-teal-50 text-teal-500'}`}>
                            <FolderKanban size={20} />
                          </div>
                          <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1" title={item.title}>{item.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-3">{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${item.is_masterpiece ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-blue-50 text-blue-600'}`}>
                              {item.is_masterpiece ? 'Masterpiece' : 'Standard'}
                            </span>
                            {item.personal_profile_only && (
                              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200">
                                Profile Only
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => setItemToDelete(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'publish' && accountStatus !== 'approved' && !isSystemAdmin && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Lock size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-medium text-slate-600">Publishing Locked</p>
                <p className="text-sm text-slate-400 mt-2 text-center max-w-md">Your account must be approved by an administrator before you can publish projects.</p>
              </div>
            )}

            {activeTab === 'publish' && (accountStatus === 'approved' || isSystemAdmin) && (
              <form onSubmit={handlePublish} className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 max-w-2xl">
                <h2 className="text-2xl font-medium text-slate-800 mb-8">Project Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-800"
                      placeholder="Enter a descriptive title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-800 resize-none h-32"
                      placeholder="Describe your project's goals and outcomes..."
                      required
                    ></textarea>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Images (Up to 10)</label>
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center transition-colors hover:bg-slate-100">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                        <ImageIcon size={24} />
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Click to upload images</p>
                      <p className="text-xs text-slate-500 mb-4">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                      <label className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors shadow-sm flex items-center space-x-2">
                        <Upload size={16} />
                        <span>Select Files</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                    {imagePreviewUrls.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="w-8 h-8 bg-white/20 hover:bg-red-500/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Contributors Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700">Contributors</label>
                      <button 
                        type="button" 
                        onClick={() => setIsContributorModalOpen(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                      >
                        <Plus size={16} />
                        <span>Add Team Member</span>
                      </button>
                    </div>
                    {selectedContributors.length === 0 ? (
                      <div className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500 flex items-center space-x-2">
                        <Users size={16} className="text-slate-400" />
                        <span>No contributors added yet.</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedContributors.map(user => (
                          <div key={user.id} className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs md:text-sm font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <span>{user.name}</span>
                            <button
                              type="button"
                              onClick={() => removeSelectedContributor(user.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Masterpiece Toggle Switch */}
                  <div className={`flex items-center justify-between py-4 border-y border-slate-100 transition-opacity ${personalProfileOnly ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div>
                      <h4 className="font-medium text-slate-800 flex items-center space-x-2">
                        <span>Masterpiece Badge</span>
                        <span className="bg-amber-100 text-amber-700 text-xs md:text-sm px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">New</span>
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">Highlight this project as a masterpiece on your profile.</p>
                      {personalProfileOnly && (
                        <p className="text-xs text-violet-500 mt-1">Disabled — cannot combine with Personal Profile Only.</p>
                      )}
                    </div>
                    <button 
                      type="button"
                      disabled={personalProfileOnly}
                      onClick={() => setIsMasterpiece(!isMasterpiece)}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${isMasterpiece ? 'bg-amber-500' : 'bg-slate-200'} ${personalProfileOnly ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isMasterpiece ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Personal Profile Only Toggle */}
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-medium text-slate-800 flex items-center space-x-2">
                        <span>Personal Profile Only</span>
                        <span className="bg-violet-100 text-violet-700 text-xs md:text-sm px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">New</span>
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">Show only on your profile — hidden from public feeds.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const next = !personalProfileOnly;
                        setPersonalProfileOnly(next);
                        if (next) setIsMasterpiece(false);
                      }}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${personalProfileOnly ? 'bg-violet-500' : 'bg-slate-200'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${personalProfileOnly ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[160px] justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <span>Publish Now</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 max-w-2xl">
                <h2 className="text-2xl font-medium text-slate-800 mb-8 text-center">Profile Settings</h2>
                
                {/* Avatar Upload */}
                <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto mb-8 bg-slate-50">
                  {avatarPreview || avatarUrl ? (
                    <img src={avatarPreview || avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-blue-500 font-semibold bg-blue-50">
                      {profileName ? profileName.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300">
                    <Camera className="text-white w-8 h-8" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                    <input 
                      type="text" 
                      value={profileUsername}
                      onChange={(e) => setProfileUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role / Title</label>
                  <input 
                    type="text" 
                    value={profileJobTitle}
                    onChange={(e) => setProfileJobTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-800"
                    placeholder="e.g. Senior Frontend Engineer"
                    required
                  />
                  {isSystemAdmin && (
                    <p className="text-xs text-indigo-500 mt-1.5 flex items-center gap-1 font-medium bg-indigo-50 px-1.5 py-0.5.5 rounded-lg w-fit border border-indigo-100">
                      <Shield size={12} className="text-indigo-600" />
                      System Administrator
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                  <textarea 
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-800 resize-none h-32"
                    placeholder="Tell us a little about yourself..."
                  ></textarea>
                </div>

                {/* Dynamic Skills System */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skills & Technologies</label>
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
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-800"
                      placeholder="e.g. React, Python, UI/UX"
                    />
                    <button 
                      type="button"
                      onClick={addSkill}
                      className="w-12 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition-colors border border-slate-200"
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
                          className="flex items-center space-x-2 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Contact & Social Links */}
                <div className="mb-6 space-y-4">
                  <h3 className="block text-sm font-medium text-slate-700">Contact & Social Links</h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">WhatsApp Number (with country code, e.g., 964...)</label>
                    <input 
                      type="text" 
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-800"
                      placeholder="e.g. 9647701234567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Instagram URL</label>
                    <input 
                      type="url" 
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-800"
                      placeholder="e.g. https://instagram.com/username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">LinkedIn URL</label>
                    <input 
                      type="url" 
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-800"
                      placeholder="e.g. https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-slate-100">
                  <button 
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center min-w-[150px]"
                  >
                    {profileLoading ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </span>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'admin' && !isProfileFetching && !isSystemAdmin && (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <Lock size={32} />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">Access Denied</h2>
                <p className="text-slate-500 max-w-md">
                  You do not have permission to access the Admin Panel. This area is restricted to System Administrators only.
                </p>
                <button
                  onClick={() => setActiveTab('manage')}
                  className="mt-8 px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 font-alexandria">إدارة المقالات والمدونة</h2>
                    <p className="text-sm text-slate-500 mt-1 font-alexandria">قم بنشر وتعديل المقالات التقنية الخاصة بك ليراها زوار الموقع</p>
                  </div>
                  <button
                    onClick={() => openArticleModal()}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 shadow-sm font-alexandria"
                  >
                    <Plus size={18} />
                    <span>كتابة مقال جديد</span>
                  </button>
                </div>

                {userArticlesLoading ? (
                  <div className="flex items-center justify-center h-64 text-slate-400">
                    <Loader2 size={24} className="animate-spin mr-3" />
                    <p className="font-alexandria">جاري تحميل المقالات...</p>
                  </div>
                ) : userArticles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-100 p-8 text-center">
                    <FileText size={48} className="mb-4 text-purple-300" />
                    <h3 className="text-lg font-medium text-slate-700 font-alexandria">لا توجد مقالات منشورة بعد</h3>
                    <p className="text-sm text-slate-400 mt-1 mb-6 font-alexandria">ابدأ بنشر مقالك التقني الأول ليظهر في قسم المقالات العام</p>
                    <button
                      onClick={() => openArticleModal()}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm font-alexandria"
                    >
                      كتابة مقال جديد
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                    {userArticles.map((article) => (
                      <div key={article.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-100 font-alexandria">
                              {article.category || 'عام'}
                            </span>
                            <span className="text-xs text-slate-400 font-alexandria">{article.read_time || article.readTime || '5 دقائق'}</span>
                          </div>
                          <h3 className="font-semibold text-slate-800 text-lg mb-2 line-clamp-1 font-alexandria">{article.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-3 mb-4 font-alexandria">{article.excerpt}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className="text-xs text-slate-400 font-alexandria">
                            {article.created_at ? new Date(article.created_at).toLocaleDateString('ar-EG') : 'حديثاً'}
                          </span>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => openArticleModal(article)}
                              className="p-2 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                              title="تعديل المقال"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => setArticleToDelete(article.id)}
                              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="حذف المقال"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </main>

      {/* Create / Edit Article Modal */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 font-alexandria">
                {editingArticleId ? 'تعديل المقال' : 'نشر مقال جديد'}
              </h3>
              <button 
                onClick={() => setArticleModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 font-alexandria">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">عنوان المقال</label>
                <input
                  type="text"
                  required
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="مثال: كيف يغير الذكاء الاصطناعي مستقبل البرمجة؟"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">التصنيف</label>
                  <select
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all text-slate-800"
                  >
                    <option value="الذكاء الاصطناعي">الذكاء الاصطناعي</option>
                    <option value="تطوير الويب">تطوير الويب</option>
                    <option value="أنظمة الأعمال">أنظمة الأعمال</option>
                    <option value="UI/UX">تجربة المستخدم UI/UX</option>
                    <option value="أمن المعلومات">أمن المعلومات</option>
                    <option value="عام">عام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">وقت القراءة المقدر</label>
                  <input
                    type="text"
                    value={articleReadTime}
                    onChange={(e) => setArticleReadTime(e.target.value)}
                    placeholder="مثال: 5 دقائق"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">رابط غلاف المقال (صورة URL)</label>
                <input
                  type="url"
                  value={articleImageUrl}
                  onChange={(e) => setArticleImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all text-slate-800 dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">الملخص الموجز (Excerpt)</label>
                <textarea
                  required
                  rows={2}
                  value={articleExcerpt}
                  onChange={(e) => setArticleExcerpt(e.target.value)}
                  placeholder="موجز قصير يظهر في بطاقة المقال الرئيسية..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">المحتوى الكامل للمقال</label>
                <textarea
                  rows={5}
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  placeholder="اكتب نص المقال الكامل هنا..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all text-slate-800 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={articleSubmitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2 space-x-reverse"
                >
                  {articleSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <span>{editingArticleId ? 'حفظ التعديلات' : 'نشر المقال'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Article Confirmation Modal */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm border border-slate-100 font-alexandria">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">تأكيد حذف المقال</h3>
              <button onClick={() => setArticleToDelete(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              هل أنت تأكد من رغبتك في حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
            </p>
            <div className="flex justify-end space-x-3 space-x-reverse">
              <button 
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleConfirmDeleteArticle}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm border border-slate-100 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Confirm Deletion</h3>
              <button onClick={() => setItemToDelete(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
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

      {/* Image Cropper Modal */}
      {cropModalOpen && imageToCrop && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Crop Avatar</h3>
            <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden mb-6">
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
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleApplyCrop}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contributor Search Modal */}
      {isContributorModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 flex flex-col h-[500px] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                <Users size={20} className="text-blue-500" />
                <span>Add Contributors</span>
              </h3>
              <button type="button" onClick={() => setIsContributorModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={contributorSearchQuery}
                  onChange={(e) => setContributorSearchQuery(e.target.value)}
                  placeholder="Search by name or @username..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-sm text-slate-800"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {contributorSearchLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Loader2 size={24} className="animate-spin mb-3" />
                  <p className="text-sm">Searching developers...</p>
                </div>
              ) : !contributorSearchQuery.trim() ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                  <Users size={32} className="mb-3 opacity-20" />
                  <p className="text-sm">Type a name or username to search</p>
                </div>
              ) : searchedProfiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
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
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-medium shrink-0 overflow-hidden">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                            ) : (
                              (user.full_name || user.username || '?').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-slate-800">{user.full_name || user.username}</p>
                            <p className="text-xs text-slate-500">@{user.username}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                            <Check size={14} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-white shrink-0 flex justify-end">
              <button 
                type="button"
                onClick={() => setIsContributorModalOpen(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
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
// AdminPanel Component
// ------------------------------------------------------------------
interface AdminPanelProps {
  isSystemAdmin: boolean;
  pendingUsers: PendingUser[];
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>;
  adminLoading: boolean;
  setAdminLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const accountStatusStyles: Record<string, string> = {
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const AdminPanel: React.FC<AdminPanelProps> = ({ isSystemAdmin, pendingUsers, setPendingUsers, adminLoading, setAdminLoading }) => {
  const [activeSection, setActiveSection] = useState<AdminSubSection>('pending');

  if (!isSystemAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-md">
          You do not have permission to access the Admin Panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => setActiveSection('pending')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeSection === 'pending'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Clock size={16} />
          <span>Pending Approvals</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('users')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeSection === 'users'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <UserCog size={16} />
          <span>Manage All Users</span>
        </button>
      </nav>

      {activeSection === 'pending' ? (
        <PendingApprovalsSection
          isSystemAdmin={isSystemAdmin}
          pendingUsers={pendingUsers}
          setPendingUsers={setPendingUsers}
          adminLoading={adminLoading}
          setAdminLoading={setAdminLoading}
        />
      ) : (
        <ManageAllUsersSection isSystemAdmin={isSystemAdmin} />
      )}
    </div>
  );
};

// ------------------------------------------------------------------
// Pending Approvals Sub-section
// ------------------------------------------------------------------
interface PendingApprovalsSectionProps {
  isSystemAdmin: boolean;
  pendingUsers: PendingUser[];
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>;
  adminLoading: boolean;
  setAdminLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PendingApprovalsSection: React.FC<PendingApprovalsSectionProps> = ({
  isSystemAdmin,
  pendingUsers,
  setPendingUsers,
  adminLoading,
  setAdminLoading,
}) => {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isSystemAdmin) {
      fetchPendingUsers();
    }
  }, [isSystemAdmin]);

  const fetchPendingUsers = async () => {
    if (!isSystemAdmin) return;
    setAdminLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, role, job_title, bio, avatar_url, skills, account_status, created_at')
        .eq('account_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingUsers(data || []);
    } catch (err: any) {
      console.error('Error fetching pending users:', err);
      toast.error('Failed to load pending users.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAction = async (userId: string, action: 'approved' | 'rejected') => {
    if (!isSystemAdmin) return;
    setActionLoadingId(userId);
    try {
      console.log(`Attempting to ${action} user ${userId}...`);
      const { error } = await supabase
        .from('profiles')
        .update({ account_status: action })
        .eq('id', userId);

      if (error) {
        console.error('Supabase update error details:', error);
        throw error;
      }

      console.log(`Successfully updated user ${userId} to ${action}`);
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      toast.success(`User ${action === 'approved' ? 'approved' : 'rejected'} successfully.`);
    } catch (err: any) {
      console.error(`[Admin Panel] Error ${action} user ${userId}:`, err);
      // Detailed logging for Supabase errors
      if (err?.code) console.error('Error code:', err.code);
      if (err?.message) console.error('Error message:', err.message);
      if (err?.details) console.error('Error details:', err.details);
      
      toast.error(`Failed to ${action === 'approved' ? 'approve' : 'reject'} user. See console for details.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 size={24} className="animate-spin mr-3" />
        <p>Loading pending users...</p>
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <CheckCircle size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium text-slate-600">All Clear!</p>
        <p className="text-sm text-slate-400 mt-2">No pending accounts to review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-500">{pendingUsers.length} account{pendingUsers.length !== 1 ? 's' : ''} awaiting review</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pendingUsers.map((user) => (
          <motion.div
            key={user.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-500 font-semibold text-xl shrink-0 overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name || undefined} className="w-full h-full object-cover" />
                ) : (
                  (user.full_name || user.username || '?').charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{user.full_name || user.username || 'Unknown'}</h3>
                <p className="text-xs text-slate-500 truncate">@{user.username || 'no-username'}</p>
                {user.job_title && <p className="text-xs text-purple-600 font-medium mt-1">{user.job_title}</p>}
                {user.role === SYSTEM_ADMIN_ROLE && <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs md:text-sm rounded-md font-bold uppercase tracking-wider">Admin</span>}
                {user.bio && (
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{user.bio}</p>
                )}
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {user.skills.slice(0, 4).map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 4 && (
                      <span className="px-2 py-0.5 text-slate-400 text-sm">+{user.skills.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleAction(user.id, 'rejected')}
                disabled={actionLoadingId === user.id}
                className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center space-x-1.5"
              >
                <XCircle size={16} />
                <span>Reject</span>
              </button>
              <button
                onClick={() => handleAction(user.id, 'approved')}
                disabled={actionLoadingId === user.id}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-1.5"
              >
                <CheckCircle size={16} />
                <span>Approve</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Manage All Users Sub-section
// ------------------------------------------------------------------
interface ManageAllUsersSectionProps {
  isSystemAdmin: boolean;
}

const ManageAllUsersSection: React.FC<ManageAllUsersSectionProps> = ({ isSystemAdmin }) => {
  const [users, setUsers] = useState<AdminProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (isSystemAdmin) {
      fetchAllUsers();
    } else {
      setLoading(false);
    }
  }, [isSystemAdmin]);

  const handleDeleteUser = async (userId: string) => {
    if (!isSystemAdmin) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.rpc('delete_user_completely', { target_user_id: userId });

      if (error) throw error;

      // Update local state immediately for instant UI refresh
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted successfully.');
      setUserToDelete(null);
    } catch (err: any) {
      console.error("Deletion failed:", err);
      toast.error(err?.message || 'Failed to delete user.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    if (!isSystemAdmin) return;

    setLoading(true);
    setFetchError(null);
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('id, full_name, email, account_status, role, job_title, created_at', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(Array.isArray(data) ? data : []);

      if (count !== null && Array.isArray(data) && data.length !== count) {
        console.warn(`Profile count mismatch: fetched ${data.length}, total ${count}`);
      }
    } catch (err: any) {
      console.error('Error fetching all users:', err);
      const message = err?.message || 'Failed to load users.';
      setFetchError(message);
      toast.error(message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isSystemAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Lock size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium text-slate-600">Access Denied</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 size={24} className="animate-spin mr-3" />
        <p>Loading users...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <XCircle size={48} className="mb-4 text-red-400 opacity-60" />
        <p className="text-lg font-medium text-slate-600">Unable to Load Users</p>
        <p className="text-sm text-slate-400 mt-2 max-w-md">{fetchError}</p>
        <button
          onClick={fetchAllUsers}
          className="mt-6 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Users size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium text-slate-600">No Users Found</p>
        <p className="text-sm text-slate-400 mt-2">There are no registered profiles in the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">
          Team Count: <span className="text-purple-600">{users.length}</span>
        </p>
        <button
          onClick={fetchAllUsers}
          className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Account Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const statusKey = (user.account_status || 'pending').toLowerCase();
                const statusClass = accountStatusStyles[statusKey] || 'bg-slate-50 text-slate-600 border-slate-200';

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">
                      {user.full_name || '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {user.email || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusClass}`}>
                        {user.account_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {user.job_title || '—'}
                      {user.role === SYSTEM_ADMIN_ROLE && (
                        <span className="ml-2 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs md:text-sm rounded uppercase font-bold">Admin</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setUserToDelete(user.id)}
                        disabled={deleteLoading}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-[#FAFAFA] shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] transition-all duration-300 hover:shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff] hover:scale-105 active:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
          <div className="bg-[#FAFAFA] rounded-2xl p-6 shadow-[20px_20px_60px_#d1d1d1,-20px_-20px_60px_#ffffff] w-full max-w-sm border border-slate-100 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Confirm Deletion</h3>
              <button 
                onClick={() => setUserToDelete(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
                disabled={deleteLoading}
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setUserToDelete(null)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-[#FAFAFA] shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] hover:shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff] transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteUser(userToDelete)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
