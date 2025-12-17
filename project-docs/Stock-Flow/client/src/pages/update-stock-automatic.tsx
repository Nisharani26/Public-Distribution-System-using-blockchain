import Layout from "@/components/layout";

export default function UpdateStockAutomatic() {
  return (
    <Layout 
      title="ऑटोमैटिक अपडेट" 
      subtitle="Automatic Stock Update"
      showBack
      backTo="/update-stock-mode"
    >
      {/* Intentionally left blank as per requirement */}
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 italic">
        Automatic Update Page (Blank)
      </div>
    </Layout>
  );
}
