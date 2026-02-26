import { ProductRepository } from "@/app/database/repositories/ProductRepository";
import { initializeDatabase } from "@/app/database/data-source";
import { ProductCreateForm } from "../ProductCreateForm";
import { ProductsListView } from "../ProductsListView";

// Helper function to convert Product entity to plain object
function productToPlainObject(product: any): any {
    return {
        id: product.id,
        name: product.name,
        tabTitle: product.tabTitle,
        tabDesc: product.tabDesc,
        tabImage: product.tabImage,
        heroImage: product.heroImage,
        video: product.video,
        featuresImage: product.featuresImage,
        savingsTitle: product.savingsTitle,
        savingsSubtitle: product.savingsSubtitle,
        stats: product.stats,
        description: product.description,
        technicalSpecs: product.technicalSpecs,
        features: product.features,
        displayOrder: product.displayOrder,
        createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
        updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt,
    };
}

export async function ProductsView() {
    await initializeDatabase();
    const repo = new ProductRepository();
    const products = await repo.findAll();
    const plainProducts = products.map(productToPlainObject);
    const totalProducts = plainProducts.length;

    return (
        <div className="grid grid-cols-1 gap-6">
            <article className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[--brand]">
                            Produkte
                        </div>
                        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">
                            Produkte verwalten
                        </h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            {totalProducts} Produkte gesamt
                        </p>
                    </div>
                </div>
            </article>

            <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Neues Produkt hinzufügen</h3>
                <ProductCreateForm />
            </div>

            {plainProducts.length === 0 ? (
                <article className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 shadow-sm text-center">
                    <p className="text-sm font-semibold text-slate-500">
                        Noch keine Produkte. Erstellen Sie oben Ihr erstes Produkt.
                    </p>
                </article>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 px-2">Produktliste</h3>
                    <ProductsListView products={plainProducts} />
                </div>
            )}
        </div>
    );
}
