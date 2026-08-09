import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { X, Save, Loader2, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AdminEditProjectModalProps {
  projectId: string;
  onClose: () => void;
}

export const AdminEditProjectModal: React.FC<AdminEditProjectModalProps> = ({ projectId, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isMasterpiece, setIsMasterpiece] = useState(false);
  const [personalProfileOnly, setPersonalProfileOnly] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) throw error;
        
        if (data) {
          setTitle(data.title || '');
          setDescription(data.description || '');
          setLiveUrl(data.live_url || '');
          setGithubUrl(data.github_url || '');
          setIsMasterpiece(data.is_masterpiece || false);
          setPersonalProfileOnly(data.personal_profile_only || false);
        }
      } catch (err: any) {
        toast.error('Failed to load project');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, onClose]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title,
          description,
          live_url: liveUrl,
          github_url: githubUrl,
          is_masterpiece: isMasterpiece,
          personal_profile_only: personalProfileOnly,
        })
        .eq('id', projectId);

      if (error) throw error;
      
      toast.success('Project updated successfully');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-[#FAFAFA] rounded-3xl p-8 shadow-2xl w-full max-w-2xl border border-slate-100 transform transition-all relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-2 shadow-sm"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Project</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
            <input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-purple-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-purple-500 resize-none" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Live URL</label>
              <input 
                value={liveUrl}
                onChange={e => setLiveUrl(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-purple-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GitHub URL</label>
              <input 
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-purple-500" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isMasterpiece}
                onChange={e => setIsMasterpiece(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-slate-700">Masterpiece</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={personalProfileOnly}
                onChange={e => setPersonalProfileOnly(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-slate-700">Personal Profile Only</span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
