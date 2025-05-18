// Initialize Supabase client
const SUPABASE_URL = 'https://aqitwpolqeiqepeoxsnu.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaXR3cG9scWVpcWVwZW94c251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDY1ODEsImV4cCI6MjA2MzEyMjU4MX0.JKRCQNJh6M51w-Q8JLwOBlzZzIa-f8Zv3AXkKFa0RrU'; // Replace with your Supabase anon key

// Create Supabase client
const createClient = () => {
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

// Initialize the client
const supabaseClient = createClient();

// Function to check Supabase connection status
async function checkSupabaseConnection() {
  try {
    // Simple query to check if we can connect to Supabase
    const { data, error } = await supabaseClient
      .from('image_history')
      .select('id')
      .limit(1);
    
    if (error && error.code === 'NETWORK_ERROR') {
      console.error('Network error when connecting to Supabase:', error);
      return { success: false, online: false, error };
    } else if (error) {
      console.error('Error connecting to Supabase:', error);
      return { success: false, online: true, error };
    }
    
    return { success: true, online: true };
  } catch (error) {
    console.error('Exception checking Supabase connection:', error);
    return { success: false, online: navigator.onLine, error };
  }
}

// Helper function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
  // Convert base64 to raw binary data held in a string
  const byteString = atob(dataURL.split(',')[1]);
  
  // Separate out the mime component
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  
  // Write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  // Create a blob with the ArrayBuffer and mime type
  return new Blob([ab], { type: mimeString });
}

// Function to save image to history
async function saveImageToHistory(imageData) {
  try {
    // Check connection before attempting to save
    const connectionStatus = await checkSupabaseConnection();
    if (!connectionStatus.success) {
      console.error('Cannot save image: Supabase connection unavailable');
      return { success: false, error: 'Connection unavailable', offline: !connectionStatus.online };
    }

    // Generate a unique filename
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 10);
    const safeServiceName = imageData.serviceName.substring(0, 10).replace(/\s+/g, '-');
    const filename = `${imageData.category}-${safeServiceName}-${timestamp}-${randomString}.png`;
    
    // Convert data URL to Blob
    const blob = dataURLtoBlob(imageData.imageDataUrl);
    
    // Upload image to storage bucket
    const { data: storageData, error: storageError } = await supabaseClient
      .storage
      .from('images')
      .upload(filename, blob, {
        contentType: 'image/png',
        cacheControl: '3600'
      });
    
    if (storageError) {
      console.error('Error uploading image to storage:', storageError);
      return { success: false, error: storageError };
    }
    
    // Get the public URL for the uploaded image
    const { data: publicUrlData } = supabaseClient
      .storage
      .from('images')
      .getPublicUrl(filename);
    
    const imageUrl = publicUrlData?.publicUrl || '';
    
    // Create prompt data object that combines all the necessary data
    const promptData = {
      category: imageData.category,
      services: imageData.services,
      format: imageData.format
    };

    // Save record to database with image URL
    const { data, error } = await supabaseClient
      .from('image_history')
      .insert([
        {
          prompt_data: promptData,
          service_name: imageData.serviceName,
          image_url: imageUrl,
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
    return { success: false, error, offline: !navigator.onLine };
  }
}

// Function to get image history
async function getImageHistory() {
  try {
    // Check connection before attempting to fetch
    const connectionStatus = await checkSupabaseConnection();
    if (!connectionStatus.success) {
      console.error('Cannot fetch history: Supabase connection unavailable');
      return { success: false, error: 'Connection unavailable', offline: !connectionStatus.online };
    }

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
    return { success: false, error, offline: !navigator.onLine };
  }
}

// Function to get a specific image by ID
async function getImageById(id) {
  try {
    // Check connection before attempting to fetch
    const connectionStatus = await checkSupabaseConnection();
    if (!connectionStatus.success) {
      console.error('Cannot fetch image: Supabase connection unavailable');
      return { success: false, error: 'Connection unavailable', offline: !connectionStatus.online };
    }

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
    return { success: false, error, offline: !navigator.onLine };
  }
}

// Function to delete an image from history
async function deleteImageFromHistory(id) {
  try {
    // Check connection before attempting to delete
    const connectionStatus = await checkSupabaseConnection();
    if (!connectionStatus.success) {
      console.error('Cannot delete image: Supabase connection unavailable');
      return { success: false, error: 'Connection unavailable', offline: !connectionStatus.online };
    }

    // First get the image record to find the filename
    const { data: imageData, error: fetchError } = await supabaseClient
      .from('image_history')
      .select('image_url')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching image for deletion:', fetchError);
      return { success: false, error: fetchError };
    }
    
    // Extract filename from the URL
    if (imageData?.image_url) {
      const url = new URL(imageData.image_url);
      const pathParts = url.pathname.split('/');
      const filename = pathParts[pathParts.length - 1];
      
      // Delete the file from storage
      if (filename) {
        const { error: storageError } = await supabaseClient
          .storage
          .from('images')
          .remove([filename]);
        
        if (storageError) {
          console.error('Error deleting image file from storage:', storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }
    }

    // Delete the database record
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
    return { success: false, error, offline: !navigator.onLine };
  }
} 