export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">من نحن</h1>
        
        <div className="prose prose-lg mx-auto text-right" dir="rtl">
          <p className="text-xl text-gray-600 mb-8 text-center">
            متجر كلاسي - وجهتك الأولى للتسوق الإلكتروني في موريتانيا
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">رؤيتنا</h2>
              <p className="text-gray-700">
                نسعى لأن نكون المتجر الإلكتروني الرائد في موريتانيا، نقدم تجربة تسوق استثنائية 
                تجمع بين الجودة العالية والأسعار المناسبة والخدمة المتميزة.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">مهمتنا</h2>
              <p className="text-gray-700">
                توفير منتجات عالية الجودة بأسعار تنافسية، مع ضمان وصولها إلى عملائنا 
                في جميع أنحاء موريتانيا بأسرع وقت ممكن وبأفضل حالة.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">لماذا تختار متجر كلاسي؟</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">جودة مضمونة</h3>
                <p className="text-sm text-gray-600">
                  جميع منتجاتنا مختارة بعناية لضمان أعلى معايير الجودة
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">أسعار تنافسية</h3>
                <p className="text-sm text-gray-600">
                  نقدم أفضل الأسعار في السوق مع عروض وخصومات مستمرة
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">توصيل سريع</h3>
                <p className="text-sm text-gray-600">
                  خدمة توصيل سريعة وآمنة إلى جميع أنحاء موريتانيا
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">تواصل معنا</h2>
            <p className="text-gray-700 mb-6">
              نحن هنا لخدمتك. لا تتردد في التواصل معنا لأي استفسار أو مساعدة.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@classystore.mr</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+222 45 25 25 25</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}