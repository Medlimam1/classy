// Simple version for testing
type Params = { locale: 'ar' | 'en' };

export default async function SimpleHomePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  
  return (
    <main className="px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">
        {locale === 'ar' ? 'مرحباً بكم في متجر كلاسي' : 'Welcome to Classy Store'}
      </h1>
      <p>
        {locale === 'ar' 
          ? 'هذه صفحة اختبار بسيطة للتأكد من أن الموقع يعمل.' 
          : 'This is a simple test page to verify the site works.'}
      </p>
      <div className="mt-4">
        <a href="/ar/test" className="text-blue-500 underline">
          {locale === 'ar' ? 'صفحة الاختبار' : 'Test Page'}
        </a>
      </div>
    </main>
  );
}