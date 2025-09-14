'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: Date
  user: {
    name: string
  }
}

interface ProductReviewsProps {
  reviews: Review[]
  productId: string
}

export default function ProductReviews({ reviews, productId }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: session } = useSession()
  const t = useTranslations()

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(review => review.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === star).length / reviews.length) * 100 : 0
  }))

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      toast.error(t('auth.loginRequired'))
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      toast.success(t('reviews.submitted'))
      setShowReviewForm(false)
      setComment('')
      setRating(5)
      
      // Refresh the page to show the new review
      window.location.reload()
    } catch (error) {
      toast.error(t('reviews.submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('reviews.title')}
      </h2>

      {/* Reviews Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mt-1">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      averageRating > star
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>

          {session && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              {t('reviews.writeReview')}
            </button>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex items-center space-x-1 rtl:space-x-reverse w-12">
                <span className="text-sm text-gray-600">{star}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('reviews.writeReview')}
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('reviews.rating')}
              </label>
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating >= star
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                {t('reviews.comment')}
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder={t('reviews.commentPlaceholder')}
                required
              />
            </div>

            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  t('reviews.submit')
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('reviews.noReviews')}</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                    <span className="font-medium text-gray-900">{review.user.name}</span>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            review.rating > star
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.createdAt, 'en')}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}