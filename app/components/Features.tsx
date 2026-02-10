export default function Features({ site }: { site: any }) {
    return (
        <div className="max-w-7xl mx-auto mt-24 mb-24 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-10 md:gap-12 schneller-boxes">

                {(site.featuresSection.features as Array<{ title: string; colorClass: string; icon: string; text: string }>).map((f, i: number) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-2">
                            {/* If the icon is an image path (e.g., /images/better.svg) */}
                            <span className={`icon-${i + 1}`}>
                                <img
                                    src={f.icon} // Path to the SVG file
                                    alt={f.title} // Alternative text for accessibility
                                    className={`w-6 h-6 ${f.colorClass}`} // Styling
                                />
                            </span>
                            <h3 className="font-bold text-lg">{f.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {f.text}
                        </p>
                    </div>
                ))}


            </div>
        </div>
    );
}