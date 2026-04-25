import { useState, useContext, useEffect } from 'react';
import AdminLayout from '../../Components/Admin Components/AdminLayout';
import DataTable from '../../Components/Admin Components/DataTable';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Avatar,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
    FormControl,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { AdminContext } from '../../Context/AdminContext';
import { CloudUploadIcon } from 'lucide-react';
import Progress from '../../Components/Patient\'s Components/Progress';
import Error from '../../Components/Patient\'s Components/Error';
import { toast } from '../../Hooks/UseToast';
// import { mockAdmins } from "../../MockInfo"


export default function AdminManagement() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [confirming, setConfirming] = useState(null);

    const [AddAdmin, setAddAdmin] = useState(null);
    const [adminForm, setAdminForm] = useState({ name: '', email: '', phone: '', password: '', national_id: '', gender: '' });
    const [submittingAdmin, setSubmittingAdmin] = useState(false);
    const [missedFeilds, setMissedFeilds] = useState(false)
    const [image, setImage] = useState(null);
    const [initialized, setInitialized] = useState(false);


    const columns = [
        {
            id: 'avatar',
            label: '',
            minWidth: 60,
            render: (row) => (
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'hsl(174, 62%, 40%)', // Primary
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                    }}
                >
                    {row.name.charAt(0)}
                </Avatar>
            ),
        },
        { id: 'name', label: 'Name', minWidth: 180 },
        { id: 'email', label: 'Email', minWidth: 220 },
        { id: 'lastLogin', label: 'Last Login', minWidth: 150 },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'center',
            render: (row) => (
                <div className="flex items-center justify-center gap-1">
                    <IconButton
                        size="small"
                        sx={{ color: 'hsl(174, 62%, 40%)' }} // Primary
                        onClick={() => { setSelectedAdmin(row); setDialogOpen(true); }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: 'hsl(0, 72%, 51%)' }} // Destructive
                        onClick={() => { setSelectedAdmin(row); setDeleteDialogOpen(true); }}
                        disabled={row.id === '1'}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </div>
            ),
        },
    ];


    const {
        Admins,
        AdminsCount,
        activeAdminsCount,
        fetchAdminManagement,
        AddNewAdmin,
        loading,
        error } = useContext(AdminContext);


    useEffect(() => {
        if (AddAdmin === true) {
            setAdminForm({ name: '', email: '', phone: '', password: '', national_id: '', gender: '' });
            setImage(null);
            setMissedFeilds(false);
        }
    }, [AddAdmin]);

    useEffect(() => {
        fetchAdminManagement().finally(() => setInitialized(true));
    }, []);

    const handleAdminSubmit = async () => {
        if (!adminForm.name.trim() || !adminForm.email.trim() || !adminForm.phone.trim() || !adminForm.password.trim() || !adminForm.national_id.trim() || !adminForm.gender || !adminForm.newAdminPassword || !adminForm.BDate) {
            setMissedFeilds(true);
            return;
        }

        setSubmittingAdmin(true);
        const result = await AddNewAdmin({
            name: adminForm.name,
            email: adminForm.email,
            phone: adminForm.phone,
            newAdminPassword: adminForm.newAdminPassword,
            password: adminForm.password,
            national_id: adminForm.national_id,
            gender: adminForm.gender,
            image: image,
            BDate: adminForm.BDate
        });
        setSubmittingAdmin(false);

        if (result.success) {
            toast({
                title: "Admin added successfully!!",
                description: `Admin ${adminForm.name} is added successfully.`,
            });
            setAdminForm({ name: '', email: '', phone: '', password: '', national_id: '', gender: '', currentAdminPassword: '', BDate: '' });
            setImage(null);
            setAddAdmin(false);
            setConfirming(false);
            setMissedFeilds(false);
            setDialogOpen(false)
            await fetchAdminManagement();
        } else {
            toast({
                title: "Error Adding the new Admin!",
                description: result.error || 'Unknown error occurred',
            });
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[hsl(215,25%,15%)] mb-1 font-['Poppins']">
                    Admin Management
                </h1>
                <p className="text-[hsl(215,15%,50%)]">
                    Create and manage administrator accounts with specific permissions.
                </p>
            </div>
            {loading || !initialized ? <Progress />
                : error ? <Error /> : <div>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Stat Card 1 */}
                        <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] p-6 transition-all duration-300 shadow-[0_1px_2px_0_hsl(215,25%,15%,0.05)] hover:shadow-[0_10px_15px_-3px_hsl(215,25%,15%,0.1),0_4px_6px_-4px_hsl(215,25%,15%,0.1)] hover:-translate-y-0.5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-[hsl(174,62%,40%)]/10">
                                    <AdminIcon className="text-[hsl(174,62%,40%)] w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[hsl(215,15%,50%)] text-sm">Total Admins</p>
                                    <p className="text-2xl font-bold font-['Poppins'] text-[hsl(215,25%,15%)]">{AdminsCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] p-6 transition-all duration-300 shadow-[0_1px_2px_0_hsl(215,25%,15%,0.05)] hover:shadow-[0_10px_15px_-3px_hsl(215,25%,15%,0.1),0_4px_6px_-4px_hsl(215,25%,15%,0.1)] hover:-translate-y-0.5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-[hsl(142,71%,45%)]/10">
                                    <AdminIcon className="text-[hsl(142,71%,45%)] w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[hsl(215,15%,50%)] text-sm">Active Today</p>
                                    <p className="text-2xl font-bold font-['Poppins'] text-[hsl(215,25%,15%)]">{activeAdminsCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stat Card 3 */}
                        {/* <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] p-6 transition-all duration-300 shadow-[0_1px_2px_0_hsl(215,25%,15%,0.05)] hover:shadow-[0_10px_15px_-3px_hsl(215,25%,15%,0.1),0_4px_6px_-4px_hsl(215,25%,15%,0.1)] hover:-translate-y-0.5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-[hsl(199,89%,48%)]/10">
                            <AdminIcon className="text-[hsl(199,89%,48%)] w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[hsl(215,15%,50%)] text-sm">Full Access</p>
                            <p className="text-2xl font-bold font-['Poppins'] text-[hsl(215,25%,15%)]">1</p>
                        </div>
                    </div>
                </div> */}
                    </div>

                    {/* Toolbar */}
                    <div className="flex justify-end mb-6">
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => { setAddAdmin(true); setDialogOpen(true); }}
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
                            Add Admin
                        </Button>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={Admins}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalCount={AdminsCount}
                        onPageChange={setPage}
                        onRowsPerPageChange={setRowsPerPage}
                    />
                    <Dialog
                        open={AddAdmin}
                        onClose={() => { setAddAdmin(false); setAdminForm({ name: '', email: '', phone: '', password: '', national_id: '', gender: '' }); setImage(null); setMissedFeilds(false); }}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{ sx: { borderRadius: '16px' } }}
                    >
                        <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                            Add New Admin
                        </DialogTitle>
                        {missedFeilds && <p className='!mt-0 ml-5 mb-0 text-red-500'>fill In All the fields</p>}
                        <DialogContent>
                            <div className="space-y-4 mt-4">
                                <TextField
                                    label="Full Name"
                                    fullWidth
                                    value={adminForm.name}
                                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                                    className='mb-2'
                                />
                                <TextField
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    value={adminForm.email}
                                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                                    className='mb-2'
                                />

                                <TextField
                                    className='mb-3'
                                    label="Phone"
                                    type="text"
                                    fullWidth
                                    value={adminForm.phone}
                                    onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                                />

                                <TextField
                                    label="Password"
                                    type="text"
                                    fullWidth
                                    value={adminForm.newAdminPassword}
                                    onChange={(e) => setAdminForm({ ...adminForm, newAdminPassword: e.target.value })}
                                    className='mb-2'
                                />

                                <TextField
                                    label="National ID"
                                    type="text"
                                    fullWidth
                                    value={adminForm.national_id}
                                    onChange={(e) => setAdminForm({ ...adminForm, national_id: e.target.value })}
                                    className='mb-2'
                                />
                                <FormControl>
                                    <FormLabel>Gender</FormLabel>
                                    <RadioGroup
                                        value={adminForm.gender}
                                        onChange={(e) => setAdminForm({ ...adminForm, gender: e.target.value })}
                                    >
                                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    </RadioGroup>
                                </FormControl>
                                <div className="flex flex-col">
                                    <label className="mb-2 text-sm font-medium text-[#495057]">
                                        Birth date
                                    </label>
                                    <input
                                        type="date"
                                        value={adminForm.BDate}
                                        onChange={(e) => setAdminForm({ ...adminForm, BDate: e.target.value })}
                                        className="w-full rounded-lg border border-[#ced4da] px-[14px] py-[10px] text-sm outline-none transition-colors duration-150 ease-in-out focus:border-[#53629e] focus:ring-4 focus:ring-blue-500/25"
                                    />
                                </div>
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                    style={{ display: "Block", maxWidth: "50%", overflowX: "hidden", bgcolor: 'hsl(174, 62%, 40%)' }}
                                    className={`!bg-[#4db6ac]`}
                                >
                                    {image ? 'Image Selected' : 'Upload Image'}
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        onChange={handleImageChange}
                                        hidden
                                    />
                                </Button>
                            </div>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            <Button onClick={() => { setAddAdmin(false); setAdminForm({ name: '', email: '', phone: '', password: '', national_id: '', gender: '' }); setImage(null); setMissedFeilds(false) }} sx={{ color: 'hsl(215, 15%, 50%)' }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setConfirming(true)}
                                sx={{
                                    bgcolor: 'hsl(174, 62%, 40%)',
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: 'hsl(174, 62%, 40%, 0.9)' },
                                }}
                            >
                                Next
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {/* Confirming The Addition */}
                    <Dialog
                        open={confirming}
                        onClose={() => { setConfirming(false); }}
                        PaperProps={{ sx: { borderRadius: '16px', width: "30%", padding: 2 } }}
                    >
                        <DialogTitle className='!pl-0' sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                            Confirm Admin Creation
                        </DialogTitle>
                        <DialogContent className='!pl-0'>
                            <p className="text-[hsl(215,15%,50%)]">
                                Are you sure you want to create this admin account?
                            </p>
                        </DialogContent>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            className='mb-2 '
                            value={adminForm.password}
                            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        />
                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            <Button onClick={() => { setConfirming(false) }} sx={{ color: 'hsl(215, 15%, 50%)' }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleAdminSubmit}
                                disabled={submittingAdmin}
                                sx={{
                                    bgcolor: 'hsl(174, 62%, 40%)',
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: 'hsl(174, 62%, 40%, 0.9)' },
                                }}
                            >
                                {submittingAdmin ? 'Creating...' : 'Confirm'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>}
        </AdminLayout >
    );
}