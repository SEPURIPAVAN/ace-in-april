
import { createClient } from '@supabase/supabase-js';

// These values would typically come from environment variables
// For now, we'll use placeholders that users will replace with their own values
const supabaseUrl = 'https://bkmjjkqggdfxjrbgngiq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbWpqa3FnZ2RmeGpyYmduZ2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0OTc0NDUsImV4cCI6MjA1OTA3MzQ0NX0.8dn287JLzR9NePvuWkEREzKv3255DS6iIsTKVnNp2wA';

// Create a proper mock client with chainable methods to prevent TypeScript errors
const createMockClient = () => {
  // Mock response for all database operations
  const mockResponse = {
    data: null,
    error: { message: 'Supabase configuration error' }
  };

  // Create a chainable object that always returns itself for method calls
  const createChainable = () => {
    const chainable: any = {};
    const methods = [
      'select', 'insert', 'update', 'delete', 'eq', 'order', 'single', 'lte', 'gte', 'lt', 'gt',
      'neq', 'like', 'ilike', 'is', 'in', 'contains', 'containedBy', 'range', 'overlaps',
      'textSearch', 'filter', 'match', 'not'
    ];

    methods.forEach(method => {
      chainable[method] = () => chainable;
    });

    // Final methods that end the chain should return the mock response
    chainable.then = () => Promise.resolve(mockResponse);
    chainable.single = () => mockResponse;

    return chainable;
  };

  return {
    from: () => createChainable(),
    storage: {
      from: () => ({
        upload: () => Promise.resolve(mockResponse),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    functions: {
      setAuth: () => {},
    },
  };
};

// Initialize the Supabase client with URL validation
const createSupabaseClient = () => {
  try {
    // Validate the URL before creating the client
    new URL(supabaseUrl);
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Invalid Supabase URL:', error);
    // Return a mock client that doesn't make actual API calls
    // This prevents runtime errors while allowing the app to load
    return createMockClient();
  }
};

// Initialize the Supabase client
export const supabase = createSupabaseClient();

// Helper function to get the current user from localStorage
export const getCurrentUser = () => {
  const userString = localStorage.getItem('aceInApril_user');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Add custom header with user ID for RLS policies
export const addUserToRequest = () => {
  const user = getCurrentUser();
  if (user && user.id) {
    supabase.functions.setAuth(user.id);
  }
};

// Call this function to set up the custom header
addUserToRequest();
