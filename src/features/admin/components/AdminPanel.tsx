import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Shield, Search, Users, CheckCircle, XCircle, Trash2, Loader2, FolderKanban, Clock, UserCog, Code2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

const SYSTEM_ADMIN_ROLE = 'System Administrator';
const DEFAULT_MEMBER_ROLE = 'Member';
import { toast } from 'sonner';
import { DashboardProject, AdminProfileRow, PendingUser } from '@/features/admin/types';







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
  approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ isSystemAdmin, pendingUsers, setPendingUsers, adminLoading, setAdminLoading }) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<'pending' | 'users' | 'content'>('pending');

  if (!isSystemAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground max-w-md">
          You do not have permission to access the Admin Panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => setActiveSection('pending')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeSection === 'pending'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          <Clock size={16} />
          <span>{t('dashboard.pending_approvals')}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('users')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeSection === 'users'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          <UserCog size={16} />
          <span>{t('dashboard.manage_users', 'Manage Users')}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('content')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeSection === 'content'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          <Code2 size={16} />
          <span>Manage Content</span>
        </button>
      </nav>

      {activeSection === 'pending' && (
        <PendingApprovalsSection
          isSystemAdmin={isSystemAdmin}
          pendingUsers={pendingUsers}
          setPendingUsers={setPendingUsers}
          adminLoading={adminLoading}
          setAdminLoading={setAdminLoading}
        />
      )}
      {activeSection === 'users' && <ManageAllUsersSection isSystemAdmin={isSystemAdmin} />}
      {activeSection === 'content' && <ManageContentSection isSystemAdmin={isSystemAdmin} />}
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
  const { t, i18n } = useTranslation();
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
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 size={24} className="animate-spin mr-3" />
        <p>Loading pending users...</p>
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground p-8 border border-dashed border-border rounded-2xl bg-card">
        <CheckCircle size={48} className="mb-4 text-emerald-500/40" />
        <p className="text-lg font-medium text-foreground">{t('dashboard.all_clear', 'All Clear!')}</p>
        <p className="text-sm text-muted-foreground mt-2 text-center mb-6">{t('dashboard.no_pending_accounts', 'There are no accounts awaiting review.')}</p>
        <button
          onClick={fetchPendingUsers}
          className="flex items-center space-x-2 px-4 py-2 bg-secondary text-foreground hover:bg-secondary/80 rounded-xl transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.81-6.73L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 1 0-2.81 6.73L3 16"/></svg>
          <span>Refresh</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">{pendingUsers.length} {t('dashboard.accounts_awaiting_review')}</p>
        <button
          onClick={fetchPendingUsers}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.81-6.73L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 1 0-2.81 6.73L3 16"/></svg>
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pendingUsers.map((user) => (
          <motion.div
            key={user.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-full bg-muted border-2 border-border flex items-center justify-center text-muted-foreground font-semibold text-xl shrink-0 overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name || undefined} className="w-full h-full object-cover" />
                ) : (
                  (user.full_name || user.username || '?').charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{user.full_name || user.username || 'Unknown'}</h3>
                <p className="text-xs text-muted-foreground truncate">@{user.username || 'no-username'}</p>
                {user.job_title && <p className="text-xs text-primary font-medium mt-1">{user.job_title}</p>}
                {user.role === SYSTEM_ADMIN_ROLE && <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-500/10 text-indigo-600 text-xs md:text-sm rounded-md font-bold uppercase tracking-wider">Admin</span>}
                {user.bio && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{user.bio}</p>
                )}
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {user.skills.slice(0, 4).map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 bg-secondary text-muted-foreground text-sm font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 4 && (
                      <span className="px-2 py-0.5 text-muted-foreground text-sm">+{user.skills.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-5 pt-4 border-t border-border">
              <button
                onClick={() => handleAction(user.id, 'rejected')}
                disabled={actionLoadingId === user.id}
                className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center space-x-1.5"
              >
                <XCircle size={16} />
                <span>{t('dashboard.reject')}</span>
              </button>
              <button
                onClick={() => handleAction(user.id, 'approved')}
                disabled={actionLoadingId === user.id}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-1.5"
              >
                <CheckCircle size={16} />
                <span>{t('dashboard.approve')}</span>
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
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

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

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) {
      toast.error('Failed to update user role');
      fetchAllUsers();
    } else {
      toast.success('Role updated successfully');
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, account_status: newStatus } : u));
    const { error } = await supabase.from('profiles').update({ account_status: newStatus }).eq('id', userId);
    if (error) {
      toast.error('Failed to update account status');
      fetchAllUsers();
    } else {
      toast.success('Account status updated successfully');
    }
  };

  if (!isSystemAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Lock size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium text-foreground">Access Denied</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 size={24} className="animate-spin mr-3" />
        <p>Loading users...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <XCircle size={48} className="mb-4 text-red-400 opacity-60" />
        <p className="text-lg font-medium text-foreground">Unable to Load Users</p>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">{fetchError}</p>
        <button
          onClick={fetchAllUsers}
          className="mt-6 px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Users size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium text-foreground">No Users Found</p>
        <p className="text-sm text-muted-foreground mt-2">There are no registered profiles in the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Team Count: <span className="text-primary">{users.length}</span>
        </p>
        <button
          onClick={fetchAllUsers}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">System Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => {
                const statusKey = (user.account_status || 'pending').toLowerCase();
                const statusClass = accountStatusStyles[statusKey] || 'bg-muted text-muted-foreground border-border';

                return (
                  <tr key={user.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {user.full_name || '—'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {user.email || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.account_status || 'pending'}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className={`bg-card border border-border rounded px-2 py-1 text-xs font-medium focus:outline-none focus:border-primary capitalize ${statusClass}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {user.job_title || '—'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      <select
                        value={user.role || DEFAULT_MEMBER_ROLE}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-card border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-primary font-medium text-foreground"
                      >
                        <option value={DEFAULT_MEMBER_ROLE}>Member</option>
                        <option value={SYSTEM_ADMIN_ROLE}>System Administrator</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setUserToDelete(user.id)}
                        disabled={deleteLoading}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl p-6 shadow-2xl w-full max-w-sm border border-border transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Confirm Deletion</h3>
              <button 
                onClick={() => setUserToDelete(null)} 
                className="text-muted-foreground hover:text-foreground transition-colors"
                disabled={deleteLoading}
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setUserToDelete(null)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 transition-all duration-300 disabled:opacity-50"
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

// ------------------------------------------------------------------
// Manage Content Sub-section
// ------------------------------------------------------------------
interface ManageContentSectionProps {
  isSystemAdmin: boolean;
}

const ManageContentSection: React.FC<ManageContentSectionProps> = ({ isSystemAdmin }) => {
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isSystemAdmin) fetchAllProjects();
  }, [isSystemAdmin]);

  const fetchAllProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, description, personal_profile_only, created_at, live_link, github_link, image_url, project_contributors(user_id)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching all projects:', err);
      toast.error('Failed to load projects for management.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this project?")) return;
    setDeleteLoadingId(id);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Project deleted successfully.');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 size={24} className="animate-spin mr-3" />
        <p>Loading all content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">All Projects ({projects.length})</h3>
        <button
          onClick={fetchAllProjects}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.81-6.73L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 1 0-2.81 6.73L3 16"/></svg>
          <span>Refresh</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col">
              <h4 className="font-semibold text-foreground text-lg">{project.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-4 flex-1">{project.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex gap-2">
                  {project.personal_profile_only && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] rounded uppercase font-bold tracking-wider">Profile Only</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={deleteLoadingId === project.id}
                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Project"
                  >
                    {deleteLoadingId === project.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
