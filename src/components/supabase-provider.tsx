'use client';

import { useEffect } from 'react';
import { getSupabaseCredentials } from '@/storage/database/supabase-client';

/**
 * 在客户端挂载时注入 Supabase 凭据到 window
 * 确保在应用启动前环境变量已可用
 */
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		// 在客户端挂载后从服务端获取凭据并注入到 window
		try {
			const { url, anonKey } = getSupabaseCredentials();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).__SUPABASE_URL = url;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).__SUPABASE_ANON_KEY = anonKey;
			console.log('Supabase credentials injected');
		} catch (e) {
			console.error('Failed to inject Supabase credentials:', e);
		}
	}, []);

	return <>{children}</>;
}
