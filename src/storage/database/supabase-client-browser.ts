'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

/**
 * 获取 Supabase 客户端
 * 使用 NEXT_PUBLIC_ 前缀的环境变量，这些变量会在客户端可用
 */
function getSupabaseClient(): SupabaseClient {
	if (cachedClient) return cachedClient;

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !anonKey) {
		throw new Error(
			'Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
		);
	}

	cachedClient = createClient(url, anonKey, {
		db: {
			timeout: 60000,
		},
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});

	return cachedClient;
}

export { getSupabaseClient };
