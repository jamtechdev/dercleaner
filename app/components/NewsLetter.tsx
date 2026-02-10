'use client';

import { useState } from 'react';

export default function NewsLetter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // ⚠️ WICHTIG: Wenn Sie den Fehler "List not found" erhalten:
        // 1. Prüfen Sie, ob die LIST_ID zu diesem Public Key Account gehört.
        // 2. Stellen Sie sicher, dass es eine "Liste" und kein "Segment" ist.
        const LIST_ID = 'TuYfyC';
        const PUBLIC_KEY = 'YAAnUP';

        try {
            const response = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${PUBLIC_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'revision': '2024-07-15'
                },
                body: JSON.stringify({
                    data: {
                        type: 'subscription',
                        attributes: {
                            custom_source: 'Website Footer Newsletter',
                            profile: {
                                data: {
                                    type: 'profile',
                                    attributes: {
                                        email: email
                                    }
                                }
                            }
                        },
                        relationships: {
                            list: {
                                data: {
                                    type: 'list',
                                    id: LIST_ID
                                }
                            }
                        }
                    }
                })
            });

            if (response.ok) {
                setStatus('success');
                setMessage('Vielen Dank für Ihre Anmeldung!');
                setEmail('');
            } else {
                setStatus('error');
                const errorData = await response.json().catch(() => null);
                console.error('Klaviyo submission failed', errorData);
                setMessage('Es gab einen Fehler. Bitte überprüfen Sie die Listen-ID oder versuchen Sie es später erneut.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Ein unerwarteter Fehler ist aufgetreten.');
            console.error('Klaviyo error:', error);
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Newsletter</h2>
                    <p className="text-gray-600">Erhalten Sie aktuelle Informationen über unsere Produkte und Dienstleistungen</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ihre E-Mail-Adresse"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        required
                        disabled={status === 'loading'}
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {status === 'loading' ? 'Wird gesendet...' : 'Abonnieren'}
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Mit dem Abschicken stimmen Sie unserer Datenschutzerklärung zu.
                </p>
            </div>
        </section>
    );
}