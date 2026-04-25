// // Reports.jsx
// import { useContext, useEffect, useState } from 'react';
// import { AdminContext } from '../../Context/AdminContext';
// import AdminLayout from '../../Components/Admin Components/AdminLayout';
// import StatCard from '../../Components/Admin Components/StatCard';
// import { CalendarIcon, TrendingUpIcon } from 'lucide-react';
// import { LinearProgress } from '@mui/material';
// import Progress from '../../Components/Patient\'s Components/Progress';
// import Error from '../../Components/Patient\'s Components/Error';

// export default function Reports() {
//     const { fetchReports, reportsData, loading, error } = useContext(AdminContext);
//     const [Variant, setVariant] = useState("indeterminate");

//     useEffect(() => {
//         fetchReports(); // Fetch real data on mount
//         const timer = setTimeout(() => setVariant("determinate"), 1200);
//         return () => clearTimeout(timer);
//     }, []);

//     if (loading && Variant === "indeterminate") return <LinearProgress />;

//     return (
//         <AdminLayout>
//             {/* Overview Stats - Now using real data */}
//             {loading ? <Progress />
//                 : error ? <Error /> : <div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                         <StatCard
//                             title="Total Appointments"
//                             value={reportsData?.appointments.toLocaleString()}
//                             change={reportsData?.appointmentChange}
//                             changeType="positive"
//                             icon={<CalendarIcon className="text-[hsl(174,62%,40%)] w-6 h-6" />}
//                             iconBgClass="bg-[hsl(174,62%,40%)]/10"
//                         />
//                         <StatCard
//                             title="Total Revenue"
//                             value={`$${reportsData?.revenue.toLocaleString()}`}
//                             change={reportsData?.revenueChange}
//                             changeType="positive"
//                             icon={<TrendingUpIcon className="text-[hsl(199,89%,48%)] w-6 h-6" />}
//                             iconBgClass="bg-[hsl(199,89%,48%)]/10"
//                         />
//                         {/* ... Repeat for other StatCards */}
//                     </div>

//                     {/* Charts Row - Mapping dynamic monthly data */}
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                         <div className="bg-white rounded-xl border p-6">
//                             <h2 className="text-lg font-semibold mb-6">Monthly Trends</h2>
//                             <div className="space-y-4">
//                                 {reportsData?.monthlyTrends.map((data) => (
//                                     <div key={data?.month} className="flex items-center gap-4">
//                                         <span className="w-12 text-sm">{data.month}</span>
//                                         <div className="flex-1">
//                                             <div className="flex justify-between text-xs mb-1">
//                                                 <span>Appointments</span>
//                                                 <span>{data?.count}</span>
//                                             </div>
//                                             <LinearProgress
//                                                 variant={Variant}
//                                                 value={(data?.count / 500) * 100}
//                                             />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>}
//         </AdminLayout>
//     );
// }


import { useContext, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../Components/Admin Components/AdminLayout';
import StatCard from '../../Components/Admin Components/StatCard';
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    CalendarMonth as CalendarIcon,
    Assessment as AssessmentIcon,
    LocalHospital as HospitalIcon,
    Medication as MedicationIcon,
} from '@mui/icons-material';
import { LinearProgress } from '@mui/material';
import { AdminContext } from '../../Context/AdminContext';

const monthlyData = [
    { month: 'Jan', appointments: 320, patients: 145, revenue: 28500 },
    { month: 'Feb', appointments: 380, patients: 168, revenue: 32100 },
    { month: 'Mar', appointments: 420, patients: 192, revenue: 38200 },
    { month: 'Apr', appointments: 390, patients: 175, revenue: 35800 },
    { month: 'May', appointments: 450, patients: 210, revenue: 42500 },
    { month: 'Jun', appointments: 480, patients: 225, revenue: 45200 },
];

const topDoctors = [
    { name: 'Dr. Sarah Wilson', specialization: 'Cardiology', patients: 89, rating: 4.9 },
    { name: 'Dr. James Lee', specialization: 'Neurology', patients: 76, rating: 4.8 },
    { name: 'Dr. Emily Chen', specialization: 'Pediatrics', patients: 72, rating: 4.9 },
    { name: 'Dr. Michael Brown', specialization: 'Orthopedics', patients: 65, rating: 4.7 },
];

const topMedications = [
    { name: 'Amoxicillin 500mg', orders: 234, percentage: 85 },
    { name: 'Ibuprofen 200mg', orders: 198, percentage: 72 },
    { name: 'Metformin 850mg', orders: 156, percentage: 57 },
    { name: 'Lisinopril 10mg', orders: 134, percentage: 49 },
    { name: 'Omeprazole 20mg', orders: 121, percentage: 44 },
];

export default function Reports() {
    const { fetchReports, reportsData, loading, error } = useContext(AdminContext);
    useEffect(() => { fetchReports() }, [])
    const [Variant, setVariant] = useState("indeterminate");

    useEffect(() => {
        const timer = setTimeout(() => {
            setVariant("determinate");
        }, 1200);
        return () => {
            clearTimeout(timer);
        };
    }, []);


    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[hsl(215,25%,15%)] mb-1 font-['Poppins']">
                    Reports & Analytics
                </h1>
                <p className="text-[hsl(215,15%,50%)]">
                    Monitor system performance and view comprehensive reports.
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Appointments"
                    value="2,440"
                    change="+18% this month"
                    changeType="positive"
                    icon={<CalendarIcon className="text-[hsl(174,62%,40%)] w-6 h-6" />}
                    iconBgClass="bg-[hsl(174,62%,40%)]/10"
                />
                <StatCard
                    title="New Patients"
                    value="1,115"
                    change="+12% this month"
                    changeType="positive"
                    icon={<PeopleIcon className="text-[hsl(142,71%,45%)] w-6 h-6" />}
                    iconBgClass="bg-[hsl(142,71%,45%)]/10"
                />
                <StatCard
                    title="Total Revenue"
                    value="$222,300"
                    change="+24% this month"
                    changeType="positive"
                    icon={<TrendingUpIcon className="text-[hsl(199,89%,48%)] w-6 h-6" />}
                    iconBgClass="bg-[hsl(199,89%,48%)]/10"
                />
                <StatCard
                    title="Prescriptions"
                    value="3,847"
                    change="+8% this month"
                    changeType="positive"
                    icon={<MedicationIcon className="text-[hsl(38,92%,50%)] w-6 h-6" />}
                    iconBgClass="bg-[hsl(38,92%,50%)]/10"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Monthly Trends */}
                <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] shadow-[0_4px_6px_-1px_hsl(215,25%,15%,0.1),0_2px_4px_-2px_hsl(215,25%,15%,0.1)] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold font-['Poppins'] text-[hsl(215,25%,15%)]">Monthly Trends</h2>
                        <AssessmentIcon className="text-[hsl(215,15%,50%)]" />
                    </div>
                    <div className="space-y-4">
                        {monthlyData.slice(-4).map((data) => (
                            <div key={data.month} className="flex items-center gap-4">
                                <span className="w-12 text-sm font-medium text-[hsl(215,25%,15%)]">{data.month}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-[hsl(215,15%,50%)]">Appointments</span>
                                        <span className="text-xs font-semibold text-[hsl(215,25%,15%)]">{data.appointments}</span>
                                    </div>
                                    <LinearProgress
                                        variant={Variant}
                                        value={(data.appointments / 500) * 100}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: 'hsl(215, 20%, 94%)', // Secondary
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 3,
                                                bgcolor: 'hsl(174, 62%, 40%)', // Primary
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Summary */}
                <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] shadow-[0_4px_6px_-1px_hsl(215,25%,15%,0.1),0_2px_4px_-2px_hsl(215,25%,15%,0.1)] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold font-['Poppins'] text-[hsl(215,25%,15%)]">Revenue by Month</h2>
                        <TrendingUpIcon className="text-[hsl(215,15%,50%)]" />
                    </div>
                    <div className="space-y-4">
                        {monthlyData.slice(-4).map((data) => (
                            <div key={data.month} className="flex items-center gap-4">
                                <span className="w-12 text-sm font-medium text-[hsl(215,25%,15%)]">{data.month}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-[hsl(215,15%,50%)]">Revenue</span>
                                        <span className="text-xs font-semibold text-[hsl(215,25%,15%)]">${data.revenue.toLocaleString()}</span>
                                    </div>
                                    <LinearProgress
                                        variant={Variant}
                                        value={(data.revenue / 50000) * 100}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: 'hsl(215, 20%, 94%)', // Secondary
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 3,
                                                bgcolor: 'hsl(142, 71%, 45%)', // Success
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Doctors */}
                <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] shadow-[0_4px_6px_-1px_hsl(215,25%,15%,0.1),0_2px_4px_-2px_hsl(215,25%,15%,0.1)] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold font-['Poppins'] text-[hsl(215,25%,15%)]">Top Performing Doctors</h2>
                        <HospitalIcon className="text-[hsl(215,15%,50%)]" />
                    </div>
                    <div className="space-y-4">
                        {topDoctors.map((doctor, index) => (
                            <div key={doctor.name} className="!mb-0 flex items-center gap-4 p-0 rounded-lg hover:bg-[hsl(215,20%,94%)]/50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[hsl(174,62%,40%)]/10 flex items-center justify-center font-bold text-[hsl(174,62%,40%)]">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="!m-0 font-medium text-[hsl(215,25%,15%)]">{doctor.name}</p>
                                    <p className="!m-0 text-sm text-[hsl(215,15%,50%)]">{doctor.specialization}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-[hsl(215,25%,15%)]">{doctor.patients} patients</p>
                                    <p className="text-sm text-[hsl(38,92%,50%)]">★ {doctor.rating}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Medications */}
                <div className="!pb-0 bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] shadow-[0_4px_6px_-1px_hsl(215,25%,15%,0.1),0_2px_4px_-2px_hsl(215,25%,15%,0.1)] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold font-['Poppins'] text-[hsl(215,25%,15%)]">Most Ordered Medications</h2>
                        <MedicationIcon className="text-[hsl(215,15%,50%)]" />
                    </div>
                    <div className="space-y-4">
                        {topMedications.map((med) => (
                            <div key={med.name}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[hsl(215,25%,15%)]">{med.name}</span>
                                    <span className="text-sm text-[hsl(215,15%,50%)]">{med.orders} orders</span>
                                </div>
                                <LinearProgress
                                    variant={Variant}
                                    value={med.percentage}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'hsl(215, 20%, 94%)', // Secondary
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            bgcolor: 'hsl(38, 92%, 50%)', // Warning
                                        },
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout >
    );
}