import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Search, X } from "lucide-react";

type Store = {
  id: string;
  name: string;
  logo: string;
  image: string;
  washers: number;
  dryers: number;
  max_kg: number;
  price: number;
  lat: number;
  lng: number;
  is_combo: boolean;
  province: string;
  district: string;
  created_at: string;
};

const ManageStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvince, setFilterProvince] = useState("all");
  const { toast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    image: "",
    washers: 0,
    dryers: 0,
    max_kg: 0,
    price: 0,
    lat: 15.115,
    lng: 104.33,
    is_combo: false,
    province: "sisaket",
    district: ""
  });

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStores(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching stores",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleOpenModal = (storeItem?: Store) => {
    if (storeItem) {
      setEditingId(storeItem.id);
      setFormData({
        name: storeItem.name,
        logo: storeItem.logo || "",
        image: storeItem.image || "",
        washers: storeItem.washers,
        dryers: storeItem.dryers,
        max_kg: storeItem.max_kg,
        price: storeItem.price,
        lat: storeItem.lat,
        lng: storeItem.lng,
        is_combo: storeItem.is_combo,
        province: storeItem.province,
        district: storeItem.district || ""
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        logo: "",
        image: "",
        washers: 0,
        dryers: 0,
        max_kg: 0,
        price: 0,
        lat: 15.115,
        lng: 104.33,
        is_combo: false,
        province: "sisaket",
        district: ""
      });
    }
    setLogoFile(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalLogoUrl = formData.logo;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${Math.random()}.${fileExt}`;
        const filePath = `stores/${fileName}`;
        const { error } = await supabase.storage.from('public-images').upload(filePath, logoFile);
        if (error) throw error;
        const { data } = supabase.storage.from('public-images').getPublicUrl(filePath);
        finalLogoUrl = data.publicUrl;
      }

      let finalImageUrl = formData.image;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `store-${Math.random()}.${fileExt}`;
        const filePath = `stores/${fileName}`;
        const { error } = await supabase.storage.from('public-images').upload(filePath, imageFile);
        if (error) throw error;
        const { data } = supabase.storage.from('public-images').getPublicUrl(filePath);
        finalImageUrl = data.publicUrl;
      }

      const finalFormData = { ...formData, logo: finalLogoUrl, image: finalImageUrl };

      if (editingId) {
        const { error } = await supabase
          .from('stores')
          .update(finalFormData)
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: "อัปเดตสาขาสำเร็จ" });
      } else {
        const { error } = await supabase
          .from('stores')
          .insert([finalFormData]);
        if (error) throw error;
        toast({ title: "เพิ่มสาขาสำเร็จ" });
      }
      
      setIsModalOpen(false);
      fetchStores();
    } catch (error: any) {
      toast({
        title: "Error saving store",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบสาขานี้?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "ลบสาขาสำเร็จ" });
      fetchStores();
    } catch (error: any) {
      toast({
        title: "Error deleting store",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = filterProvince === "all" || s.province === filterProvince;
    return matchesSearch && matchesProvince;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการร้านซักผ้า</h1>
          <p className="text-slate-500">เพิ่ม ลบ แก้ไข สาขาร้านซักผ้าในแผนที่</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] text-slate-700 font-medium cursor-pointer"
            >
              <option value="all">ทุกจังหวัด</option>
              <option value="sisaket">ศรีสะเกษ</option>
              <option value="ubon">อุบลราชธานี</option>
            </select>
          </div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสาขา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500]"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#ff2500] hover:bg-[#d62000] text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/20 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> เพิ่มสาขาใหม่
          </button>
        </div>
      </div>

      {loading && !isModalOpen ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff2500]" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-4">โลโก้</th>
                  <th className="px-6 py-4">ชื่อสาขา</th>
                  <th className="px-6 py-4">จังหวัด/อำเภอ</th>
                  <th className="px-6 py-4">เครื่องซัก/อบ</th>
                  <th className="px-6 py-4">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      ไม่พบข้อมูลสาขา
                    </td>
                  </tr>
                ) : (
                  filteredStores.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        {item.logo ? (
                          <img src={item.logo} alt={item.name} className="w-10 h-10 object-contain bg-white rounded-lg border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">No Img</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="text-slate-500 text-xs mt-1">เริ่มต้น {item.price} บาท | สูงสุด {item.max_kg} กก.</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700">{item.province === 'sisaket' ? 'ศรีสะเกษ' : 'อุบลราชธานี'}</div>
                        <div className="text-slate-500 text-xs mt-1">{item.district === 'mueang' ? 'เมือง' : item.district === 'warin' ? 'วารินชำราบ' : ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">ซัก {item.washers}</span>
                          <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-bold border border-orange-100">อบ {item.dryers}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleOpenModal(item)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "แก้ไขสาขา" : "เพิ่มสาขาใหม่"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">ชื่อสาขา</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">จังหวัด</label>
                  <select 
                    value={formData.province}
                    onChange={e => setFormData({...formData, province: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none bg-white"
                  >
                    <option value="sisaket">ศรีสะเกษ</option>
                    <option value="ubon">อุบลราชธานี</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">อำเภอ (ถ้ามี)</label>
                  <select 
                    value={formData.district}
                    onChange={e => setFormData({...formData, district: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none bg-white"
                  >
                    <option value="">- ไม่ระบุ -</option>
                    <option value="mueang">เมือง</option>
                    <option value="warin">วารินชำราบ</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">ละติจูด (Lat)</label>
                  <input 
                    type="number" step="any" required
                    value={formData.lat}
                    onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">ลองจิจูด (Lng)</label>
                  <input 
                    type="number" step="any" required
                    value={formData.lng}
                    onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">จำนวนเครื่องซัก</label>
                    <input 
                      type="number" 
                      value={formData.washers}
                      onChange={e => setFormData({...formData, washers: parseInt(e.target.value)})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">จำนวนเครื่องอบ</label>
                    <input 
                      type="number" 
                      value={formData.dryers}
                      onChange={e => setFormData({...formData, dryers: parseInt(e.target.value)})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">ความจุสูงสุด (กก.)</label>
                    <input 
                      type="number" 
                      value={formData.max_kg}
                      onChange={e => setFormData({...formData, max_kg: parseInt(e.target.value)})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">ราคาเริ่มต้น</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">โลโก้แบรนด์ (เลือกไฟล์ หรือ ใส่ URL)</label>
                  <input 
                    type="file" accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setLogoFile(e.target.files[0]);
                        setFormData({...formData, logo: ""});
                      }
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff2500] hover:file:bg-orange-100"
                  />
                  <input 
                    type="url" placeholder="หรือใส่ URL โลโก้..."
                    value={formData.logo}
                    onChange={e => {
                      setFormData({...formData, logo: e.target.value});
                      setLogoFile(null);
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none mt-2"
                  />
                  {(logoFile || formData.logo) && (
                    <img src={logoFile ? URL.createObjectURL(logoFile) : formData.logo} alt="Logo Preview" className="mt-2 h-16 object-contain" />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">รูปภาพหน้าร้าน (เลือกไฟล์ หรือ ใส่ URL)</label>
                  <input 
                    type="file" accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setFormData({...formData, image: ""});
                      }
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff2500] hover:file:bg-orange-100"
                  />
                  <input 
                    type="url" placeholder="หรือใส่ URL รูปหน้าร้าน..."
                    value={formData.image}
                    onChange={e => {
                      setFormData({...formData, image: e.target.value});
                      setImageFile(null);
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none mt-2"
                  />
                  {(imageFile || formData.image) && (
                    <img src={imageFile ? URL.createObjectURL(imageFile) : formData.image} alt="Store Preview" className="mt-2 h-24 object-cover rounded-lg border border-slate-200" />
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#ff2500] hover:bg-[#d62000] text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStores;
