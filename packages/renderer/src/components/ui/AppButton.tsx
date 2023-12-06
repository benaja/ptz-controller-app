export default function AppButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded">
      {children}
    </button>
  );
}
