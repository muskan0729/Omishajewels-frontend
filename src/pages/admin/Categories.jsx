import { useState } from "react";
import { useDelete } from "../../hooks/useDelete";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";

export default function Categories() {
  const { data, refetch, loading } = useGet("admin/categories");
  const { execute: create, loading: creating } = usePost('admin/categories');
  const { executeDelete: remove, loading: deleting } = useDelete('admin/categories');
  const categories = Array.isArray(data) ? data : [];
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [color, setColor] = useState("#3B82F6");

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    await create(
      { name: name.trim(), description: description.trim(), },
      { headers: { "Content-Type": "application/json" } }
    );

    setName("");
    setDescription("");
    setColor("#3B82F6");
    refetch();
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      await remove(category.id, {
        onSuccess: refetch,
      });
    }
  };
  const colorOptions = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Red", value: "#EF4444" },
    { name: "Green", value: "#10B981" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Pink", value: "#EC4899" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Gray", value: "#6B7280" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {/* ================= PAGE HEADER ================= */}
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#2E2E2E]">
            Categories
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-2 max-w-xl">
            Create and manage categories to organize your ebooks clearly and
            improve discoverability for users.
          </p>

          <div className="mt-6 flex gap-6">
            <div className="bg-white border border-[#E9E4DA] rounded-2xl px-6 py-4 shadow-sm">
              <p className="text-xs uppercase text-[#6B6B6B]">Total Categories</p>
              <p className="text-2xl font-semibold">{categories.length}</p>
            </div>

            <div className="bg-white border border-[#E9E4DA] rounded-2xl px-6 py-4 shadow-sm">
              <p className="text-xs uppercase text-[#6B6B6B]">Total Ebooks</p>
              <p className="text-2xl font-semibold">
                {categories.reduce((s, c) => s + (c.ebooks_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* ================= CREATE CATEGORY ================= */}
        <div className="bg-white border border-[#E9E4DA] rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-8">Create New Category</h2>

          <div className="space-y-7">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fiction, Business, History"
                className="w-full px-5 py-3 rounded-xl border border-[#E9E4DA] text-sm focus:ring-1 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-[#E9E4DA] text-sm min-h-[110px]"
              />
            </div>

            {/* COLOR */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">
                Category Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-9 h-9 rounded-lg ${color === c.value
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                      }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div> */}
            <button
              onClick={handleCreate}
              disabled={creating || !name.trim()}
              className="w-full py-4 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
            >
              {creating ? "Creating Category..." : "Add Category"}
            </button>
          </div>
        </div>

        {/* ================= CATEGORY LIST ================= */}
        <div className="bg-white border border-[#E9E4DA] rounded-3xl shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">All Categories</h2>
              <p className="text-xs text-[#6B6B6B]">
                Manage and delete existing categories
              </p>
            </div>
            <button onClick={refetch} className="text-sm text-blue-600">
              Refresh
            </button>
          </div>

          <div className="p-8">
            {loading ? (
              <p className="text-center text-sm text-[#6B6B6B]">
                Loading categories...
              </p>
            ) : categories.length === 0 ? (
              <p className="text-center text-sm text-[#6B6B6B]">
                No categories created yet
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="border rounded-2xl p-6 bg-[#FEFCF9] hover:shadow-md transition group"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <p className="text-xs text-[#6B6B6B]">
                          {cat.ebooks_count || 0} ebooks
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={deleting}
                        className="text-xs text-red-500 opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                    {cat.description && (
                      <p className="text-sm text-[#6B6B6B] mt-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
     
    </div>
  );
}
