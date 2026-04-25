import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    AdminPanelSettings as AdminIcon,
    Medication as MedicationIcon,
    Science as LabIcon,
    Assessment as ReportsIcon,
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    LocalHospital as HospitalIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/admin/users', label: 'User Management', icon: <PeopleIcon /> },
    { path: '/admin/Management', label: 'Admin Management', icon: <AdminIcon /> },
    { path: '/admin/medications', label: 'Medications', icon: <MedicationIcon /> },
    { path: '/admin/labExaminations', label: 'Lab Examinations', icon: <LabIcon /> },
    { path: '/admin/reports', label: 'Reports', icon: <ReportsIcon /> },
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
    // const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <aside style={{ zIndex: "50" }}
            className={` fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-50 
      bg-gradient-to-b from-[hsl(215,28%,17%)] to-[hsl(215,30%,12%)] 
      ${collapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[hsl(215,25%,22%)]">
                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[hsl(174,62%,40%)] to-[hsl(199,89%,48%)]">
                        <HospitalIcon className="text-white" />
                    </div>
                    {!collapsed && (
                        <div className="animate-[fadeIn_0.3s_ease-in-out]">
                            <h1 className="font-['Poppins'] font-bold text-white !text-3xl">
                                MediAdmin
                            </h1>
                            <p className="text-xs text-[hsl(210,20%,90%)] opacity-70">Healthcare System</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Button for collapsed state to toggle sidebar (if header button is hidden) */}
            {collapsed && (
                <div className="flex justify-center py-2 border-b border-[hsl(215,25%,22%)]">
                    <IconButton
                        onClick={() => setCollapsed(!collapsed)}
                        sx={{ color: 'hsl(210, 20%, 90%)' }}
                    >
                        <MenuIcon />
                    </IconButton>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto" style={{ overflowX: "hidden" }}>
                {navItems.map((item) => (
                    <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right" arrow>
                        <button
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full 
              ${isActive(item.path)
                                    ? 'bg-[hsl(174,62%,40%)] text-white shadow-[0_1px_2px_0_hsl(215,25%,15%,0.05)]'
                                    : 'text-[hsl(210,20%,90%)] hover:bg-[hsl(215,25%,22%)]'
                                } 
              ${collapsed ? 'justify-center px-2' : ''}`}
                        >
                            <span className="text-xl flex items-center justify-center">{item.icon}</span>
                            {!collapsed && (
                                <span className="font-medium animate-[fadeIn_0.3s_ease-in-out] whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    </Tooltip>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[hsl(215,25%,22%)]">
                <Tooltip title={collapsed ? 'Logout' : ''} placement="right" arrow>
                    <button
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-[hsl(0,72%,51%)] hover:bg-[hsl(0,72%,51%)]/10 
            ${collapsed ? 'justify-center px-2' : ''}`}
                    >
                        <LogoutIcon />
                        {!collapsed && <span className="font-medium">Logout</span>}
                    </button>
                </Tooltip>
            </div>
        </aside>
    );
}