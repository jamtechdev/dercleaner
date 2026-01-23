"use client";

import { useState } from "react";
import { deleteProductAction } from "./actions";
import { ProductEditForm } from "./ProductEditForm";

export function ProductsListView({ products }: { products: any[] }) {
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const editingProduct = editingProductId ? products.find(p => p.id === editingProductId) : null;

  if (editingProduct) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditingProductId(null)}
            className="rounded-full border border-brand/25 bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
          >
            ← Zurück zur Liste
          </button>
          <h3 className="text-lg font-extrabold text-ink">
            Produkt bearbeiten: {editingProduct.name}
          </h3>
        </div>
        <ProductEditForm product={editingProduct} />
      </div>
    );
  }

  return (
    <article className="rounded-3xl border border-brand/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="mt-6 overflow-hidden rounded-2xl border border-brand/10 shadow-inner">
        <div className="max-h-[600px] overflow-auto bg-brand-surface/20">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-[1] bg-brand-surface">
              <tr>
                <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                  Produktname
                </th>
                <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                  Tab-Titel
                </th>
                <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                  Erstellt
                </th>
                <th className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-ink">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr
                  key={product.id}
                  className={`border-t border-brand/10 transition hover:bg-brand-surface/50 ${
                    i % 2 === 1 ? "bg-white/50" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-ink">
                    {product.name || "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {product.tabTitle || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold tabular-nums text-gray-600">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProductId(product.id)}
                        className="rounded-full border border-brand/25 bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-sm transition hover:border-brand/40 hover:bg-brand-surface hover:shadow"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Möchten Sie das Produkt "${product.name}" wirklich löschen?`)) {
                            setDeletingProductId(product.id);
                            const formData = new FormData();
                            formData.append("id", product.id);
                            deleteProductAction(formData).then(() => {
                              setDeletingProductId(null);
                              window.location.reload();
                            });
                          }
                        }}
                        disabled={deletingProductId === product.id}
                        className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 hover:shadow disabled:opacity-50"
                      >
                        {deletingProductId === product.id ? "Löschen..." : "Löschen"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}
