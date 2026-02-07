import { useState } from "react";
import { useDelete } from "../../hooks/useDelete";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";

export default function Ebooks() {
  const { data, refetch } = useGet("/admin/ebooks");
  const { execute: create, loading: creating } = usePost();
  const { execute: remove, loading: deleting } = useDelete();

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

  const handleCreate = async () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("price", form.price);
    if (form.ebook_file) {
      fd.append("ebook_file", form.ebook_file);
    }
    form.images.forEach(img => fd.append("images[]", img));
    form.categories.forEach(id => fd.append("categories[]", id));

    await create(fd);
    setForm({ title: "", description: "", price: "", ebook_file: null, images: [], categories: [] });
    setSelectedFiles({ pdfName: "No file chosen", imagesCount: 0 });
    refetch();
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, ebook_file: file });
      setSelectedFiles({ ...selectedFiles, pdfName: file.name });
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    setSelectedFiles({ ...selectedFiles, imagesCount: files.length });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ebooks Management</h1>
        <p className="text-gray-600 mt-2">Add, edit, and manage your ebook collection</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column - Create Form */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add New Ebook</h2>
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                All fields marked * are required
              </span>
            </div>
            
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input 
                  placeholder="e.g., Mastering React for Beginners" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={form.title} 
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  placeholder="Provide a detailed description of the ebook..." 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] transition-all"
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {form.description.length}/500 characters
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={form.price} 
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* PDF File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ebook PDF File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <input 
                        type="file" 
                        id="ebook-file"
                        className="hidden"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfChange}
                      />
                      <label 
                        htmlFor="ebook-file"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg cursor-pointer transition-colors font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Choose PDF File
                      </label>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded ${selectedFiles.pdfName !== "No file chosen" ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {selectedFiles.pdfName !== "No file chosen" ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm truncate ${selectedFiles.pdfName !== "No file chosen" ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                          {selectedFiles.pdfName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Only PDF files (Max: 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-400 transition-colors">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <input 
                        type="file" 
                        id="ebook-images"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                      />
                      <label 
                        htmlFor="ebook-images"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg cursor-pointer transition-colors font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Choose Images
                      </label>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded ${selectedFiles.imagesCount > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {selectedFiles.imagesCount > 0 ? (
                            <span className="text-green-700 font-bold">{selectedFiles.imagesCount}</span>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm ${selectedFiles.imagesCount > 0 ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                          {selectedFiles.imagesCount > 0 
                            ? `${selectedFiles.imagesCount} image${selectedFiles.imagesCount > 1 ? 's' : ''} selected` 
                            : "No images chosen"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Multiple images allowed (PNG, JPG, WebP)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Preview */}
              {form.categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Categories
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                    {form.categories.map(catId => (
                      <span key={catId} className="inline-flex items-center gap-1 bg-white border border-gray-300 px-3 py-1.5 rounded-full text-sm">
                        Category {catId}
                        <button 
                          onClick={() => setForm({...form, categories: form.categories.filter(id => id !== catId)})}
                          className="text-gray-400 hover:text-red-500 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  onClick={handleCreate} 
                  disabled={creating}
                  className={`w-full py-3.5 px-4 rounded-lg font-medium text-lg transition-all ${
                    creating 
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
                      Creating Ebook...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Save Ebook
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Ebooks List */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 md:px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Existing Ebooks</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {data?.data?.length || 0} ebooks in your collection
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={refetch}
                    className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
              {data?.data?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No ebooks yet</h3>
                  <p className="text-gray-500 mb-4">Create your first ebook to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.data?.map(ebook => (
                    <div key={ebook.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Ebook Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{ebook.title}</h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {ebook.description || "No description provided"}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm font-bold text-gray-900">₹{ebook.price}</span>
                                <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${
                                  ebook.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : ebook.status === 'draft'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {ebook.status || 'active'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <a 
                            href={`/admin/images/${ebook.id}`}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Manage Images"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </a>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${ebook.title}"?`)) {
                                remove(`/admin/ebooks/${ebook.id}`, { onSuccess: refetch });
                              }
                            }}
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
            {data?.data?.length > 0 && (
              <div className="px-5 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{data?.data?.length}</span> ebooks
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View All Ebooks →
                    </button>
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