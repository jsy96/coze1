'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * 客户端 Supabase 客户端
 * 在浏览器环境中使用，自动从 window.__ENV__ 或直接访问环境变量
 */
function getSupabaseClient(): SupabaseClient {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const win = window as any;

	// 尝试从多个来源获取凭据
	let url: string | undefined;
	let anonKey: string | undefined;

	// 1. 尝试 window.__ENV__ (Coze 平台注入)
	if (win.__ENV__) {
		const env = win.__ENV as Record<string, string>;
		url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
		anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
	}

	// 2. 尝试 meta 标签 (Coze 平台注入方式)
	if (!url || !anonKey) {
		const metaUrl = document.querySelector('meta[name="supabase-url"]');
		const metaKey = document.querySelector('meta[name="supabase-anon-key"]');
		if (metaUrl) url = metaUrl.getAttribute('content') || undefined;
		if (metaKey) anonKey = metaKey.getAttribute('content') || undefined;
	}

	// 3. 尝试 window 全局变量 (某些部署方式)
	if (!url || !anonKey) {
		url = win.SUPABASE_URL as string || undefined;
		anonKey = win.SUPABASE_ANON_KEY as string || undefined;
	}

	if (!url || !anonKey) {
		throw new Error('Supabase credentials not found. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are configured.');
	}

	return createClient(url, anonKey, {
		db: {
			timeout: 60000,
		},
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}

export { getSupabaseClient };
