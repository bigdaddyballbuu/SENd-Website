import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquareWarning, 
  CheckCircle2, 
  Store, 
  Clock,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface DashboardMetrics {
  totalClaims: number;
  pendingClaims: number;
  completedThisMonth: number;
  totalStores: number;
}

interface Claim {
  id: number;
  ticket_id: string;
  name: string;
  problem: string;
  status: string;
  created_at: string;
  branch: string;
}

const COLORS = ['#ff2500', '#00C49F', '#FFBB28', '#0088FE', '#8884d8', '#FF8042'];

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClaims: 0,
    pendingClaims: 0,
    completedThisMonth: 0,
    totalStores: 0
  });
  const [recentClaims, setRecentClaims] = useState<Claim[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [problemData, setProblemData] = useState<any[]>([]);
  const [branchData, setBranchData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Total Claims
      const { count: totalClaims } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true });

      // 2. Pending Claims
      const { count: pendingClaims } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true })
        .in('status', ['รับเรื่องแล้ว', 'กำลังตรวจสอบ', 'กำลังดำเนินการ']);

      // 3. Completed This Month
      const date = new Date();
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
      const { count: completedThisMonth } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'สำเร็จ')
        .gte('created_at', firstDayOfMonth);

      // 4. Total Stores
      const { count: totalStores } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true });

      // 5. Recent Claims
      const { data: recent } = await supabase
        .from('claims')
        .select('id, ticket_id, name, problem, status, created_at, branch')
        .order('created_at', { ascending: false })
        .limit(5);

      setMetrics({
        totalClaims: totalClaims || 0,
        pendingClaims: pendingClaims || 0,
        completedThisMonth: completedThisMonth || 0,
        totalStores: totalStores || 0
      });
      
      if (recent) setRecentClaims(recent);

      // 6. Fetch all claims for charts
      const { data: allClaims } = await supabase
        .from('claims')
        .select('created_at, problem, branch, status')
        .order('created_at', { ascending: true }); // Ascending for chronological order

      if (allClaims) {
        // --- Process Monthly Data ---
        const monthlyCount: Record<string, number> = {};
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        
        allClaims.forEach(c => {
          const d = new Date(c.created_at);
          const monthStr = `${months[d.getMonth()]} ${d.getFullYear() % 100 + 43}`; // e.g., ม.ค. 69
          monthlyCount[monthStr] = (monthlyCount[monthStr] || 0) + 1;
        });
        
        // Convert to array and take last 6 months
        const mData = Object.keys(monthlyCount).map(k => ({ name: k, เคลม: monthlyCount[k] }));
        setMonthlyData(mData.slice(-6));

        // --- Process Problem Data ---
        const probCount: Record<string, number> = {};
        allClaims.forEach(c => {
          const p = c.problem || 'อื่นๆ';
          probCount[p] = (probCount[p] || 0) + 1;
        });
        const pData = Object.keys(probCount)
          .map(k => ({ name: k, value: probCount[k] }))
          .sort((a, b) => b.value - a.value);
        setProblemData(pData);

        // --- Process Branch Data ---
        const branchCount: Record<string, number> = {};
        allClaims.forEach(c => {
          const b = c.branch || 'ไม่ระบุ';
          branchCount[b] = (branchCount[b] || 0) + 1;
        });
        const bData = Object.keys(branchCount)
          .map(k => ({ name: k, เคลม: branchCount[k] }))
          .sort((a, b) => b.เคลม - a.เคลม)
          .slice(0, 5); // Top 5 branches
        setBranchData(bData);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'สำเร็จ': return 'bg-green-100 text-green-700 border-green-200';
      case 'ปฏิเสธ': return 'bg-red-100 text-red-700 border-red-200';
      case 'รับเรื่องแล้ว': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ยกเลิก': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200'; // กำลังตรวจสอบ, กำลังดำเนินการ
    }
  };

  const cards = [
    {
      title: "งานเคลมค้างอยู่",
      value: metrics.pendingClaims,
      icon: Clock,
      color: "from-orange-500 to-[#ff2500]",
      shadow: "shadow-orange-500/20",
      alert: metrics.pendingClaims > 0
    },
    {
      title: "เคลมสำเร็จ (เดือนนี้)",
      value: metrics.completedThisMonth,
      icon: CheckCircle2,
      color: "from-emerald-400 to-emerald-600",
      shadow: "shadow-emerald-500/20"
    },
    {
      title: "เคลมทั้งหมด",
      value: metrics.totalClaims,
      icon: MessageSquareWarning,
      color: "from-blue-400 to-blue-600",
      shadow: "shadow-blue-500/20"
    },
    {
      title: "สาขาทั้งหมด",
      value: metrics.totalStores,
      icon: Store,
      color: "from-violet-400 to-violet-600",
      shadow: "shadow-violet-500/20"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff2500]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-[#ff2500]" />
            ภาพรวมระบบ (Dashboard)
          </h1>
          <p className="text-slate-500 mt-1">สรุปข้อมูลสถิติและการทำงานของระบบ SENd</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white rounded-2xl p-6 shadow-xl border border-slate-100 relative overflow-hidden group`}
          >
            {/* Background Decoration */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out`} />
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                  {card.title}
                  {card.alert && <AlertCircle className="w-4 h-4 text-[#ff2500] animate-pulse" />}
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                  {card.value.toLocaleString()}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.shadow}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-slate-900">สถิติการแจ้งเคลม (ย้อนหลัง 6 เดือน)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="เคลม" fill="#ff2500" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Problem Breakdown Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-900">สัดส่วนปัญหาที่พบบ่อย</h2>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            {problemData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={problemData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {problemData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-sm">ยังไม่มีข้อมูล</div>
            )}
          </div>
        </motion.div>

      </div>

      {/* Top Branches and Recent Claims Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Branches Chart/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <Store className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-slate-900">5 สาขาที่เคลมเยอะสุด</h2>
          </div>
          <div className="space-y-4">
            {branchData.length > 0 ? branchData.map((branch, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                    {idx + 1}
                  </div>
                  <span className="text-slate-700 font-medium truncate max-w-[150px]">{branch.name}</span>
                </div>
                <div className="font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">
                  {branch.เคลม} รายการ
                </div>
              </div>
            )) : (
              <div className="text-center text-slate-400 text-sm py-10">ยังไม่มีข้อมูล</div>
            )}
          </div>
        </motion.div>

        {/* Recent Claims Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#ff2500]" />
              งานเคลมล่าสุด
            </h2>
            <Link 
              to="/admin/claims" 
              className="text-sm font-medium text-[#ff2500] hover:text-[#d62000] flex items-center gap-1 transition-colors bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg"
            >
              ดูทั้งหมด <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-sm font-medium border-b border-slate-100">
                  <th className="p-4 pl-6 font-semibold">Ticket ID</th>
                  <th className="p-4 font-semibold">ลูกค้า</th>
                  <th className="p-4 font-semibold">ปัญหา</th>
                  <th className="p-4 font-semibold">สถานะ</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {recentClaims.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      ไม่มีข้อมูลงานเคลม
                    </td>
                  </tr>
                ) : (
                  recentClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 font-mono text-slate-600 font-medium">
                        {claim.ticket_id}
                      </td>
                      <td className="p-4 text-slate-900 font-medium">{claim.name}</td>
                      <td className="p-4 text-slate-600 max-w-[150px] truncate">{claim.problem}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;

