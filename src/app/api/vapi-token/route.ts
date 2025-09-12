import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the API key from the request body (sent from client)
    const body = await request.json();
    const { apiKey } = body;
    
    console.log('API Route called with client-provided key:', !!apiKey);
    
    // Use provided API key from client (localStorage)
    const publicKey = apiKey;
    
    if (!publicKey) {
      console.error('No Vapi public key available');
      return NextResponse.json(
        { error: 'Vapi public key not configured' },
        { status: 500 }
      );
    }

    // Public keys are safe to send to client for SDK initialization
    console.log('Returning public key for client-side SDK initialization');
    return NextResponse.json({ 
      token: publicKey,
      type: 'public',
      usage: 'client-sdk' 
    });
  } catch (error) {
    console.error('Error processing Vapi token request:', error);
    return NextResponse.json(
      { error: 'Failed to process Vapi token request' },
      { status: 500 }
    );
  }
}