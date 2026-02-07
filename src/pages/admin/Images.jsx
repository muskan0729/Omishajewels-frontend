import { useState } from "react";
import { useDelete } from "../../hooks/useDelete";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";

export default function Images({ ebookId }) {
  const { data, refetch, loading } = useGet(`/admin/ebooks/${ebookId}/images`);
  const { execute: upload, loading: uploading } = usePost();
  const { execute: remove, loading: deleting } = useDelete();

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append("images[]", f));

    await upload(`/admin/ebooks/${ebookId}/images`, fd);
    setFiles([]);
    setSelectedFiles([]);
    refetch();
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setSelectedFiles(selected.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file)
    })));
  };

  const handleDeleteImage = async (image) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      await remove(`/admin/ebook-images/${image.id}`, { onSuccess: refetch });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      setSelectedFiles(droppedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file)
      })));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Images</h1>
            <p className="text-gray-600 mt-2">Upload and manage ebook images</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column - Upload Area */}
        <div className="lg:w-2/5">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Upload Images</h2>
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                Multiple uploads
              </span>
            </div>
            
            {/* Drag & Drop Area */}
            <div
              className={`relative border-2 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} rounded-xl p-6 md:p-8 transition-all duration-200 ${files.length === 0 ? 'cursor-pointer' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => files.length === 0 && document.getElementById('file-input')?.click()}
            >
              <input
                type="file"
                id="file-input"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedFiles.length === 0 ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Drop images here</h3>
                  <p className="text-gray-500 mb-4">or click to browse files</p>
                  <div className="text-xs text-gray-400">
                    Supports JPG, PNG, WebP • Max 5MB per image
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-700">
                      {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                    </h3>
                    <button
                      onClick={() => {
                        setFiles([]);
                        setSelectedFiles([]);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear all
                    </button>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-12 h-12">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newFiles = [...files];
                            const newSelected = [...selectedFiles];
                            newFiles.splice(index, 1);
                            newSelected.splice(index, 1);
                            setFiles(newFiles);
                            setSelectedFiles(newSelected);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="mt-6">
              <button 
                onClick={handleUpload} 
                disabled={uploading || files.length === 0}
                className={`w-full py-3.5 px-4 rounded-lg font-medium text-lg transition-all ${
                  uploading || files.length === 0
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                } text-white flex items-center justify-center gap-2`}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Upload {files.length > 0 ? `(${files.length})` : ''}
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Images will be optimized for web display
              </p>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">📸 Image Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Recommended size: 1200×800 pixels</li>
                <li>• Formats: JPG, PNG, WebP</li>
                <li>• Max file size: 5MB per image</li>
                <li>• Use high-quality, clear images</li>
                <li>• First image will be used as cover</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Images Gallery */}
        <div className="lg:w-3/5">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 md:px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Gallery ({data?.length || 0} images)
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    All images associated with this ebook
                  </p>
                </div>
                {data?.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Drag to reorder</span> • Click to preview
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading images...</p>
                </div>
              ) : data?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No images uploaded yet</h3>
                  <p className="text-gray-500 mb-4">Upload images to showcase your ebook</p>
                  <button 
                    onClick={() => document.getElementById('file-input')?.click()}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Upload First Image →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data?.map((img, index) => (
                    <div 
                      key={img.id} 
                      className="group relative border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
                    >
                      {/* Image Container */}
                      <div className="aspect-w-4 aspect-h-3 bg-gray-100">
                        <img 
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${img.image_path}`} 
                          alt={`Ebook image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-white font-medium truncate">
                                Image {index + 1}
                              </div>
                              <div className="text-xs text-white/80">
                                {img.created_at ? new Date(img.created_at).toLocaleDateString() : 'Recently added'}
                              </div>
                            </div>
                            {index === 0 && (
                              <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                                Cover
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => {
                            const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${img.image_path}`;
                            window.open(url, '_blank');
                          }}
                          className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm"
                          title="View full size"
                        >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteImage(img)}
                          disabled={deleting}
                          className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm"
                          title="Delete image"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Set as Cover Button (for non-first images) */}
                      {index !== 0 && (
                        <button
                          onClick={() => {
                            // Implement set as cover functionality
                            console.log('Set as cover:', img.id);
                          }}
                          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm"
                        >
                          Set as Cover
                        </button>
                      )}
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
                    Showing <span className="font-medium">{data?.length}</span> images
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      First image is displayed as ebook cover
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {data?.length > 0 && (
            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h3 className="font-medium text-gray-700 mb-3">Bulk Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  Download All
                </button>
                <button className="px-4 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                  Delete All
                </button>
                <button className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                  Reorder Images
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}