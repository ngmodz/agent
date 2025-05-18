// Initialize Supabase client
const SUPABASE_URL = 'https://aqitwpolqeiqepeoxsnu.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaXR3cG9scWVpcWVwZW94c251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDY1ODEsImV4cCI6MjA2MzEyMjU4MX0.JKRCQNJh6M51w-Q8JLwOBlzZzIa-f8Zv3AXkKFa0RrU'; // Replace with your Supabase anon key

// Create Supabase client
const createClient = () => {
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

// Initialize the client
const supabaseClient = createClient();

// Function to save image to history
async function saveImageToHistory(imageData) {
  try {
    // Create prompt data object that combines all the necessary data
    const promptData = {
      category: imageData.category,
      services: imageData.services,
      format: imageData.format
    };

    const { data, error } = await supabaseClient
      .from('image_history')
      .insert([
        {
          prompt_data: promptData,
          service_name: imageData.serviceName,
          image_url: imageData.imageDataUrl,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error saving image to history:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception saving image to history:', error);
    return { success: false, error };
  }
}

// Function to get image history
async function getImageHistory() {
  try {
    const { data, error } = await supabaseClient
      .from('image_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching image history:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching image history:', error);
    return { success: false, error };
  }
}

// Function to get a specific image by ID
async function getImageById(id) {
  try {
    const { data, error } = await supabaseClient
      .from('image_history')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching image by ID:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception fetching image by ID:', error);
    return { success: false, error };
  }
}

// Function to delete an image from history
async function deleteImageFromHistory(id) {
  try {
    const { data, error } = await supabaseClient
      .from('image_history')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting image from history:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception deleting image from history:', error);
    return { success: false, error };
  }
} 