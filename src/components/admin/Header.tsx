export default function Header() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-5">
      <div>
        <h2 className="text-3xl font-black text-slate-800">
          Admin Dashboard
        </h2>

        <p className="text-slate-500">
          Manage the GOTECH Weekly Football Contest
        </p>
      </div>

      <div className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white">
        Administrator
      </div>
    </header>
  );
}