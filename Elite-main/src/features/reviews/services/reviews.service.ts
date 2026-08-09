import { supabase } from '@/lib/supabase';

export interface SocialLink {
  platform: 'whatsapp' | 'instagram' | 'telegram' | 'facebook' | 'linkedin' | 'phone';
  url: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  avatar_url?: string;
  social_links: SocialLink[];
  review_text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface NewCustomerReview {
  name: string;
  avatar_url?: string;
  social_links: SocialLink[];
  review_text: string;
}

export const fetchApprovedReviews = async (): Promise<CustomerReview[]> => {
  const { data, error } = await supabase
    .from('customer_reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approved reviews:', error);
    throw error;
  }
  return data as CustomerReview[];
};

export const fetchPendingReviews = async (): Promise<CustomerReview[]> => {
  const { data, error } = await supabase
    .from('customer_reviews')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending reviews:', error);
    throw error;
  }
  return data as CustomerReview[];
};

export const submitReview = async (review: NewCustomerReview): Promise<CustomerReview> => {
  const { data, error } = await supabase
    .from('customer_reviews')
    .insert([review])
    .select()
    .single();

  if (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
  return data as CustomerReview;
};

export const updateReviewStatus = async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
  const { error } = await supabase
    .from('customer_reviews')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating review status:', error);
    throw error;
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customer_reviews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
