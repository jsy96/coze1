'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

/**
 * 获取 Supabase 客户端
 * 直接使用 NEXT_PUBLIC_ 环境变量（Vercel 标准方式）
 */
function getSupabaseClient(): SupabaseClient {
	if (cachedClient) return cachedClient;

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// 验证配置
	if (!url || !anonKey) {
		throw new Error(
			'Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables in Vercel dashboard.'
		);
	}

	// 过滤示例值
	if (url.includes('your-project') || anonKey.includes('your-')) {
		throw new Error(
			'Please configure valid Supabase credentials in your environment variables.'
		);
	}

	cachedClient = createClient(url, anonKey);

	return cachedClient;
}

export { getSupabaseClient };
