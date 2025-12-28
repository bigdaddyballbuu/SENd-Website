// src/components/StoreFilter.tsx
type Props = {
  selectedKg: number | null;
  setSelectedKg: (v: number | null) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
};

const StoreFilter = ({
  selectedKg,
  setSelectedKg,
  maxPrice,
  setMaxPrice,
}: Props) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow mb-10">
      <h3 className="font-semibold mb-4">🔍 ค้นหาร้าน</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* KG */}
        <div>
          <label className="block text-sm font-medium mb-2">
            ขนาดเครื่อง (KG)
          </label>
          <select
            className="w-full border rounded-lg px-4 py-2"
            value={selectedKg ?? ""}
            onChange={(e) =>
              setSelectedKg(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">ทั้งหมด</option>
            {[9, 10, 14, 15, 18, 20, 27, 28, 35].map((kg) => (
              <option key={kg} value={kg}>
                {kg} KG
              </option>
            ))}
          </select>
        </div>

        {/* PRICE */}
        <div>
          <label className="block text-sm font-medium mb-2">
            ราคาไม่เกิน (บาท)
          </label>
          <input
            type="range"
            min={30}
            max={60}
            step={5}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm mt-1 text-gray-600">
            ไม่เกิน {maxPrice} บาท
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreFilter;
