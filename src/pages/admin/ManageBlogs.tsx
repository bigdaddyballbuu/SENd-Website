import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Search, X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type Blog = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  read_time: string;
  active: boolean;
  created_at: string;
};

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image_url: "",
    read_time: "5 นาที",
    active: true
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

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching blogs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenModal = (blogItem?: Blog) => {
    if (blogItem) {
      setEditingId(blogItem.id);
      setFormData({
        title: blogItem.title,
        category: blogItem.category,
        excerpt: blogItem.excerpt || "",
        content: blogItem.content || "",
        image_url: blogItem.image_url || "",
        read_time: blogItem.read_time || "5 นาที",
        active: blogItem.active
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        category: "",
        excerpt: "",
        content: "",
        image_url: "",
        read_time: "5 นาที",
        active: true
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      let finalImageUrl = formData.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `blogs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('public-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('public-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        ...formData,
        image_url: finalImageUrl
      };

      if (editingId) {
        const { error } = await supabase
          .from('blogs')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: "อัปเดตบทความสำเร็จ" });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([payload]);
        if (error) throw error;
        toast({ title: "สร้างบทความสำเร็จ" });
      }

      handleCloseModal();
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Error saving blog",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?")) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "ลบบทความสำเร็จ" });
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Error deleting blog",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการบทความ (Blog)</h1>
          <p className="text-slate-500">จัดการบทความ สาระความรู้ต่างๆ</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาบทความ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500]"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#ff2500] hover:bg-[#d62000] text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/20 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> สร้างบทความใหม่
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
                  <th className="px-6 py-4">รูปปก</th>
                  <th className="px-6 py-4">หัวข้อ</th>
                  <th className="px-6 py-4">หมวดหมู่</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      ไม่พบบทความ
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-20 h-12 object-cover rounded-lg border border-slate-200" />
                        ) : (
                          <div className="w-20 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">No Img</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{item.title}</div>
                        <div className="text-slate-500 text-xs mt-1 truncate max-w-xs">{item.excerpt}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100">
                          {item.category}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? 'แก้ไขบทความ' : 'สร้างบทความใหม่'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">หัวข้อ (Title)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none"
                    placeholder="ใส่หัวข้อบทความ"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">หมวดหมู่ (Category)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none"
                    placeholder="เช่น ความรู้ทั่วไป, ซักผ้าเบื้องต้น"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">ระยะเวลาอ่าน (Read Time)</label>
                  <input 
                    type="text" 
                    value={formData.read_time}
                    onChange={e => setFormData({...formData, read_time: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none"
                    placeholder="เช่น 5 นาที"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">คำโปรย (Excerpt)</label>
                  <textarea 
                    rows={2}
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none resize-none"
                    placeholder="สรุปเนื้อหาสั้นๆ เพื่อโชว์ในหน้าแรก"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">เนื้อหาบทความ (Content)</label>
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-[#ff2500]/20 focus-within:border-[#ff2500]">
                    <ReactQuill 
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData({...formData, content: content})}
                      modules={quillModules}
                      className="h-[300px] mb-12"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">รูปปก (เลือกไฟล์จากเครื่อง หรือ ใส่ลิงก์ URL)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setFormData({...formData, image_url: ""});
                      }
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff2500] hover:file:bg-orange-100"
                  />
                  <div className="text-center text-slate-400 text-sm my-2">หรือ</div>
                  <input 
                    type="text" 
                    value={formData.image_url}
                    onChange={e => {
                      setFormData({...formData, image_url: e.target.value});
                      setImageFile(null);
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] outline-none"
                    placeholder="ใส่ลิงก์รูปภาพปกบทความ"
                  />
                  {(formData.image_url || imageFile) && (
                    <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                      {imageFile ? (
                        <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.active}
                      onChange={e => setFormData({...formData, active: e.target.checked})}
                      className="w-5 h-5 text-[#ff2500] rounded focus:ring-[#ff2500]"
                    />
                    <span className="font-medium text-slate-700">แสดงผลบนหน้าเว็บ (Active)</span>
                  </label>
                </div>

              </div>
              
              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#ff2500] hover:bg-[#d62000] text-white px-8 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'บันทึกการแก้ไข' : 'สร้างบทความ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
