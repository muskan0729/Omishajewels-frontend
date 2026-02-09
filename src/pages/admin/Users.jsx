import { useGet } from "../../hooks/useGet";
import { useDelete } from "../../hooks/useDelete";

export default function Users() {
  const { data, loading, refetch } = useGet("/admin/users");
  const { execute: remove, loading: deleting } = useDelete();

  // 🛡️ SAFETY
  const users = Array.isArray(data) ? data : [];

  const handleDelete = async (user) => {
    if (
      window.confirm(
        `Are you sure you want to delete user ${user.name || user.email}?`
      )
    ) {
      await remove(`/admin/users/${user.id}`, {
        onSuccess: refetch,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* ================= PAGE CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* ================= HEADER ================= */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#2E2E2E]">
              Users
            </h1>
            <p className="text-sm text-[#6B6B6B] mt-2 max-w-xl">
              Manage registered customers, view contact details and activity.
            </p>
          </div>

          {/* STATS */}
          <div className="bg-white border border-[#E9E4DA] rounded-2xl px-6 py-4 flex gap-8 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Total Users
              </p>
              <p className="text-2xl font-semibold text-[#2E2E2E]">
                {users.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Active Users
              </p>
              <p className="text-2xl font-semibold text-[#2E2E2E]">
                {users.filter((u) => u.is_active).length}
              </p>
            </div>
          </div>
        </div>

        {/* ================= USERS TABLE ================= */}
        <div className="bg-white border border-[#E9E4DA] rounded-3xl shadow-sm overflow-hidden">
          {/* TABLE HEADER */}
          <div className="px-8 py-6 border-b border-[#E9E4DA] flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-[#2E2E2E]">
                All Users
              </h2>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Complete list of registered customers
              </p>
            </div>

            <button
              onClick={refetch}
              className="text-sm text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-sm text-[#6B6B6B]">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="py-20 text-center text-sm text-[#6B6B6B]">
                No users found
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-[#FAF9F7] border-b border-[#E9E4DA]">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-[#6B6B6B]">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right font-medium text-[#6B6B6B]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#E9E4DA] hover:bg-[#FAF9F7]"
                    >
                      <td className="px-6 py-5 font-medium text-[#2E2E2E]">
                        #{user.id}
                      </td>

                      <td className="px-6 py-5 font-medium text-[#2E2E2E]">
                        {user.name || "—"}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#2E2E2E]">
                        {user.email}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#2E2E2E]">
                        {user.phone || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-[#2E2E2E]">
                        {user.orders_count ?? 0}
                      </td>

                      <td className="px-6 py-5 text-xs text-[#6B6B6B]">
                        {user.created_at}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={deleting}
                          className="text-xs text-red-500 hover:underline disabled:opacity-50"
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

          {/* FOOTER */}
          {users.length > 0 && (
            <div className="px-8 py-4 border-t border-[#E9E4DA] bg-[#FAF9F7] text-sm text-[#6B6B6B]">
              Showing{" "}
              <span className="font-medium">
                {users.length}
              </span>{" "}
              users
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
