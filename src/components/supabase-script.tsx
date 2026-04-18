'use client';

import { useEffect, useState } from 'react';

export function SupabaseScript() {
	const [script, setScript] = useState('');

	useEffect(() => {
		// 只在开发环境且没有 NEXT_PUBLIC_ 环境变量时使用
		if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
			return;
		}

		// 客户端时从 API 获取配置
		fetch('/api/config')
			.then((res) => res.json())
			.then((data) => {
				if (data.url && data.anonKey && !data.url.includes('your-project')) {
					const scriptContent = `
						try {
							window.__SUPABASE_URL = '${data.url}';
							window.__SUPABASE_ANON_KEY = '${data.anonKey}';
						} catch(e) {}
					`;
					setScript(scriptContent);
				}
			})
			.catch(console.error);
	}, []);

	if (!script) return null;

	return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
