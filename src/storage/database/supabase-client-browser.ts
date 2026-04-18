'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

/**
 * 客户端 Supabase 客户端
 * 从服务端 API 获取配置后创建客户端
 */
async function getSupabaseClient(): Promise<SupabaseClient> {
	if (cachedClient) return cachedClient;

	// 从服务端 API 获取配置
	const response = await fetch('/api/config');
	if (!response.ok) {
		throw new Error('Failed to fetch Supabase config');
	}

	const { url, anonKey } = await response.json();

	if (!url || !anonKey) {
		throw new Error('Supabase credentials not configured. Please check your environment variables.');
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
