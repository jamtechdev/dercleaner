"use client"; // Required for the toggle functionality

import React, { useState } from 'react';
// import { ChevronUp } from 'lucide-react';

const faqData = [
    {
        id: 1,
        question: "Welche Vorteile bietet der i-mop im Vergleich zu herkömmlichen Reinigungslösungen?",
        answer: "Der i-mop kombiniert die Flexibilität eines Flachmops mit der Leistung einer Scheuersaugmaschine...",
        icon: '/next.png'
    },
    {
        id: 2,
        question: "Welche Modelle des i-mop stehen zur Verfügung, und wie unterscheiden sie sich?",
        answer: "Es gibt verschiedene Modelle wie den i-mop Lite, XL und XXL, die sich in Tankkapazität und Arbeitsbreite unterscheiden."
    },
    {
        id: 3,
        question: "Welches Zubehör und welche Funktionen verbessern die Nutzung des i-mop?",
        answer: "Zubehör wie verschiedene Bürstentypen, Pads und Akku-Optionen ermöglichen eine individuelle Anpassung."
    }
];

export default function FaqSection() {
    const [openId, setOpenId] = useState<number | null>(null);

    return (
        <section className="bg-white py-16 px-4 md:px-20 lg:px-32 font-sans  faq-section">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">

                {/* Left Side: Header and Contact */}
                <div className="md:w-1/3 space-y-6">
                    <h2 className="text-5xl font-bold text-[#333333] text-brand">FAQ</h2>
                    <p className="text-gray-600 text-lg leading-relaxed faq-para">
                        Sie haben weitere Fragen? Kontaktieren Sie uns gerne jederzeit.
                    </p>
                    <button onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById('kontakt');
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }} className="bg-[#00B1E6] hover:bg-[#0096C2] text-white font-bold py-3 px-10 rounded-full transition-colors duration-300 faq-contact-btn">
                        Kontakt
                    </button>
                </div>

                {/* Right Side: Accordion */}
                <div className="md:w-2/3 space-y-4">
                    {faqData.map((item) => (
                        <div
                            key={item.id}
                            className="border border-gray-300 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg text-gray-700 font-medium pr-4">
                                    {item.question}
                                </span>
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-[#00B1E6] flex items-center justify-center transition-transform duration-300 ${openId === item.id ? 'rotate-0' : 'rotate-180'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 42 43" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
                                        <g clip-path="url(#clip0_11223_43134)">
                                            <path d="M41.5 21.4893C41.5 10.1674 32.3218 0.989258 21 0.989258C9.67816 0.989258 0.5 10.1674 0.5 21.4893C0.5 32.8111 9.67816 41.9893 21 41.9893C32.3218 41.9893 41.5 32.8111 41.5 21.4893Z" fill="#00b3df"></path>
                                            <path d="M41.5 21.4893C41.5 10.1674 32.3218 0.989258 21 0.989258C9.67816 0.989258 0.5 10.1674 0.5 21.4893C0.5 32.8111 9.67816 41.9893 21 41.9893C32.3218 41.9893 41.5 32.8111 41.5 21.4893Z" stroke="#00b3df"></path>
                                            <path d="M25.5 23.7393L21 19.2393L16.5 23.7393" stroke="white" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_11223_43134">
                                                <rect width="42" height="42" fill="white" transform="translate(0 0.489258)"></rect>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </button>

                            {/* Answer Section with basic transition */}
                            {openId === item.id && (
                                <div className="px-6 pb-6 text-gray-600 animate-fadeIn faq-content-box">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}