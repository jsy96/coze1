import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: {
		default: '产品 HS 编码管理',
		template: '%s | 产品管理',
	},
	description: '产品英文品名和 HS 海关编码管理系统',
	openGraph: {
		title: '产品 HS 编码管理',
		description: '产品英文品名和 HS 海关编码管理系统',
		type: 'website',
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// 开发环境注入 Supabase 凭据（Coze 平台）
	const isDev = process.env.NODE_ENV !== 'production';
	const supabaseScript = isDev
		? `
		try {
			// Coze 平台会在运行时注入这些变量
			window.__SUPABASE_URL = window.__SUPABASE_URL || '${process.env.COZE_SUPABASE_URL || ''}';
			window.__SUPABASE_ANON_KEY = window.__SUPABASE_ANON_KEY || '${process.env.COZE_SUPABASE_ANON_KEY || ''}';
		} catch(e) {}
	`
		: '';

	return (
		<html lang="zh-CN">
			<head>
				{supabaseScript && <script dangerouslySetInnerHTML={{ __html: supabaseScript }} />}
			</head>
			<body className="antialiased">{children}</body>
		</html>
	);
}
