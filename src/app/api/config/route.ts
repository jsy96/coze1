import { NextResponse } from 'next/server';

export async function GET() {
	return NextResponse.json({
		url: process.env.COZE_SUPABASE_URL || '',
		anonKey: process.env.COZE_SUPABASE_ANON_KEY || '',
	});
}
