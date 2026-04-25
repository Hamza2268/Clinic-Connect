import { useState, useEffect, useContext } from 'react';
import AdminSidebar from './AdminSidebar';
import { IconButton, Avatar, Badge, Menu, MenuItem } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, MenuIcon } from 'lucide-react';
import { AuthContext } from '../../Context/AuthProviderContext';

export default function AdminLayout({ children }) {
    // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useContext(AuthContext)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsed(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-[hsl(210,20%,98%)] flex">
            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>

                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-[hsl(0,0%,100%)]/80 backdrop-blur-md border-b border-[hsl(215,20%,88%)] px-6 py-1">
                    <div className="flex  items-center justify-between">

                        {/* Collapse Arrow */}
                        {!collapsed && < IconButton
                            onClick={() => setCollapsed(!collapsed)}
                            className="!text-[hsl(210,20%,90%)]"
                            sx={{ color: 'hsl(210, 20%, 90%)' }}
                        >
                            <div className='!mr-5'>
                                <ChevronLeftIcon className=' text-[#555] rounded-xl' />
                            </div>
                        </IconButton>}

                        {/* Right Section */}
                        <div className=" items-center gap-4 !float-right">

                            <button
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[hsl(215,20%,94%)] transition-colors"
                            >
                                {user?.img ?
                                    <img src={user.img} className='rounded-3xl' style={{
                                        width: 50,
                                        height: 50,
                                    }} />
                                    :
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: 'hsl(174, 62%, 40%)',
                                            fontFamily: 'Poppins',
                                            fontWeight: 600,
                                        }}
                                    >
                                        A
                                    </Avatar>}
                                <div className="text-left hidden md:block">
                                    <p className="font-medium text-[hsl(215,25%,15%)] text-sm mb-0">{user.name}</p>
                                    <p className="text-xs text-[hsl(215,15%,50%)] mb-0">System Administrator</p>
                                </div>
                            </button>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px hsl(215 25% 15% / 0.1), 0 4px 6px -4px hsl(215 25% 15% / 0.1)',
                                    },
                                }}
                            >
                                <MenuItem onClick={() => { setAnchorEl(null); navigate("/Admin/Profile") }}>Profile</MenuItem>
                                <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 animate-[fadeIn_0.5s_ease-out]">{children}</main>
            </div >
        </div >
    );
}