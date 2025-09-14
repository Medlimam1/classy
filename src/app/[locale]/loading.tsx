export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          جاري التحميل...
        </h2>
        <p className="text-gray-600">
          يرجى الانتظار قليلاً
        </p>
      </div>
    </div>
  )
}