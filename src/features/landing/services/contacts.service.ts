import { supabase } from '@/lib/supabase';

export interface ContactMessagePayload {
  developer_id: string;
  sender_name: string;
  sender_email: string;
  message: string;
}

/**
 * Sends a contact message to a specific developer
 */
export const sendContactMessage = async (payload: ContactMessagePayload): Promise<void> => {
  const { error } = await supabase
    .from('contact_messages')
    .insert([payload]);

  if (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
};
