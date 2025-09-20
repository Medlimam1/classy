"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from 'next/navigation'

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.number().min(0),
  inventory: z.number().min(0),
  images: z.string().optional(),
  published: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof ProductSchema> & { categoryId?: string }

export default function ProductForm({
  initial,
  onSuccess,
  action = "create",
  id,
}: {
  initial?: Partial<ProductFormValues>;
  onSuccess?: string; // now a path string instead of a callback
  action?: "create" | "update";
  id?: string;
}) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      price: initial?.price ?? 0,
      inventory: initial?.inventory ?? 0,
      images: (initial?.images as unknown as string) ?? "",
      published: initial?.published ?? false,
    },
  });

  const [categories, setCategories] = useState<Array<{id:string;name:string}>>([])
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (mounted && Array.isArray(data)) setCategories(data) })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  async function onSubmit(values: ProductFormValues) {
    try {
      // If files were selected, upload them first
      let imageUrls: string[] = values.images ? values.images.split(',').map(s => s.trim()).filter(Boolean) : []
      if (selectedFiles && selectedFiles.length > 0) {
        // read files as data URLs
        const filesData = await Promise.all(Array.from(selectedFiles).map(async (file) => {
          const data = await new Promise<string>((res, rej) => {
            const reader = new FileReader()
            reader.onload = () => res(String(reader.result))
            reader.onerror = rej
            reader.readAsDataURL(file)
          })
          return { name: file.name, data }
        }))

        const upRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: filesData }),
        })

        if (!upRes.ok) {
          toast.error('Image upload failed')
          return
        }

        const upJson = await upRes.json().catch(() => null)
        if (upJson?.urls && Array.isArray(upJson.urls)) {
          imageUrls = imageUrls.concat(upJson.urls)
        }
      }

      const body = {
        ...values,
        images: imageUrls,
      };

      const url = action === 'create' ? '/api/admin/products' : `/api/admin/products/${id}`;
      const method = action === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.message || 'Server error');
        return;
      }

      toast.success(action === 'create' ? 'Product created' : 'Product updated');
      if (onSuccess) {
        router.push(onSuccess)
      }
    } catch (e) {
      console.error(e);
      toast.error('Request failed');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input {...register('name')} className="mt-1 block w-full" />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>} 
      </div>

      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input {...register('slug')} className="mt-1 block w-full" />
        {errors.slug && <p className="text-red-600 text-sm">{errors.slug.message}</p>} 
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea {...register('description')} className="mt-1 block w-full" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Price (MRU)</label>
          <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-1 block w-full" />
          {errors.price && <p className="text-red-600 text-sm">{String(errors.price?.message)}</p>} 
        </div>
        <div>
          <label className="block text-sm font-medium">Inventory</label>
          <input type="number" {...register('inventory', { valueAsNumber: true })} className="mt-1 block w-full" />
          {errors.inventory && <p className="text-red-600 text-sm">{String(errors.inventory?.message)}</p>} 
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
  <select {...register('categoryId')} className="mt-1 block w-full">
          <option value="">(auto pick first)</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Images (comma separated URLs)</label>
        <input {...register('images')} className="mt-1 block w-full" />
        <div className="mt-2">
          <label className="block text-sm">Or upload files</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setSelectedFiles(e.target.files ? Array.from(e.target.files) : null)} className="mt-1" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register('published')} id="published" />
        <label htmlFor="published" className="text-sm">Published</label>
      </div>

      <div>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded">
          {action === 'create' ? 'Create product' : 'Update product'}
        </button>
      </div>
    </form>
  );
}
