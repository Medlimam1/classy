"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ProductsTableClient({ products: initialProducts, locale }: { products: Array<any>, locale: string }) {
  const [items, setItems] = useState(initialProducts)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err?.message || 'Delete failed')
        setLoadingId(null)
        return
      }
      setItems(prev => prev.filter(p => p.id !== id))
      toast.success('Product deleted')
    } catch (e) {
      console.error(e)
      toast.error('Delete failed')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Slug</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Published</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((p: any) => (
            <tr key={p.id}>
              <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{p.slug}</td>
              <td className="px-6 py-4 whitespace-nowrap">{p.price}</td>
              <td className="px-6 py-4 whitespace-nowrap">{p.published ? 'Yes' : 'No'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/${locale}/admin/products/${p.id}/edit`} className="text-amber-600 mr-4">Edit</Link>
                <button onClick={() => handleDelete(p.id)} className="text-red-600" disabled={loadingId === p.id}>{loadingId === p.id ? '...' : 'Delete'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
