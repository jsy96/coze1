'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

let configPromise: Promise<{ url: string; anonKey: string }> | null = null;

/**
 * 获取 Supabase 配置
 */
async function getConfig(): Promise<{ url: string; anonKey: string }> {
	// 优先使用 NEXT_PUBLIC_ 环境变量（Vercel 生产环境）
	const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	// 过滤掉示例值
	if (envUrl && !envUrl.includes('your-project') && envKey && !envKey.includes('your-')) {
		return { url: envUrl, anonKey: envKey };
	}

	// 如果 .env.local 未配置，尝试从 API 获取（开发环境）
	if (!configPromise) {
		configPromise = fetch('/api/config')
			.then((res) => {
				if (!res.ok) throw new Error('Failed to fetch config');
				return res.json();
			})
			.then((data) => {
				// 验证配置有效
				if (!data.url || !data.anonKey || data.url.includes('your-project')) {
					throw new Error('Invalid Supabase configuration');
				}
				return data;
			})
			.catch((e) => {
				console.error('Failed to load config:', e);
				return { url: '', anonKey: '' };
			});
	}

	return configPromise;
}

/**
 * 获取 Supabase 客户端
 */
async function getSupabaseClient(): Promise<SupabaseClient> {
	const { url, anonKey } = await getConfig();

	// 如果 URL 和 Key 没变，使用缓存
	if (cachedClient && cachedUrl === url && cachedKey === anonKey) {
		return cachedClient;
	}

	if (!url || !anonKey) {
		throw new Error(
			'Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
		);
	}

	console.log('[Supabase] Creating new client...');

	cachedClient = createClient(url, anonKey);
	cachedUrl = url;
	cachedKey = anonKey;

	return cachedClient;
}

export { getSupabaseClient };
