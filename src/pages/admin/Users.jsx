import { useState } from "react";
import { useGet } from "../../hooks/useGet";
import { useDelete } from "../../hooks/useDelete";
import { usePut } from "../../hooks/usePut";

export default function Users() {
  const { data, loading, error: getError, refetch } = useGet("/admin/users");
  const { executeDelete: remove, loading: deleting, error: deleteError } = useDelete();
  const { executePut: updateUser, loading: updating, error: putError } = usePut("/admin/users");

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

  const users = Array.isArray(data?.data) ? data.data : [];

  // ================= DELETE =================
  const handleDelete = async (user) => {
    if (
      window.confirm(
        `Are you sure you want to delete user ${user.name || user.email}?`
      )
    ) {
      try {
        await remove(`/admin/users/${user.id}`, { onSuccess: refetch });
        alert(`✅ User ${user.name || user.email} deleted successfully.`);
      } catch (err) {
        console.error(err);
        alert(`❌ Failed to delete user: ${err?.message || err?.error || "Unknown error"}`);
      }
    }
  };

  // ================= OPEN MODAL =================
  const openUserModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      orders_count: user.orders_count ?? 0,
      created_at: user.created_at || "",
    });
    setOpenModal(true);
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "orders_count" ? Number(value) : value,
    }));
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      await updateUser({
        id: selectedUser.id,
        data: formData,
      });

      alert(`✅ User ${formData.name || selectedUser.email} updated successfully.`);
      setOpenModal(false);
      refetch();
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to update user: ${err.message || err?.error ||"Unknown error"}`);
    }
  };

  // ================= FETCH ERROR HANDLING =================
  if (getError) {
    alert(`❌ Failed to load users: ${getError.message || "Unknown error"}`);
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* HEADER */}
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-[#2E2E2E]">Users</h1>
            <p className="text-sm text-[#6B6B6B] mt-2">Manage registered customers</p>
          </div>

          <div className="bg-white border border-[#E9E4DA] rounded-2xl px-6 py-4 shadow-sm">
            <p className="text-xs uppercase text-[#6B6B6B]">Total Users</p>
            <p className="text-2xl font-semibold">{users.length}</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#E9E4DA] rounded-3xl shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b flex justify-between">
            <h2 className="text-xl font-semibold">All Users</h2>
            <button onClick={refetch} className="text-sm text-blue-600 hover:underline">
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-sm text-gray-500">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="py-20 text-center text-sm text-gray-500">No users found</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-[#FAF9F7] border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">ID</th>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Phone</th>
                    <th className="px-6 py-4 text-left">Orders</th>
                    <th className="px-6 py-4 text-left">Joined</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-[#FAF9F7] cursor-pointer"
                      onClick={() => openUserModal(user)}
                    >
                      <td className="px-6 py-5">#{user.id}</td>
                      <td className="px-6 py-5">{user.name || "—"}</td>
                      <td className="px-6 py-5">{user.email}</td>
                      <td className="px-6 py-5">{user.phone || "-"}</td>
                      <td className="px-6 py-5">{user.orders_count ?? 0}</td>
                      <td className="px-6 py-5">{user.created_at}</td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user);
                          }}
                          disabled={deleting}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {users.length > 0 && (
            <div className="px-8 py-4 bg-[#FAF9F7] text-sm text-gray-600">
              Showing {users.length} users
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {openModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-10">
            <h2 className="text-lg font-semibold mb-4">Edit User #{selectedUser.id}</h2>

            <div className="space-y-4">
              {["name", "email", "phone", "orders_count", "created_at"].map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium capitalize">{field.replace("_", " ")}</label>
                  <input
                    type={field === "orders_count" ? "number" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="w-1/2 bg-gray-200 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-1/2 bg-green-600 text-white py-2 rounded disabled:opacity-50"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
