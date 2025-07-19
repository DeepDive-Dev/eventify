import { NextResponse } from 'next/server';
import { getAllEvents } from '@/lib/actions/event.actions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 100; // Higher limit for chatbot

    const events = await getAllEvents({
      query,
      category: '', // Default to no category filter
      page,
      limit,
    });

    return NextResponse.json(events!.data); // Return only the event array
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}