'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

let configPromise: Promise<{ url: string; anonKey: string }> | null = null;

/**
 * 获取 Supabase 配置
 */
async function getConfig(): Promise<{ url: string; anonKey: string }> {
	// 优先使用 NEXT_PUBLIC_ 环境变量（Vercel 生产环境）
	const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (envUrl && !envUrl.includes('your-project') && envKey) {
		return { url: envUrl, anonKey: envKey };
	}

	// 如果 .env.local 未配置，尝试从 API 获取（开发环境）
	if (!configPromise) {
		configPromise = fetch('/api/config')
			.then((res) => res.json())
			.catch(() => ({ url: '', anonKey: '' }));
	}

	return configPromise;
}

/**
 * 获取 Supabase 客户端
 */
async function getSupabaseClient(): Promise<SupabaseClient> {
	if (cachedClient) return cachedClient;

	const { url, anonKey } = await getConfig();

	if (!url || !anonKey || url.includes('your-project')) {
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
