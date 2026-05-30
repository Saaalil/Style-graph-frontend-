import { NextResponse } from 'next/server';
import { Client } from '@gradio/client';

export async function GET() {
  try {
    const hfSpace = process.env.NEXT_PUBLIC_HF_SPACE || 'Saaalil/ML-Contextual-search-prod';
    
    // Connect to the HF Space
    const client = await Client.connect(hfSpace);
    
    // Call our new hidden api_name="get_count"
    const result = await client.predict('/get_count', {});
    
    // result.data should be an array containing the returned string, e.g., ["959"]
    const countStr = Array.isArray(result.data) ? result.data[0] : "0";
    const count = parseInt(countStr as string, 10);
    
    return NextResponse.json({ count: isNaN(count) ? 0 : count });
  } catch (error) {
    console.error('Error fetching count:', error);
    return NextResponse.json({ error: 'Failed to fetch count', count: 0 }, { status: 500 });
  }
}
