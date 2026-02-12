import { useState } from "react";
import { useGet } from "../../hooks/useGet";
import { useDelete } from "../../hooks/useDelete";
import { usePut } from "../../hooks/usePut";

export default function Users() {
  // ✅ PAGE STATE
  const [page, setPage] = useState(1);

  // ✅ FETCH WITH PAGE
  const {
    data,
    loading,
    error: getError,
    refetch,
  } = useGet(`admin/users?page=${page}`);

  const { executeDelete: remove, loading: deleting } = useDelete();
  const { executePut: updateUser, loading: updating } =
    usePut("admin/users");

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

  // ✅ USERS ARRAY (FIXED FOR YOUR RESPONSE)
  const users = Array.isArray(data?.data) ? data.data : [];

  // ✅ PAGINATION OBJECT
  const pagination = data;

  // ================= DELETE =================
  const handleDelete = async (user) => {
    if (
      window.confirm(
        `Are you sure you want to delete user ${
          user.name || user.email
        }?`
      )
    ) {
      try {
        await remove(`/admin/users/${user.id}`, {
          onSuccess: refetch,
        });
        alert(
          `✅ User ${
            user.name || user.email
          } deleted successfully.`
        );
      } catch (err) {
        alert(
          `❌ Failed to delete user: ${
            err?.message || "Unknown error"
          }`
        );
      }
    }
  };

  // ================= OPEN MODAL =================
  const openUserModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      status: user.status || "",
      created_at: user.created_at || "",
    });
    setOpenModal(true);
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

      alert(
        `✅ User ${
          formData.name || selectedUser.email
        } updated successfully.`
      );
      setOpenModal(false);
      refetch();
    } catch (err) {
      alert(
        `❌ Failed to update user: ${
          err?.message || "Unknown error"
        }`
      );
    }
  };

  if (getError) {
    alert(
      `❌ Failed to load users: ${
        getError.message || "Unknown error"
      }`
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* HEADER */}
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">
              Users
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Manage registered customers
            </p>
          </div>

          <div className="bg-white border rounded-2xl px-6 py-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">
              Total Users
            </p>
            <p className="text-2xl font-semibold">
              {pagination?.total || 0}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b flex justify-between">
            <h2 className="text-xl font-semibold">
              All Users
            </h2>
            <button
              onClick={refetch}
              className="text-sm text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-sm text-gray-500">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="py-20 text-center text-sm text-gray-500">
                No users found
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-[#FAF9F7] border-b">
                  <tr>
                    <th className="px-6 py-4 text-left">ID</th>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Status</th>
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
                      <td className="px-6 py-5">
                        {user.name || "—"}
                      </td>
                      <td className="px-6 py-5">
                        {user.email}
                      </td>
                      <td className="px-6 py-5">
                        {user.role}
                      </td>
                      <td className="px-6 py-5">
                        {user.status}
                      </td>
                      <td className="px-6 py-5">
                        {user.created_at}
                      </td>
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

          {/* ✅ PAGINATION */}
          {pagination?.links && (
            <div className="flex justify-center items-center gap-2 py-6 flex-wrap border-t">
              {pagination.links.map((link, index) => (
                <button
                  key={index}
                  disabled={!link.url}
                  onClick={() => {
                    if (!link.url) return;
                    const url = new URL(link.url);
                    const pageParam =
                      url.searchParams.get("page");
                    setPage(Number(pageParam));
                  }}
                  className={`px-3 py-1 rounded border text-sm
                    ${
                      link.active
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    }
                    ${
                      !link.url
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  dangerouslySetInnerHTML={{
                    __html: link.label,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
