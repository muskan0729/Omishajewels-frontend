import { useState } from "react";
import { useDelete } from "../../hooks/useDelete";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";

export default function Categories() {
  const { data, refetch, loading } = useGet("/admin/categories");
  const { execute: create, loading: creating } = usePost();
  const { execute: remove, loading: deleting } = useDelete();

  // ✅ SAFETY: avoid blank page if API fails
  const categories = Array.isArray(data) ? data : [];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    await create(
      {
        name: name.trim(),
        description: description.trim(),
        color,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    setName("");
    setDescription("");
    setColor("#3B82F6");
    refetch();
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      await remove(`/admin/categories/${category.id}`, {
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
      {/* ================= PAGE CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* ================= PAGE HEADER ================= */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#2E2E2E] tracking-tight">
              Categories
            </h1>
            <p className="text-sm text-[#6B6B6B] mt-2 max-w-xl">
              Create and manage categories to organize your ebooks clearly and
              improve discoverability for users.
            </p>
          </div>

          <div className="bg-white border border-[#E9E4DA] rounded-2xl px-6 py-4 flex gap-6 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Total Categories
              </p>
              <p className="text-2xl font-semibold text-[#2E2E2E]">
                {categories.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Total Ebooks
              </p>
              <p className="text-2xl font-semibold text-[#2E2E2E]">
                {categories.reduce((sum, c) => sum + (c.ebooks_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10">
          {/* ================= LEFT : CREATE FORM ================= */}
          <div className="bg-white border border-[#E9E4DA] rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2E2E2E] mb-8">
              Create New Category
            </h2>

            <div className="space-y-7">
              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fiction, Business, History"
                  className="
                    w-full px-5 py-3
                    rounded-xl border border-[#E9E4DA]
                    text-sm
                    focus:ring-1 focus:ring-yellow-500
                    focus:outline-none
                  "
                />
                <p className="text-xs text-[#6B6B6B] mt-2">
                  Keep it short and descriptive
                </p>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description about this category"
                  className="
                    w-full px-5 py-3
                    rounded-xl border border-[#E9E4DA]
                    text-sm min-h-[110px]
                    focus:ring-1 focus:ring-yellow-500
                    focus:outline-none
                  "
                />
                <p className="text-xs text-[#6B6B6B] mt-2">
                  {description.length}/200 characters
                </p>
              </div>

              {/* COLOR PICKER */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Color
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setColor(option.value)}
                      className={`cursor-pointer w-10 h-10 rounded-lg flex items-center justify-center transition-transform ${color === option.value ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
                      style={{ backgroundColor: option.value }}
                      title={option.name}
                    >
                      {color === option.value && (
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className="w-8 h-8 rounded-md"
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-sm">
                    <div className="font-medium" style={{ color: color }}>
                      Selected:{" "}
                      {colorOptions.find((c) => c.value === color)?.name}
                    </div>
                    <div className="text-gray-500">{color}</div>
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                onClick={handleCreate}
                disabled={creating || !name.trim()}
                className="
                  w-full py-4 rounded-full
                  bg-blue-600 text-white
                  text-sm font-medium tracking-wide
                  hover:bg-blue-700 transition
                  disabled:opacity-50
                "
              >
                {creating ? "Creating Category..." : "Add Category"}
              </button>
            </div>
          </div>

          {/* ================= RIGHT : CATEGORY LIST ================= */}
          <div className="bg-white border border-[#E9E4DA] rounded-3xl shadow-sm overflow-hidden">
            {/* HEADER */}
            <div className="px-8 py-6 border-b border-[#E9E4DA] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#2E2E2E]">
                  All Categories
                </h2>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  Manage and delete existing categories
                </p>
              </div>

              <button
                onClick={refetch}
                className="text-sm text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-8">
              {loading ? (
                <div className="text-center py-16 text-sm text-[#6B6B6B]">
                  Loading categories...
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-sm text-[#6B6B6B]">
                    No categories created yet
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="
                        group
                        border border-[#E9E4DA]
                        rounded-2xl p-6
                        bg-[#FEFCF9]
                        hover:shadow-md transition
                      "
                    >
                      <div className="flex justify-between items-start gap-4">
                        {/* INFO */}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className="w-11 h-11 rounded-xl text-white flex items-center justify-center font-semibold"
                              style={{
                                backgroundColor: cat.color || "#3B82F6",
                              }}
                            >
                              {cat.name?.[0]?.toUpperCase()}
                            </span>

                            <div>
                              <h3 className="font-semibold text-[#2E2E2E]">
                                {cat.name}
                              </h3>
                              <p className="text-xs text-[#6B6B6B]">
                                {cat.ebooks_count || 0} ebooks
                              </p>
                            </div>
                          </div>

                          {cat.description && (
                            <p className="text-sm text-[#6B6B6B] mt-2">
                              {cat.description}
                            </p>
                          )}
                        </div>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={deleting}
                          className="
                            text-xs text-red-500
                            opacity-0 group-hover:opacity-100
                            hover:underline transition
                          "
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER */}
            {categories.length > 0 && (
              <div className="px-8 py-4 border-t border-[#E9E4DA] bg-[#FAF9F7] text-sm text-[#6B6B6B]">
                Showing <span className="font-medium">{categories.length}</span>{" "}
                categories
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
