import { createClient } from '@supabase/supabase-js';

// These variables will come from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Saves a new postcard to the database.
 * @param {Object} postcardData - The message, fonts, and Telegram file_id.
 * @returns {Promise<string>} The newly created Postcard ID (UUID).
 */
export async function createPostcard(postcardData) {
  const { data, error } = await supabase
    .from('postcards')
    .insert([
      {
        to_name: postcardData.to,
        from_name: postcardData.from,
        message: postcardData.message,
        font: postcardData.font || 'script',
        decoration: postcardData.decoration,
        stamp: postcardData.stamp,
        file_id: postcardData.file_id, // Our Telegram proxy ID
        
        // FIXED: Changed postcardData.imageFilter to postcardData.image_filter 
        // to exactly match the formData from CreationPage.jsx
        image_filter: postcardData.image_filter || 'none',
      }
    ])
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

/**
 * Fetches a postcard by its ID for the recipient view.
 * @param {string} id - The Postcard ID.
 * @returns {Promise<Object>} The postcard data.
 */
export async function getPostcard(id) {
  const { data, error } = await supabase
    .from('postcards')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error('Postcard not found or expired.');
  return data;
}
