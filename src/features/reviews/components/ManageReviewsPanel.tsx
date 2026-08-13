import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Edit3, Plus, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const ManageReviewsPanel: React.FC = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    content: '',
    is_approved: false
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err: any) {
      toast.error('Failed to fetch reviews: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('customer_reviews')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Review updated successfully');
      } else {
        const { error } = await supabase
          .from('customer_reviews')
          .insert([formData]);
        if (error) throw error;
        toast.success('Review added successfully');
      }
      setIsModalOpen(false);
      fetchReviews();
    } catch (err: any) {
      toast.error('Failed to save review: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (err: any) {
      toast.error('Failed to delete review: ' + err.message);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ name: '', rating: 5, content: '', is_approved: true });
    setIsModalOpen(true);
  };

  const openEditModal = (review: any) => {
    setEditingId(review.id);
    setFormData({
      name: review.name || review.reviewer_name || '',
      rating: review.rating || 5,
      content: review.content || review.review || '',
      is_approved: review.is_approved !== false
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground font-alexandria">Manage Reviews</h2>
          <p className="text-sm text-muted-foreground mt-1 font-alexandria">Add, update, or delete customer reviews manually.</p>
        </div>
        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 shadow-sm font-alexandria"
        >
          <Plus size={18} />
          <span>Add Review</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <Loader2 size={24} className="animate-spin mr-3" />
          <p className="font-alexandria">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-2xl border border-border p-8 text-center">
          <h3 className="text-lg font-medium text-foreground font-alexandria">No Reviews Found</h3>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-secondary/50 text-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Content</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{review.name || review.reviewer_name}</td>
                  <td className="px-6 py-4">{review.rating} / 5</td>
                  <td className="px-6 py-4 truncate max-w-[200px]">{review.content || review.review}</td>
                  <td className="px-6 py-4">
                    {review.is_approved ? (
                      <span className="flex items-center text-green-500"><CheckCircle size={16} className="mr-1" /> Approved</span>
                    ) : (
                      <span className="flex items-center text-amber-500"><Loader2 size={16} className="mr-1" /> Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEditModal(review)} className="p-2 rounded-lg text-muted-foreground hover:text-purple-600 hover:bg-purple-100 transition-colors">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-100 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-sm p-4">
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-lg border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6 font-alexandria">
              {editingId ? 'Edit Review' : 'Add New Review'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Review Content</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-all"
                  placeholder="Write the review here..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_approved"
                  checked={formData.is_approved}
                  onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                  className="rounded border-border bg-secondary"
                />
                <label htmlFor="is_approved" className="text-sm font-medium text-foreground">Approved for public display</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
