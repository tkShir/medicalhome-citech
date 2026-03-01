import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/forms/ContactForm'

export const metadata = {
  title: 'お問い合わせ',
  description: 'シーズメディカルホームへのお問い合わせはこちらから。入居相談・見学予約・各種ご質問を受け付けております。',
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>

        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-6">
            <span className="page-header-en">Contact Us</span>
            <h1 className="page-header-title">お問い合わせ</h1>
          </div>
        </div>

        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-2xl mx-auto px-6">

            {/* Phone CTA */}
            <div className="bg-green-light border border-green-pale p-6 md:p-8 mb-8 text-center">
              <p className="font-sans text-xs tracking-widest text-green-dark uppercase mb-3">Phone</p>
              <a
                href="tel:03-3797-4002"
                className="font-sans text-2xl md:text-3xl font-semibold text-green-deeper hover:text-green-dark transition-colors tracking-wider block mb-1"
              >
                ☎&ensp;03-3797-4002
              </a>
              <p className="font-sans text-xs text-darkgray/70 tracking-wide">
                入居ご相談窓口&ensp;受付時間 / 平日 10:00 – 19:00
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white border border-lightgray p-6 md:p-10">
              <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1 text-center">
                お問い合わせフォーム
              </h2>
              <div className="w-8 h-0.5 bg-green-main mx-auto mb-6" />
              <ContactForm />
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
