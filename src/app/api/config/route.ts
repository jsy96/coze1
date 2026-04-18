import { NextResponse } from 'next/server';

export async function GET() {
	// Vercel 环境变量（标准配置）
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

	return NextResponse.json({ url, anonKey });
}
