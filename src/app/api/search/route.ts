import { NextResponse } from 'next/server';
import { Client } from '@gradio/client';

export async function POST(request: Request) {
  try {
    const { query, top_k } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Connect to the Hugging Face Space securely on the server
    const client = await Client.connect("Saalil/ML-Contextual-search");

    // Call the text search endpoint
    const result = await client.predict("/search_by_text", { 
      text: query, 
      top_k: top_k || 20, 
    });

    return NextResponse.json({ data: result.data });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during search' },
      { status: 500 }
    );
  }
}
