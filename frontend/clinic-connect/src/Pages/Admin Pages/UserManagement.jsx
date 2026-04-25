import { useContext, useEffect, useState } from 'react';
import AdminLayout from '../../Components/Admin Components/AdminLayout';
import DataTable from '../../Components/Admin Components/DataTable';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Chip,
    Box,
    Tabs,
    Typography,
    Avatar,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import {
    CheckCircle as ApproveIcon,
    Cancel as DeclineIcon,
    // Visibility as ViewIcon,
    Description as LicenseIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { AdminContext } from '../../Context/AdminContext';
import Progress from '../../Components/Patient\'s Components/Progress';
import Error from '../../Components/Patient\'s Components/Error';



const roleColors = {
    Doctor: { bg: 'hsl(200, 80%, 92%)', color: 'hsl(200, 80%, 35%)' },
    Pharmacy: { bg: 'hsl(140, 60%, 90%)', color: 'hsl(140, 60%, 30%)' },
    Lab: { bg: 'hsl(270, 60%, 92%)', color: 'hsl(270, 60%, 40%)' },
};
const roles = ['Doctor', 'Patient', 'Pharmacist', 'Lab Technician'];
const pickedRole = ['doctor', 'patient', 'pharmacist', 'lab_technician'];

const statuses = ['active', 'pending', 'suspended'];

export default function UserManagement() {
    // const [pendingProviders, setPendingProviders] = useState(mockPendingProviders);
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterRole, setFilterRole] = useState('');
    const [picked, setPicked] = useState('');


    const columns = [
        { id: 'name', label: 'Name', minWidth: 180 },
        { id: 'email', label: 'Email', minWidth: 200 },
        {
            id: 'role',
            label: 'Role',
            minWidth: 120,
            render: (row) => {
                const displayRole = {
                    doctor: 'Doctor',
                    pharmacist: 'Pharmacist',
                    lab_technician: 'Lab Technician',
                    patient: 'Patient',
                    admin: 'Admin',
                }[row.role] || row.role;

                return (
                    <Chip
                        label={displayRole}
                        size="small"
                        sx={{
                            bgcolor:
                                row.role === 'doctor' ? 'hsl(199, 89%, 48%, 0.15)' :
                                    row.role === 'patient' ? 'hsl(142, 71%, 45%, 0.15)' :
                                        row.role === 'pharmacist' ? 'hsl(38, 92%, 50%, 0.15)' :
                                            row.role === 'lab_technician' ? 'hsl(174, 62%, 40%, 0.15)' :
                                                'hsl(270, 60%, 92%, 0.8)',
                            color:
                                row.role === 'doctor' ? 'hsl(199, 89%, 48%)' :
                                    row.role === 'patient' ? 'hsl(142, 71%, 45%)' :
                                        row.role === 'pharmacist' ? 'hsl(38, 92%, 50%)' :
                                            row.role === 'lab_technician' ? 'hsl(174, 62%, 40%)' :
                                                'hsl(270, 60%, 40%)',
                            fontWeight: 500,
                        }}
                    />
                );
            },
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'active' ? 'bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,45%)]' :
                    row.status === 'pending' ? 'bg-[hsl(38,92%,50%)]/15 text-[hsl(38,92%,50%)]' :
                        'bg-[hsl(0,72%,51%)]/15 text-[hsl(0,72%,51%)]'
                    }`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
            ),
        },
        {
            id: 'created_on',
            label: 'Created',
            minWidth: 100,
            render: (row) => new Date(row.created_on).toLocaleDateString()
        },
        // actions...
    ];


    const handleApprove = (provider) => {
        // setConfirmDialog({ open: true, provider, action: 'approve' });
    };

    const handleDecline = (provider) => {
        // setConfirmDialog({ open: true, provider, action: 'decline' });
    };

    const handleConfirmAction = () => {

    };
    const handleViewDetails = (provider) => {
        // setDetailsDialog({ open: true, provider });
    };

    const PendingColumns = [
        {
            id: 'name',
            label: 'Name',
            minWidth: 180,
            render: (row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {!row.img ? <Avatar sx={{ bgcolor: roleColors[row.role]?.bg, color: roleColors[row.role]?.color }}>
                        {row.name.charAt(0)}
                    </Avatar>
                        :
                        <img src={row.img} style={{
                            width: 50,
                            height: 50,
                        }} />
                    }
                    <Typography fontWeight={500}>{row.name}</Typography>
                </Box>
            ),
        },
        {
            id: 'specialization',
            label: 'Specialty',
            minWidth: 150,
        },
        {
            id: 'role',
            label: 'Role',
            minWidth: 100,
            render: (row) => (
                <Chip
                    label={row.role}
                    size="small"
                    sx={{
                        bgcolor: roleColors[row.role]?.bg,
                        color: roleColors[row.role]?.color,
                        fontWeight: 500,
                    }}
                />
            ),
        },
        {
            id: 'license',
            label: 'License',
            minWidth: 140,
            render: (row) => (
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LicenseIcon />}
                    onClick={() => handleViewDetails(row)}
                    sx={{
                        textTransform: 'none',
                        borderColor: 'hsl(215, 20%, 80%)',
                        color: 'hsl(215, 25%, 40%)',
                        '&:hover': {
                            borderColor: 'hsl(174, 62%, 40%)',
                            bgcolor: 'hsl(174, 40%, 97%)',
                        },
                    }}
                >
                    {row.license}
                </Button>
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 180,
            align: 'center',
            render: (row) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<ApproveIcon />}
                        onClick={() => handleApprove(row)}
                        sx={{
                            bgcolor: 'hsl(145, 63%, 42%)',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { bgcolor: 'hsl(145, 63%, 35%)' },
                        }}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DeclineIcon />}
                        onClick={() => handleDecline(row)}
                        sx={{
                            borderColor: 'hsl(0, 72%, 51%)',
                            color: 'hsl(0, 72%, 51%)',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: 'hsl(0, 72%, 97%)',
                                borderColor: 'hsl(0, 72%, 45%)',
                            },
                        }}
                    >
                        Decline
                    </Button>
                </Box>
            ),
        },
    ];

    const handleEdit = (user) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleSelectRow = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        setSelectedRows((prev) =>
            prev.length === filteredUsers.length ? [] : filteredUsers.map((u) => u.id)
        );
    };

    const HandleDeleteAll = () => {
        return;
    };

    const {
        fetchUserManagement,
        Users,
        reqsUsers,
        error,
        loading
    } = useContext(AdminContext);

    useEffect(() => {
        fetchUserManagement()
    }, [])

    const [filteredUsers, setfilteredUsers] = useState([]);
    const [filteredProviders, setfilteredProviders] = useState([]);
    useEffect(() => {
        const filtered = filterRole
            ? Users.filter((u) => u.role === filterRole)
            : Users;
        setfilteredUsers(filtered);
    }, [filterRole]);

    useEffect(() => {
        const filtered = tabValue === 0
            ? reqsUsers
            : reqsUsers.filter(p => {
                if (tabValue === 1) return p.role === 'doctor';
                if (tabValue === 2) return p.role === 'pharmacist';
                if (tabValue === 3) return p.role === 'lab_technician';
                return false;
            });
        setfilteredProviders(filtered);
    }, [tabValue]);


    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[hsl(215,25%,15%)] mb-1 font-['Poppins']">
                    User Management
                </h1>
                <p className="text-[hsl(215,15%,50%)]">
                    Manage all system users including doctors, patients, pharmacists, and lab technicians.
                </p>
            </div>
            {loading ? <Progress />
                : error ? <Error /> :
                    <div>
                        <Box className="p-6">
                            {filteredProviders?.length === 0 ? (
                                // Replaces .emptyState
                                <Box className="text-center py-12 px-6">
                                    <Typography variant="h6" className="text-[hsl(215,15%,50%)]">
                                        No pending requests
                                    </Typography>
                                    <Typography variant="body2" className="text-[hsl(215,15%,65%)]">
                                        All provider accounts have been reviewed.
                                    </Typography>
                                </Box>
                            ) : (
                                <DataTable
                                    columns={PendingColumns}
                                    data={filteredProviders || []}
                                    totalCount={(filteredProviders || []).length}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    onPageChange={setPage}
                                    onRowsPerPageChange={(val) => { setRowsPerPage(val); setPage(0); }}
                                />
                            )}
                        </Box>

                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <TextField
                                    select
                                    size="small"
                                    value={filterRole}
                                    onChange={async (e) => {
                                        const selectedDisplayRole = e.target.value;
                                        setFilterRole(e.target.value)
                                        // await fetchUserManagement(pickedRole[roles.indexOf(e.target.value)]);
                                        // const backendRoleMap = {
                                        //     '': '', // All Roles
                                        //     'Doctor': 'doctor',
                                        //     'Patient': 'patient',
                                        //     'Pharmacist': 'pharmacist',
                                        //     'Lab Technician': 'lab_technician',
                                        // };

                                        // const backendRole = backendRoleMap[selectedDisplayRole];

                                        // // Refetch with filter
                                        // await fetchUserManagement(backendRole);

                                    }}
                                    label="Filter by Role"
                                    sx={{ minWidth: 150 }}
                                >
                                    <MenuItem value="">All Roles</MenuItem>
                                    {roles.map((role) => (
                                        <MenuItem key={role} value={role}>{role}</MenuItem>
                                    ))}
                                </TextField>
                                {selectedRows.length > 0 && (
                                    <Chip
                                        label={`${selectedRows.length} selected`}
                                        onDelete={() => setSelectedRows([])}
                                        color="primary"
                                        size="small"
                                        sx={{
                                            bgcolor: 'hsl(174, 62%, 40%)',
                                            color: 'white',
                                            '& .MuiChip-deleteIcon': { color: 'white' }
                                        }}
                                    />
                                )}
                            </div>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => { setSelectedUser(null); setDialogOpen(true); }}
                                sx={{
                                    bgcolor: 'hsl(174, 62%, 40%)', // Primary
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 600,
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    px: 3,
                                    '&:hover': { bgcolor: 'hsl(174, 62%, 40%, 0.9)' },
                                }}
                            >
                                Add User
                            </Button>
                        </div>

                        {/* Data Table */}
                        <DataTable
                            columns={columns}
                            data={filteredUsers || []}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            totalCount={(filteredUsers || []).length}
                            onPageChange={setPage}
                            onRowsPerPageChange={setRowsPerPage}
                            selectable
                            selectedRows={selectedRows}
                            onSelectRow={handleSelectRow}
                            onSelectAll={handleSelectAll}
                            HandleDeleteAll={HandleDeleteAll}
                        />

                        {/* Add/Edit Dialog */}
                        <Dialog
                            open={dialogOpen}
                            onClose={() => setDialogOpen(false)}
                            maxWidth="sm"
                            fullWidth
                            PaperProps={{ sx: { borderRadius: '16px' } }}
                        >
                            <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                                {selectedUser ? 'Edit User' : 'Add New User'}
                            </DialogTitle>
                            <DialogContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <TextField
                                        label="Full Name"
                                        fullWidth
                                        defaultValue={selectedUser?.name || ''}
                                    />
                                    <TextField
                                        label="National ID"
                                        fullWidth
                                        defaultValue={selectedUser?.nationalId || ''}
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        defaultValue={selectedUser?.email || ''}
                                    />
                                    <TextField
                                        label="Phone"
                                        fullWidth
                                        defaultValue={selectedUser?.phone || ''}
                                    />
                                    <TextField
                                        select
                                        label="Role"
                                        fullWidth
                                        defaultValue={selectedUser?.role || ''}
                                    >
                                        {roles.map((role) => (
                                            <MenuItem key={role} value={role}>{role}</MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        select
                                        label="Status"
                                        fullWidth
                                        defaultValue={selectedUser?.status || 'pending'}
                                    >
                                        {statuses.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                            </DialogContent>
                            <DialogActions sx={{ px: 3, pb: 3 }}>
                                <Button
                                    onClick={() => setDialogOpen(false)}
                                    sx={{ color: 'hsl(215, 15%, 50%)' }} // Muted foreground
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setDialogOpen(false)}
                                    sx={{
                                        bgcolor: 'hsl(174, 62%, 40%)', // Primary
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: 'hsl(174, 62%, 40%, 0.9)' }
                                    }}
                                >
                                    {selectedUser ? 'Save Changes' : 'Create User'}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Delete Confirmation Dialog */}
                        <Dialog
                            open={deleteDialogOpen}
                            onClose={() => setDeleteDialogOpen(false)}
                            PaperProps={{ sx: { borderRadius: '16px' } }}
                        >
                            <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                                Delete User
                            </DialogTitle>
                            <DialogContent>
                                <p className="text-[hsl(215,15%,50%)]">
                                    Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.
                                </p>
                            </DialogContent>
                            <DialogActions sx={{ px: 3, pb: 3 }}>
                                <Button
                                    onClick={() => setDeleteDialogOpen(false)}
                                    sx={{ color: 'hsl(215, 15%, 50%)' }} // Muted foreground
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setDeleteDialogOpen(false)
                                        HandleDeleteAll();
                                    }}
                                    sx={{
                                        bgcolor: 'hsl(0, 72%, 51%)', // Destructive
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: 'hsl(0, 72%, 51%, 0.9)' },
                                    }}
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>}
        </AdminLayout>
    );
}