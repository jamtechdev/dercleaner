"use client";

import { deleteProductAction } from "./actions";

export function DeleteProductButton({ productId }: { productId: string }) {
  const handleDelete = async () => {
    if (!confirm("Möchten Sie dieses Produkt wirklich löschen?")) {
      return;
    }
    
    const formData = new FormData();
    formData.append("id", productId);
    await deleteProductAction(formData);
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 hover:shadow"
    >
      Löschen
    </button>
  );
}
