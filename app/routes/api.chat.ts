import { type ActionFunctionArgs } from 'react-router';
import axios from 'axios';  // Using axios consistent with axiosInsatances.ts

export async function action({ request }: ActionFunctionArgs) {
  try {
    const { query } = (await request.json()) as { query: string };

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Use the backend URL from environment or default to localhost:3001
    const aiApiUrl = import.meta.env.VITE_AI_API_URL || 'http://localhost:3001/products/search';

    // Create an axios instance scoped to the AI API — mirrors pattern in axiosInsatances.ts
    const axiosAI = axios.create({
      baseURL: aiApiUrl,
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(`Sending query to AI: ${query} at ${aiApiUrl}`);

    const response = await axiosAI.post('', { query });

    // The AI response from the provided screenshot has:
    // { "originalQuery": "...", "searchQuery": "...", "products": [...] }
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('AI API Error:', error.response?.data || error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get response from AI',
        details: error.response?.data || error.message 
      }), 
      {
        status: error.response?.status || 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
