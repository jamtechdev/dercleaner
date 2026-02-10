import Script from 'next/script';

export default function NewsLetter() {
    return (
        <section className="bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Newsletter</h2>
                    <p className="text-gray-600">Erhalten Sie aktuelle Informationen über unsere Produkte und Dienstleistungen</p>
                </div>

                {/* Klaviyo Embedded Form */}
                <div className="klaviyo-form-UJAkhN"></div>

                {/* Klaviyo Script – loads once for the embedded form */}
                <Script
                    src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=YAAnUP"
                    strategy="afterInteractive"
                />

                <p className="text-sm text-gray-500 text-center">
                    Mit dem Abschicken stimmen Sie unserer Datenschutzerklärung zu.
                </p>
            </div>
        </section>
    );
}