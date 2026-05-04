import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { Loader2, Search, ExternalLink, Image as ImageIcon, Edit2, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

type Claim = {
  id: string;
  ticket_id: string;
  status: string;
  name: string;
  phone: string;
  problem: string;
  branch: string;
  created_at: string;
  image_urls: string[];
};

const ManageClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal State
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { toast } = useToast();

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching claims",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();

    // Set up real-time subscription
    const subscription = supabase
      .channel('claims_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, () => {
        fetchClaims();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openUpdateModal = (claim: Claim) => {
    setSelectedClaim(claim);
    setNewStatus(claim.status);
    setCustomMessage(""); // Reset message
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim) return;
    
    // Validation
    if (newStatus === "ปฏิเสธ" && !customMessage.trim()) {
      toast({
        title: "กรุณาระบุเหตุผล",
        description: "จำเป็นต้องระบุเหตุผลเมื่อปฏิเสธการเคลม",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === "กำลังดำเนินการ") {
        updateData.custom_estimate = customMessage.trim() || null;
        updateData.rejection_reason = null;
      } else if (newStatus === "ปฏิเสธ") {
        updateData.rejection_reason = customMessage.trim();
        updateData.custom_estimate = null;
      } else {
        updateData.custom_estimate = null;
        updateData.rejection_reason = null;
      }

      const { error } = await supabase
        .from('claims')
        .update(updateData)
        .eq('id', selectedClaim.id);

      if (error) throw error;

      // 📲 แจ้งเตือนลูกค้าผ่าน LINE (ถ้าลูกค้าลงทะเบียนไว้)
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "notify_customer",
            ticketId: selectedClaim.ticket_id,
            newStatus: newStatus,
            message: customMessage.trim() || null,
          }),
        });
      } catch (lineError) {
        console.log("LINE notification attempted", lineError);
      }
      
      toast({
        title: "อัปเดตสถานะสำเร็จ",
        description: `เปลี่ยนสถานะเป็น "${newStatus}" แล้ว`,
      });
      setIsModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredClaims = claims.filter(c => {
    const matchesSearch = c.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.phone.includes(searchTerm);
                          
    if (statusFilter === "ทั้งหมด") return matchesSearch;
    if (statusFilter === "รอดำเนินการ") return matchesSearch && ["รับเรื่องแล้ว", "กำลังตรวจสอบ", "กำลังดำเนินการ"].includes(c.status);
    if (statusFilter === "สำเร็จแล้ว") return matchesSearch && c.status === "สำเร็จ";
    if (statusFilter === "ถูกปฏิเสธ") return matchesSearch && c.status === "ปฏิเสธ";
    if (statusFilter === "ลูกค้ายกเลิก") return matchesSearch && c.status === "ยกเลิก";
    
    return matchesSearch;
  });

  // Pagination Logic
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when searching or filtering
  }, [searchTerm, statusFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClaims = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    if (status.includes('สำเร็จ')) return 'bg-green-100 text-green-700 border-green-200';
    if (status.includes('ปฏิเสธ') || status.includes('ยกเลิก')) return 'bg-red-100 text-red-700 border-red-200';
    if (status.includes('กำลังดำเนินการ')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (status.includes('ตรวจสอบ')) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff2500]" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการรายการเคลม</h1>
          <p className="text-slate-500">ตรวจสอบและอัปเดตสถานะการแจ้งเคลมทั้งหมด</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Quick Filters */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl overflow-x-auto w-full sm:w-auto">
            {["ทั้งหมด", "รอดำเนินการ", "สำเร็จแล้ว", "ถูกปฏิเสธ", "ลูกค้ายกเลิก"].map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  statusFilter === filter 
                    ? 'bg-white text-[#ff2500] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหา Ticket, ชื่อ, เบอร์โทร..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Ticket / วันที่</th>
                <th className="px-6 py-4">ข้อมูลลูกค้า</th>
                <th className="px-6 py-4">ปัญหา / สาขา</th>
                <th className="px-6 py-4">หลักฐาน</th>
                <th className="px-6 py-4">สถานะปัจจุบัน</th>
                <th className="px-6 py-4">อัปเดตสถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentClaims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    ไม่พบข้อมูลการเคลม
                  </td>
                </tr>
              ) : (
                currentClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-[#ff2500]">{claim.ticket_id}</div>
                      <div className="text-slate-500 text-xs mt-1">
                        {new Date(claim.created_at).toLocaleString('th-TH')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{claim.name}</div>
                      <div className="text-slate-500">{claim.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{claim.problem}</div>
                      <div className="text-slate-500 text-xs mt-1 truncate max-w-[150px]">{claim.branch}</div>
                    </td>
                    <td className="px-6 py-4">
                      {claim.image_urls && claim.image_urls.length > 0 ? (
                        <div className="flex -space-x-2">
                          {claim.image_urls.map((url, i) => (
                            <a 
                              key={i} 
                              href={url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="w-8 h-8 rounded-lg bg-slate-200 border-2 border-white overflow-hidden hover:z-10 hover:scale-110 transition-transform flex items-center justify-center relative group"
                            >
                              <img src={url} className="w-full h-full object-cover" alt="หลักฐาน" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ExternalLink className="w-4 h-4 text-white" />
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" /> ไม่มีรูป
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openUpdateModal(claim)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-[#ff2500] hover:border-[#ff2500]/30 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                        อัปเดต
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <span className="text-sm text-slate-500 font-medium">
              แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, filteredClaims.length)} จากทั้งหมด {filteredClaims.length} รายการ
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 text-sm font-medium transition-colors"
              >
                ก่อนหน้า
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => {
                  // Show limited page numbers if there are many pages (e.g., more than 5)
                  if (totalPages > 5) {
                    if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage)) {
                      return (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                            currentPage === i + 1 
                              ? 'bg-[#ff2500] text-white shadow-md shadow-orange-500/30' 
                              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    }
                    if (i === 1 && currentPage > 3) return <span key={i} className="px-1 text-slate-400">...</span>;
                    if (i === totalPages - 2 && currentPage < totalPages - 2) return <span key={i} className="px-1 text-slate-400">...</span>;
                    return null;
                  }
                  
                  return (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                        currentPage === i + 1 
                          ? 'bg-[#ff2500] text-white shadow-md shadow-orange-500/30' 
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 text-sm font-medium transition-colors"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
      
      {/* Update Status Modal */}
      <AnimatePresence>
        {isModalOpen && selectedClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUpdating && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden z-10"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">
                  อัปเดตสถานะการเคลม
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUpdating}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Ticket ID</p>
                  <p className="font-mono font-bold text-lg text-[#ff2500]">{selectedClaim.ticket_id}</p>
                  <div className="mt-2 text-sm text-slate-700">
                    <span className="font-medium">ปัญหา:</span> {selectedClaim.problem}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">
                    เปลี่ยนสถานะเป็น
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] transition-colors appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                  >
                    <option value="รับเรื่องแล้ว">รับเรื่องแล้ว</option>
                    <option value="กำลังตรวจสอบ">กำลังตรวจสอบ</option>
                    <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                    <option value="สำเร็จ">สำเร็จ</option>
                    <option value="ปฏิเสธ">ปฏิเสธ / ยกเลิก</option>
                  </select>
                </div>

                <AnimatePresence mode="popLayout">
                  {newStatus === "กำลังดำเนินการ" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                        ข้อความถึงลูกค้า <span className="text-xs text-slate-400 font-normal">(ไม่บังคับ)</span>
                      </label>
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="เช่น กำลังสั่งอะไหล่ คาดว่าจะเสร็จภายใน 3 วัน..."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none h-24 text-sm"
                      />
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> ข้อความนี้จะแสดงในหน้า Track Status ของลูกค้า
                      </p>
                    </motion.div>
                  )}

                  {newStatus === "ปฏิเสธ" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-red-700 flex items-center gap-2">
                        เหตุผลที่ปฏิเสธ <span className="text-xs text-red-500 font-bold">*จำเป็น</span>
                      </label>
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="เช่น ไม่อยู่ในเงื่อนไขการรับประกันเนื่องจาก..."
                        required
                        className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors resize-none h-24 text-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating || (newStatus === "ปฏิเสธ" && !customMessage.trim())}
                    className="flex-1 px-4 py-2.5 bg-[#ff2500] text-white rounded-xl font-medium hover:bg-[#d62000] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "บันทึกการเปลี่ยนแปลง"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManageClaims;
