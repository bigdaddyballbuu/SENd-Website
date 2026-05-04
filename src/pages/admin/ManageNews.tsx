import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Search, X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type News = {
  id: string;
  title: string;
  description: string;
  type: string;
  active: boolean;
  image_url: string;
  code: string;
  created_at: string;
};

const ManageNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "notice",
    active: true,
    image_url: "",
    code: ""
  });

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching news",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenModal = (newsItem?: News) => {
    if (newsItem) {
      setEditingId(newsItem.id);
      setFormData({
        title: newsItem.title,
        description: newsItem.description,
        type: newsItem.type,
        active: newsItem.active,
        image_url: newsItem.image_url || "",
        code: newsItem.code || ""
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        type: "notice",
        active: true,
        image_url: "",
        code: ""
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('public-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('public-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const finalFormData = { ...formData, image_url: finalImageUrl };

      if (editingId) {
        const { error } = await supabase
          .from('news')
          .update(finalFormData)
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: "อัปเดตข่าวสารสำเร็จ" });
      } else {
        const { error } = await supabase
          .from('news')
          .insert([finalFormData]);
        if (error) throw error;
        toast({ title: "เพิ่มข่าวสารสำเร็จ" });
      }
      
      setIsModalOpen(false);
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Error saving news",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบข่าวสารนี้?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "ลบข่าวสารสำเร็จ" });
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Error deleting news",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการข่าวสาร</h1>
          <p className="text-slate-500">จัดการประกาศ, โปรโมชัน, และข่าวสารต่างๆ</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาหัวข้อ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500]"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#ff2500] hover:bg-[#d62000] text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/20 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> สร้างข่าวใหม่
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
                  <th className="px-6 py-4">รูปภาพ</th>
                  <th className="px-6 py-4">หัวข้อ</th>
                  <th className="px-6 py-4">ประเภท</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredNews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      ไม่พบข้อมูลข่าวสาร
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-16 h-12 object-cover rounded-lg border border-slate-200" />
                        ) : (
                          <div className="w-16 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">No Img</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{item.title}</div>
                        <div className="text-slate-500 text-xs mt-1 truncate max-w-xs">{item.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.type === 'promo' ? 'bg-[#ff2500]/10 text-[#ff2500]' :
                          item.type === 'urgent' ? 'bg-red-100 text-red-700' :
                          item.type === 'system' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {item.active ? 'แสดงผล' : 'ซ่อน'}
                        </span>
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
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "แก้ไขข่าวสาร" : "สร้างข่าวสารใหม่"}
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
                  <label className="text-sm font-medium text-slate-700">หัวข้อ (Title)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">รายละเอียด (Description)</label>
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-[#ff2500]/20 focus-within:border-[#ff2500]">
                    <ReactQuill 
                      theme="snow"
                      value={formData.description}
                      onChange={(content) => setFormData({...formData, description: content})}
                      modules={quillModules}
                      className="h-64 mb-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">ประเภท (Type)</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none bg-white"
                  >
                    <option value="notice">ข่าวทั่วไป (Notice)</option>
                    <option value="promo">โปรโมชัน (Promo)</option>
                    <option value="system">อัปเดตระบบ (System)</option>
                    <option value="urgent">ประกาศด่วน (Urgent)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">โค้ดส่วนลด (Code - ใส่เฉพาะโปรโมชัน)</label>
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">รูปภาพ (เลือกไฟล์จากเครื่อง หรือ ใส่ลิงก์ URL)</label>
                  
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setFormData({...formData, image_url: ""}); // clear url if file selected
                      }
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff2500] hover:file:bg-orange-100"
                  />

                  <div className="text-center text-slate-400 text-sm py-1">หรือ</div>

                  <input 
                    type="url" 
                    placeholder="วางลิงก์รูปภาพที่นี่..."
                    value={formData.image_url}
                    onChange={e => {
                      setFormData({...formData, image_url: e.target.value});
                      setImageFile(null); // clear file if url pasted
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none"
                  />

                  {(imageFile || formData.image_url) && (
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} 
                      alt="Preview" 
                      className="mt-2 h-32 rounded-lg object-cover border border-slate-200" 
                    />
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.active}
                      onChange={e => setFormData({...formData, active: e.target.checked})}
                      className="w-5 h-5 text-[#ff2500] rounded focus:ring-[#ff2500]"
                    />
                    <span className="font-medium text-slate-700">เปิดใช้งาน (แสดงผลในหน้าเว็บ)</span>
                  </label>
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

export default ManageNews;
