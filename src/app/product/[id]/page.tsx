import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailClient from './ProductDetailClient';
import { supabaseAdmin } from '@/lib/supabase-server';

// Server Component fetches data
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-[#EFE9E1]">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
