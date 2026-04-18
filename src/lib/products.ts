'use client';

import { getSupabaseClient } from '@/storage/database/supabase-client-browser';

// 产品类型
export interface Product {
	id: number;
	product_name: string;
	hs_code: string;
	created_at: string;
}

// 创建产品
export async function createProduct(product_name: string, hs_code: string): Promise<Product> {
	const client = await getSupabaseClient();
	const { data, error } = await client
		.from('products')
		.insert({ product_name, hs_code })
		.select()
		.single();

	if (error) throw new Error(`添加产品失败: ${error.message}`);
	return data;
}

// 获取所有产品
export async function getProducts(): Promise<Product[]> {
	const client = await getSupabaseClient();
	const { data, error } = await client
		.from('products')
		.select('*')
		.order('id', { ascending: false });

	if (error) throw new Error(`获取产品列表失败: ${error.message}`);
	return data || [];
}

// 更新产品
export async function updateProduct(id: number, product_name: string, hs_code: string): Promise<Product> {
	const client = await getSupabaseClient();
	const { data, error } = await client
		.from('products')
		.update({ product_name, hs_code })
		.eq('id', id)
		.select()
		.single();

	if (error) throw new Error(`更新产品失败: ${error.message}`);
	return data;
}

// 删除产品
export async function deleteProduct(id: number): Promise<void> {
	const client = await getSupabaseClient();
	const { error } = await client.from('products').delete().eq('id', id);

	if (error) throw new Error(`删除产品失败: ${error.message}`);
}

// 搜索产品
export async function searchProducts(keyword: string): Promise<Product[]> {
	const client = await getSupabaseClient();
	const { data, error } = await client
		.from('products')
		.select('*')
		.or(`product_name.ilike.%${keyword}%,hs_code.ilike.%${keyword}%`)
		.order('id', { ascending: false });

	if (error) throw new Error(`搜索产品失败: ${error.message}`);
	return data || [];
}
