import { useState } from "react";
import { useDelete } from "../../hooks/useDelete";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";

export default function Ebooks() {
  const { data, refetch } = useGet("/admin/ebooks");
  const { execute: create, loading: creating } = usePost();
  const { execute: remove, loading: deleting } = useDelete();

  // ✅ safety (blank page proof)
  const ebooks = Array.isArray(data?.data) ? data.data : [];

  const [form, setForm] = useState({
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

  /* ===========================
     HANDLERS (UNCHANGED LOGIC)
  ============================ */

  const handleCreate = async () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("price", form.price);

    if (form.ebook_file) {
      fd.append("ebook_file", form.ebook_file);
    }

    form.images.forEach((img) => fd.append("images[]", img));
    form.categories.forEach((id) => fd.append("categories[]", id));

    await create(fd);

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
  };

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

  /* ===========================
     UI STARTS HERE
  ============================ */

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* ================= PAGE HEADER ================= */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#2E2E2E]">
              Ebooks Management
            </h1>
            <p className="text-sm text-[#6B6B6B] mt-2 max-w-xl">
              Add, manage and organize your digital ebook collection
              from a single place.
            </p>
          </div>

          <div className="bg-white border border-[#E9E4DA] rounded-2xl px-6 py-4 shadow-sm flex gap-8">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Total Ebooks
              </p>
              <p className="text-2xl font-semibold text-[#2E2E2E]">
                {ebooks.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Collection Value
              </p>
              <p className="text-2xl font-semibold text-[#2E2E2E]">
                ₹
                {ebooks.reduce(
                  (sum, e) => sum + Number(e.price || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-10"> */}
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10">

          {/* ================= LEFT : CREATE FORM ================= */}
          <div className="bg-white border border-[#E9E4DA] rounded-3xl p-8 shadow-sm">

            <h2 className="text-xl font-semibold text-[#2E2E2E] mb-8">
              Add New Ebook
            </h2>

            <div className="space-y-7">

              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ebook Title <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Mastering React"
                  className="
                    w-full px-5 py-3
                    rounded-xl border border-[#E9E4DA]
                    focus:ring-1 focus:ring-yellow-500
                    focus:outline-none
                  "
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Detailed description of the ebook"
                  className="
                    w-full px-5 py-3
                    rounded-xl border border-[#E9E4DA]
                    min-h-[120px]
                    focus:ring-1 focus:ring-yellow-500
                    focus:outline-none
                  "
                />
                <p className="text-xs text-[#6B6B6B] mt-2">
                  {form.description.length}/500 characters
                </p>
              </div>

              {/* PRICE */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  placeholder="0.00"
                  className="
                    w-full px-5 py-3
                    rounded-xl border border-[#E9E4DA]
                    focus:ring-1 focus:ring-yellow-500
                    focus:outline-none
                  "
                />
              </div>

              {/* PDF UPLOAD */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ebook PDF <span className="text-red-500">*</span>
                </label>

                <div className="border border-dashed border-[#E9E4DA] rounded-lg p-3">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="ebook_pdf"
                    onChange={handlePdfChange}
                  />

                  <label
                    htmlFor="ebook_pdf"
                    className="
                      inline-flex items-center gap-2
                      bg-blue-600 text-white
                      px-4 py-2 text-sm
                      rounded-lg
                      cursor-pointer hover:bg-blue-700 transition
                    "
                  >
                    Upload PDF
                  </label>

                  <p className="text-xs text-[#6B6B6B] mt-2 truncate">
                    {selectedFiles.pdfName}
                  </p>
                </div>
              </div>

              {/* IMAGES */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cover Images
                </label>

                <div className="border border-dashed border-[#E9E4DA] rounded-lg p-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="ebook_images"
                    onChange={handleImagesChange}
                  />

                  <label
                    htmlFor="ebook_images"
                    className="
                      inline-flex items-center gap-2
                      bg-green-600 text-white
                      px-4 py-2 text-sm
                      rounded-lg
                      cursor-pointer hover:bg-green-700 transition
                    "
                  >
                    Upload Images
                  </label>

                  <p className="text-xs text-[#6B6B6B] mt-2">
                    {selectedFiles.imagesCount} image(s) selected
                  </p>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                onClick={handleCreate}
                disabled={creating}
                className="
                  w-full py-3 rounded-full
                  bg-blue-600 text-white
                  text-sm font-medium tracking-wide
                  hover:bg-blue-700 transition
                  disabled:opacity-50
                "
              >
                {creating ? "Saving Ebook..." : "Save Ebook"}
              </button>
            </div>
          </div>

          {/* ================= RIGHT : EBOOK LIST ================= */}
          <div className="bg-white border border-[#E9E4DA] rounded-3xl shadow-sm overflow-hidden">

            <div className="px-8 py-6 border-b border-[#E9E4DA] flex justify-between">
              <h2 className="text-xl font-semibold text-[#2E2E2E]">
                Existing Ebooks
              </h2>
              <button
                onClick={refetch}
                className="text-sm text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            <div className="p-8 space-y-4">

              {ebooks.length === 0 ? (
                <p className="text-center text-[#6B6B6B] py-16">
                  No ebooks found
                </p>
              ) : (
                ebooks.map((ebook) => (
                  <div
                    key={ebook.id}
                    className="
                      border border-[#E9E4DA]
                      rounded-2xl p-5
                      hover:shadow-md transition
                      bg-[#FEFCF9]
                      flex justify-between items-start gap-6
                    "
                  >
                    <div>
                      <h3 className="font-semibold text-[#2E2E2E]">
                        {ebook.title}
                      </h3>
                      <p className="text-sm text-[#6B6B6B] mt-1 line-clamp-2">
                        {ebook.description || "No description"}
                      </p>
                      <p className="text-sm font-semibold mt-2">
                        ₹{ebook.price}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete "${ebook.title}"?`
                          )
                        ) {
                          remove(`/admin/ebooks/${ebook.id}`, {
                            onSuccess: refetch,
                          });
                        }
                      }}
                      disabled={deleting}
                      className="
                        text-sm text-red-500
                        hover:underline
                        disabled:opacity-50
                      "
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
