import { Header } from "../components/Header";
import Footer from "../components/Footer";
import { getSite } from "../lib/site";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const site = await getSite();

    return (
        <>
            <Header site={site} />
            {children}
            <Footer site={site} />
        </>
    );
}
