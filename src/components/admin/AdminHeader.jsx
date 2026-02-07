export default function AdminHeader() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <div>
        <button onClick={() => localStorage.removeItem("token")}>Logout</button>
      </div>
    </header>
  );
}
