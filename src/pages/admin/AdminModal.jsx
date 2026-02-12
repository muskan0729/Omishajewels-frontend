import React from "react";

export default  AdminModal=()=>{
    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenModal(false)}
          />

          {/* Modal box */}
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-10">
            <h2 className="text-lg font-semibold mb-4">
              {selectedEbook.title}
            </h2>

            <p className="text-sm text-gray-600 mb-2">
              <strong>Description:</strong> {selectedEbook.description || "No description"}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Price:</strong> ₹{selectedEbook.price}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Categories:</strong> {selectedEbook.categories?.map(c => c.name).join(", ") || "None"}
            </p>

            {selectedEbook.images?.length > 0 && (
              <div className="flex gap-2 mt-2">
                {selectedEbook.images.map((img, idx) => (
                  <img key={idx} src={img} alt="ebook" className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}

            {selectedEbook.ebook_file && (
              <p className="mt-4">
                <a
                  href={selectedEbook.ebook_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View PDF
                </a>
              </p>
            )}

            <button
              onClick={() => setOpenModal(false)}
              className="mt-6 w-full bg-red-500 text-white py-2 rounded"
            >
              Close
            </button>
            <button
              className="mt-6 w-full bg-green-500 text-white py-2 rounded"
            >
              Update
            </button>
          </div>
        </div>
    )
}