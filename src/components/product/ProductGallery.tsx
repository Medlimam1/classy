'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  
  const productImages = images && images.length > 0 ? images : ['/images/placeholder-product.jpg']

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <div className="flex flex-col-reverse">
      {/* Thumbnail Images */}
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <div className="grid grid-cols-4 gap-6">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-24 cursor-pointer rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 ${
                index === selectedImage
                  ? 'ring-2 ring-amber-500'
                  : 'ring-1 ring-gray-300'
              }`}
            >
              <span className="sr-only">{productName} image {index + 1}</span>
              <span className="absolute inset-0 rounded-md overflow-hidden">
                <img
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  className="w-full h-full object-center object-cover"
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Image */}
      <div className="aspect-w-1 aspect-h-1 w-full">
        <div className="relative">
          <img
            src={productImages[selectedImage]}
            alt={productName}
            className="w-full h-96 object-center object-cover sm:rounded-lg"
          />
          
          {/* Navigation Arrows */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {productImages.length}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Thumbnail Dots */}
      {productImages.length > 1 && (
        <div className="flex justify-center mt-4 sm:hidden">
          <div className="flex space-x-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full ${
                  index === selectedImage ? 'bg-amber-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}