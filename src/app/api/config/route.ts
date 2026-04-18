import { NextResponse } from 'next/server';

export async function GET() {
	// 优先使用 NEXT_PUBLIC_ 环境变量（Vercel）
	let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// 如果未配置，返回空
	if (!url || url.includes('your-project') || !anonKey || anonKey.includes('your-')) {
		return NextResponse.json({ url: '', anonKey: '' });
	}

	return NextResponse.json({ url, anonKey });
}
