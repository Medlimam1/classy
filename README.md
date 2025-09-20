# متجر كلاسي - Classy Store

متجر إلكتروني متكامل مبني بـ Next.js 15 مع دعم اللغتين العربية والإنجليزية.

## المميزات

- 🌐 دعم متعدد اللغات (العربية والإنجليزية)
- 🛒 نظام متجر إلكتروني متكامل
- 👤 نظام إدارة المستخدمين والمدراء
- 🎨 تصميم متجاوب مع Tailwind CSS
- 🔐 نظام مصادقة آمن مع NextAuth.js
- 📊 لوحة إدارة شاملة
- 💳 دعم أنظمة الدفع المحلية (Bankily, Masrifi, Sadad)
- 📧 نظام إرسال الإيميلات
- 🖼️ رفع وإدارة الصور مع Cloudinary

## التقنيات المستخدمة

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: PostgreSQL مع Prisma ORM
- **Authentication**: NextAuth.js
- **Internationalization**: next-intl
- **File Upload**: Cloudinary
- **Email**: Resend
- **Payment**: Stripe + أنظمة الدفع المحلية

## متطلبات التشغيل

- Node.js 18+ 
- PostgreSQL
- npm أو yarn

## التثبيت والتشغيل

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd classy-store
```

2. **تثبيت الحزم**
```bash
npm install
```

3. **إعداد قاعدة البيانات**
```bash
# إنشاء قاعدة البيانات
createdb classy_store

# تطبيق المخطط
npx prisma db push

# إضافة البيانات التجريبية
npx tsx prisma/seed.ts
```

4. **إعداد متغيرات البيئة**
انسخ ملف `.env.example` إلى `.env` وقم بتعديل القيم:

```env
# Database
DATABASE_URL="postgresql://classy:2502@localhost:5432/classy_store?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Resend
RESEND_API_KEY="re_..."
```

5. **تشغيل الخادم**
```bash
npm run dev
```

الموقع سيكون متاحاً على: http://localhost:3000

## حسابات تجريبية

### حساب المدير
- **البريد الإلكتروني**: admin@classystore.mr
- **كلمة المرور**: admin123

## هيكل المشروع

```
src/
├── app/                    # صفحات التطبيق
│   ├── [locale]/          # صفحات متعددة اللغات
│   └── api/               # API endpoints
├── components/            # المكونات القابلة لإعادة الاستخدام
│   ├── ui/               # مكونات واجهة المستخدم
│   ├── layout/           # مكونات التخطيط
│   ├── product/          # مكونات المنتجات
│   └── home/             # مكونات الصفحة الرئيسية
├── lib/                  # المكتبات والأدوات المساعدة
├── messages/             # ملفات الترجمة
└── types/                # تعريفات TypeScript
```

## الصفحات المتاحة

- `/` - الصفحة الرئيسية (تحويل تلقائي إلى `/ar`)
- `/ar` - الصفحة الرئيسية بالعربية
- `/en` - الصفحة الرئيسية بالإنجليزية
- `/ar/shop` - صفحة المتجر
- `/ar/about` - صفحة من نحن
- `/ar/contact` - صفحة اتصل بنا
- `/ar/auth/login` - صفحة تسجيل الدخول
- `/ar/auth/register` - صفحة إنشاء حساب
- `/ar/admin` - لوحة الإدارة (للمدراء فقط)

## المساهمة

نرحب بالمساهمات! يرجى:

1. عمل Fork للمشروع
2. إنشاء فرع جديد للميزة
3. تطبيق التغييرات
4. إرسال Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## الدعم

للحصول على الدعم، يرجى التواصل معنا على:
- البريد الإلكتروني: info@classystore.mr
- الهاتف: +222 45 25 25 25# classyn
# classy
