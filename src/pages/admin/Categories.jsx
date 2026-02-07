import { useState } from "react";
import { useDelete } from "../../hooks/useDelete";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";

export default function Categories() {
  const { data, refetch, loading } = useGet("/admin/categories");
  const { execute: create, loading: creating } = usePost();
  const { execute: remove, loading: deleting } = useDelete();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6"); // Default blue

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }
    
    await create({ 
      name: name.trim(), 
      description: description.trim(),
      color 
    }, { 
      headers: { "Content-Type": "application/json" } 
    });
    setName("");
    setDescription("");
    setColor("#3B82F6");
    refetch();
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This will remove it from all ebooks.`)) {
      await remove(`/admin/categories/${category.id}`, { onSuccess: refetch });
    }
  };

  const colorOptions = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Red", value: "#EF4444" },
    { name: "Green", value: "#10B981" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Pink", value: "#EC4899" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Gray", value: "#6B7280" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-600 mt-2">Organize your ebooks into categories</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Categories help users find ebooks faster</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column - Create Category Form */}
        <div className="lg:w-2/5">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create New Category</h2>
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                Required *
              </span>
            </div>
            
            <div className="space-y-5">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Web Development, Fiction, Business"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Keep it short and descriptive
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description about this category..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] transition-all"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {description.length}/200 characters
                </div>
              </div>

              {/* Color Picker */}
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
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform ${color === option.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                      style={{ backgroundColor: option.value }}
                      title={option.name}
                    >
                      {color === option.value && (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
                      Selected: {colorOptions.find(c => c.value === color)?.name}
                    </div>
                    <div className="text-gray-500">{color}</div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  onClick={handleCreate} 
                  disabled={creating || !name.trim()}
                  className={`w-full py-3.5 px-4 rounded-lg font-medium text-lg transition-all ${
                    creating || !name.trim()
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  } text-white flex items-center justify-center gap-2`}
                >
                  {creating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5 md:p-6">
            <h3 className="font-medium text-gray-800 mb-3">Categories Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-800">{data?.length || 0}</div>
                <div className="text-sm text-gray-600">Total Categories</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-800">
                  {data?.reduce((sum, cat) => sum + (cat.ebooks_count || 0), 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Total Ebooks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Categories List */}
        <div className="lg:w-3/5">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 md:px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">All Categories</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your ebook categories
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={refetch}
                    disabled={loading}
                    className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {loading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading categories...</p>
                </div>
              ) : data?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No categories yet</h3>
                  <p className="text-gray-500 mb-4">Create your first category to organize ebooks</p>
                  <button 
                    onClick={() => document.querySelector('input')?.focus()}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Create Category →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data?.map(cat => (
                    <div key={cat.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all bg-white group">
                      <div className="flex items-start justify-between gap-4">
                        {/* Category Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: cat.color || '#3B82F6' }}
                            >
                              {cat.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 truncate">{cat.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                  {cat.ebooks_count || 0} ebooks
                                </span>
                                {cat.description && (
                                  <span className="text-xs text-gray-500 truncate">
                                    {cat.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Ebooks Preview */}
                          {cat.ebooks_count > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Recent ebooks:</span>
                                <div className="flex -space-x-2">
                                  {[...Array(Math.min(cat.ebooks_count, 3))].map((_, i) => (
                                    <div 
                                      key={i}
                                      className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-gray-200 to-gray-300"
                                    />
                                  ))}
                                  {cat.ebooks_count > 3 && (
                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-800 text-white text-xs flex items-center justify-center">
                                      +{cat.ebooks_count - 3}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            disabled={deleting}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {data?.length > 0 && (
              <div className="px-5 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{data?.length}</span> categories
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Drag & drop to reorder categories
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}