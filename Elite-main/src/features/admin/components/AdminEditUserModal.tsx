import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { X, Save, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AdminEditUserModalProps {
  userId: string;
  onClose: () => void;
}

export const AdminEditUserModal: React.FC<AdminEditUserModalProps> = ({ userId, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');
  const [accountStatus, setAccountStatus] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        if (data) {
          setFullName(data.full_name || '');
          setUsername(data.username || '');
          setJobTitle(data.job_title || '');
          setBio(data.bio || '');
          setRole(data.role || 'Member');
          setAccountStatus(data.account_status || 'pending');
        }
      } catch (err: any) {
        toast.error('Failed to load user profile');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, onClose]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username,
          job_title: jobTitle,
          bio,
          role,
          account_status: accountStatus,
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('User updated successfully');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user');
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
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit User Profile</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-purple-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-purple-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
            <input 
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-purple-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea 
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-purple-500 resize-none" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select 
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-purple-500"
              >
                <option value="Member">Member</option>
                <option value="System Administrator">System Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Status</label>
              <select 
                value={accountStatus}
                onChange={e => setAccountStatus(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-purple-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
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
