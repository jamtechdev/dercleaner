import React from "react";
import Link from "next/link";

const Footer = ({ site }: { site: any }) => {
  return (
    <footer className="w-full bg-white ">
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Top Border Line */}
        <div className="border-t border-gray-200 mb-10"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            {/* Replace with your actual logo path */}
            <div className="w-32 h-auto">
              <img 
                src={site.branding.logo.src} 
                alt={site.branding.logo.alt} 
                className="w-full h-auto"
              />
            </div>
          </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-12">

          {/* Information Column */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-bold text-gray-900 mb-2">{site.footer.information.title}</h3>
            {(site.footer.information.links as Array<{ href: string; label: string }>).map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="text-gray-600 hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Rechtliches (Legal) Column */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-bold text-gray-900 mb-2">{site.footer.legal.title}</h3>
            {(site.footer.legal.links as Array<{ href: string; label: string }>).map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="text-gray-600 hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Dark Bar */}
      <div
        className="w-full h-16"
        style={{ backgroundColor: site.footer.bottomBarColor }}
      />
    </footer>
  );
};

export default Footer;