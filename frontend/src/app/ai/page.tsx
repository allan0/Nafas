'use client';
import dynamic from 'next/dynamic';
const AIContent = dynamic(() => import('@/components/AIContent'), { ssr: false });
export default function AIPage() { return <AIContent />; }
