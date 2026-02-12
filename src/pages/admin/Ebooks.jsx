import { useEffect, useState } from "react";
import { useDelete } from "../../hooks/useDelete";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";
import { usePut } from "../../hooks/usePut";

export default function Ebooks() {
  const { data: categorieData, error: categoryError } = useGet("/categories");
  const { data, refetch, error: ebooksError } = useGet("/admin/ebooks");
  const { execute: create, loading: creating, error: postError } = usePost("/admin/ebooks");
  const { executeDelete: remove, loading: deleting, error: deleteError } = useDelete("/admin/ebooks");
  const { executePut: update, loading: updating, error: putError } = usePut("/admin/ebooks");

  const [openModal, setOpenModal] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);

  const ebooks = Array.isArray(data?.data.data) ? data.data.data : [];

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    ebook_file: null,
    images: [],
    categories: [],
  });

  const [updateForm, setUpdateForm] = useState({
    title: "",
    description: "",
    price: "",
    ebook_file: null,
    images: [],
    categories: [],
  });

  const [selectedFiles, setSelectedFiles] = useState({
    pdfName: "No file chosen",
    imagesCount: 0,
  });

  /* ================= PREFILL UPDATE FORM ================= */
  useEffect(() => {
    if (selectedEbook) {
      setUpdateForm({
        title: selectedEbook.title || "",
        description: selectedEbook.description || "",
        price: selectedEbook.price || "",
        ebook_file: null,
        images: [],
        categories: selectedEbook.categories?.map((c) => c.id) || [],
      });
    }
  }, [selectedEbook]);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", form.price);

      if (form.ebook_file) fd.append("ebook_file", form.ebook_file);
      form.images.forEach((img) => fd.append("images[]", img));
      form.categories.forEach((id) => fd.append("categories[]", id));

      await create(fd);

      alert(`✅ Ebook "${form.title}" created successfully!`);

      setForm({
        title: "",
        description: "",
        price: "",
        ebook_file: null,
        images: [],
        categories: [],
      });

      setSelectedFiles({
        pdfName: "No file chosen",
        imagesCount: 0,
      });

      refetch();
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to create ebook: ${err.message || postError?.message || postError?.error || "Unknown error"}`);
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!selectedEbook) return;

    try {
      const fd = new FormData();
      fd.append("title", updateForm.title);
      fd.append("description", updateForm.description);
      fd.append("price", updateForm.price);

      if (updateForm.ebook_file) fd.append("ebook_file", updateForm.ebook_file);
      updateForm.images.forEach((img) => fd.append("images[]", img));
      updateForm.categories.forEach((id) => fd.append("categories[]", id));

      await update({ id: selectedEbook.id, formData: fd });

      alert(`✅ Ebook "${updateForm.title}" updated successfully!`);
      setOpenModal(false);
      refetch();
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to update ebook: ${err.message || putError?.message || "Unknown error"}`);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (ebook) => {
    if (!window.confirm(`Delete "${ebook.title}"?`)) return;

    try {
      await remove(`${ebook.id}`, { onSuccess: refetch });
      alert(`✅ Ebook "${ebook.title}" deleted successfully!`);
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to delete ebook: ${err.message || deleteError?.message || "Unknown error"}`);
    }
  };

  /* ================= FILE HANDLERS ================= */
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, ebook_file: file });
    setSelectedFiles({ ...selectedFiles, pdfName: file.name });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    setSelectedFiles({ ...selectedFiles, imagesCount: files.length });
  };

  /* ================= ERROR ALERTS FOR FETCH ================= */
  useEffect(() => {
    if (categoryError) alert(`❌ Failed to load categories: ${categoryError.message}`);
    if (ebooksError) alert(`❌ Failed to load ebooks: ${ebooksError.message}`);
  }, [categoryError, ebooksError]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#2E2E2E]">
              Ebooks Management
            </h1>
          </div>
        </div>

        {/* CREATE FORM */}
        <div className="bg-white border rounded-3xl p-8 shadow-sm mb-10">
          <h2 className="text-xl font-semibold mb-8">Add New Ebook</h2>
          <div className="space-y-5">

            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="w-full border p-3 rounded-xl"
            />

            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price"
              className="w-full border p-3 rounded-xl"
            />

            <input type="file" accept=".pdf" onChange={handlePdfChange} className="w-full" />
            <input type="file" multiple accept="image/*" onChange={handleImagesChange} className="w-full" />

            <select
              value={form.categories[0] || ""}
              onChange={(e) =>
                setForm({ ...form, categories: e.target.value ? [Number(e.target.value)] : [] })
              }
              className="w-full border p-3 rounded-xl"
            >
              <option value="">Select category</option>
              {categorieData?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full bg-blue-600 text-white py-3 rounded-full"
            >
              {creating ? "Saving..." : "Save Ebook"}
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="bg-white border rounded-3xl shadow-sm p-6">
          {ebooks.map((ebook) => (
            <div
              key={ebook.id}
              onClick={() => {
                setSelectedEbook(ebook);
                setOpenModal(true);
              }}
              className="border rounded-xl p-4 mb-4 cursor-pointer hover:shadow"
            >
              <h3 className="font-semibold">{ebook.title}</h3>
              <p className="text-sm text-gray-500">₹{ebook.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(ebook);
                }}
                className="text-red-500 text-sm mt-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {openModal && selectedEbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-10 max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg font-semibold mb-4">Update Ebook</h2>

            <input
              value={updateForm.title}
              onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
              className="w-full border p-2 rounded mb-3"
              placeholder="Title"
            />

            <textarea
              value={updateForm.description}
              onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
              className="w-full border p-2 rounded mb-3"
              placeholder="Description"
            />

            <input
              type="number"
              value={updateForm.price}
              onChange={(e) => setUpdateForm({ ...updateForm, price: e.target.value })}
              className="w-full border p-2 rounded mb-3"
              placeholder="Price"
            />

            <select
              value={updateForm.categories[0] || ""}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, categories: e.target.value ? [Number(e.target.value)] : [] })
              }
              className="w-full border p-2 rounded mb-3"
            >
              <option value="">Select category</option>
              {categorieData?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setUpdateForm({ ...updateForm, ebook_file: e.target.files[0] })}
              className="w-full mb-3"
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setUpdateForm({ ...updateForm, images: Array.from(e.target.files) })}
              className="w-full mb-4"
            />

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="w-full bg-green-500 text-white py-2 rounded mb-3"
            >
              {updating ? "Updating..." : "Update"}
            </button>

            <button
              onClick={() => setOpenModal(false)}
              className="w-full bg-red-500 text-white py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
