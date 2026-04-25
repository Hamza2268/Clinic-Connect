import AdminLayout from '../../Components/Admin Components/AdminLayout';
import StatCard from '../../Components/Admin Components/StatCard';
import {
    People as PeopleIcon,
    LocalHospital as DoctorIcon,
    PersonOutline as PatientIcon,
    Medication as MedicationIcon,
    Science as LabIcon,
    TrendingUp as TrendingUpIcon,
    CalendarMonth as CalendarIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, InputAdornment, LinearProgress, Radio, RadioGroup, TextField } from '@mui/material';

import { recentActivities, systemStats } from "../../MockInfo";
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AdminContext } from '../../Context/AdminContext';
import { CloudUploadIcon } from 'lucide-react';
import Progress from '../../Components/Patient\'s Components/Progress';
import Error from '../../Components/Patient\'s Components/Error';
import { toast } from '../../Hooks/UseToast';

export default function AdminDashBoard() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [AddAdmin, setAddAdmin] = useState(null);
    const [AddMed, setAddMed] = useState(null);
    const [AddTest, setAddTest] = useState(null);
    const [confirming, setConfirming] = useState(null);
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [medForm, setMedForm] = useState({ name: '', company: '', side_effects: '', price: '' });
    const [submittingMed, setSubmittingMed] = useState(false);
    const [testForm, setTestForm] = useState({ test_name: '', warnings: '', preparation_notes: '', reference_range_min: '', reference_range_max: '' });
    const [submittingTest, setSubmittingTest] = useState(false);
    const [adminForm, setAdminForm] = useState({ name: '', email: '', phone: '', password: '', national_id: '', gender: '' });
    const [submittingAdmin, setSubmittingAdmin] = useState(false);
    const [missedFeilds, setMissedFeilds] = useState(false)

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleMedicationSubmit = async () => {
        if (!medForm.name.trim() || !medForm.company.trim() || !medForm.side_effects.trim() || !medForm.price) {
            // alert('Please fill in all fields');
            setMissedFeilds(true);
            return;
        }

        setSubmittingMed(true);
        const result = await AddNewMedication({
            name: medForm.name,
            company: medForm.company,
            side_effects: medForm.side_effects,
            price: medForm.price
        });
        setSubmittingMed(false);
        setMissedFeilds(false)

        if (result.success) {
            // alert('Medication added successfully!');
            toast({
                title: "Medication added successfully!!",
                description: `Medicine ${medForm.name} for ${medForm.company} is added successfully.`,
            });
            setMedForm({ name: '', company: '', side_effects: '' });
            setAddMed(false);
            await fetchDashboard();
        } else {
            // alert(`Error: ${result.error}`);
            toast({
                title: "Error Adding the new Medicine!",
            });
        }
    };

    const handleLabTestSubmit = async () => {
        if (!testForm.test_name.trim() || !testForm.warnings.trim() || !testForm.preparation_notes.trim() || !testForm.reference_range_min || !testForm.reference_range_max) {
            // alert('Please fill in all fields');
            setMissedFeilds(true)
            return;
        }

        if (Number(testForm.reference_range_max) <= Number(testForm.reference_range_min)) {
            toast({
                className: '!z-[9999]',
                title: "Invalid Range!",
                description: "Reference range max must be greater than min.",
            });
            return;
        }

        setSubmittingTest(true);
        const result = await AddNewLabTest({
            test_name: testForm.test_name,
            warnings: testForm.warnings,
            preparation_notes: testForm.preparation_notes,
            price: testForm.price,
            reference_range: `[${testForm.reference_range_min},${testForm.reference_range_max}]`
        });
        setSubmittingTest(false);

        if (result.success) {
            toast({
                title: "Lab Test added successfully!!",
                description: `Test ${testForm.test_name} is added successfully.`,
            });
            setTestForm({ test_name: '', warnings: '', preparation_notes: '', price: '', reference_range_min: '', reference_range_max: '' });
            setAddTest(false);
            await fetchDashboard();
        } else {
            toast({
                title: "Error Adding the new Lab Test!",
            });
        }
    };

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
            await fetchDashboard();

        } else {
            toast({
                title: "Error Adding the new Admin!",
                description: result.error || 'Unknown error occurred',
            });
        }
    };
    const { TotalUsers, ActiveDoctors, Patients, Medications, loading, error, fetchDashboard, AddNewMedication, AddNewLabTest, AddNewAdmin } = useContext(AdminContext);
    // console.log(image);

    // Reset admin form when dialog opens
    useEffect(() => {
        if (AddAdmin === true) {
            setAdminForm({ name: '', email: '', phone: '', password: '', national_id: '', gender: '' });
            setImage(null);
            setMissedFeilds(false);
        }
    }, [AddAdmin]);

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[hsl(215,25%,15%)] mb-1 font-['Poppins']">
                    Dashboard
                </h1>
                <p className="text-[hsl(215,15%,50%)]">
                    Welcome back! Here's what's happening with your healthcare system.
                </p>
            </div>

            {/* Stats Grid */}
            {loading ? <Progress />
                : error ? <Error /> : <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Users"
                            value={TotalUsers?.toLocaleString?.() || '0'}
                            change=""
                            changeType="positive"
                            icon={<PeopleIcon className="text-[hsl(174,62%,40%)] w-6 h-6" />}
                            iconBgClass="bg-[hsl(174,62%,40%)]/10"
                        />
                        <StatCard
                            title="Active Doctors"
                            value={ActiveDoctors?.toLocaleString?.() || '0'}
                            change=""
                            changeType="positive"
                            icon={<DoctorIcon className="text-[hsl(199,89%,48%)] w-6 h-6" />}
                            iconBgClass="bg-[hsl(199,89%,48%)]/10"
                        />
                        <StatCard
                            title="Patients"
                            value={Patients?.toLocaleString?.() || '0'}
                            change=""
                            changeType="positive"
                            icon={<PatientIcon className="text-[hsl(142,71%,45%)] w-6 h-6" />}
                            iconBgClass="bg-[hsl(142,71%,45%)]/10"
                        />
                        <StatCard
                            title="Medications"
                            value={Medications?.toLocaleString?.() || '0'}
                            change=""
                            changeType="neutral"
                            icon={<MedicationIcon className="text-[hsl(38,92%,50%)] w-6 h-6" />}
                            iconBgClass="bg-[hsl(38,92%,50%)]/10"
                        />
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Recent Activity */}
                        <div className="lg:col-span-3 bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] shadow-[0_4px_6px_-1px_hsl(215,25%,15%,0.1),0_2px_4px_-2px_hsl(215,25%,15%,0.1)] p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold font-['Poppins'] text-[hsl(215,25%,15%)]">Recent Activity</h2>
                                <button className="text-sm text-[hsl(174,62%,40%)] font-medium hover:underline">View All</button>
                            </div>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4  rounded-lg hover:bg-[hsl(215,20%,94%)]/50 transition-colors">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'patient' ? 'bg-[hsl(142,71%,45%)]/10' : // Success
                                            activity.type === 'doctor' ? 'bg-[hsl(199,89%,48%)]/10' : // Accent
                                                activity.type === 'medication' ? 'bg-[hsl(38,92%,50%)]/10' : // Warning
                                                    activity.type === 'lab' ? 'bg-[hsl(174,62%,40%)]/10' : // Primary
                                                        'bg-[hsl(0,72%,51%)]/10' // Destructive
                                            }`}>
                                            {activity.type === 'patient' && <PatientIcon className="text-[hsl(142,71%,45%)] w-5 h-5" />}
                                            {activity.type === 'doctor' && <DoctorIcon className="text-[hsl(199,89%,48%)] w-5 h-5" />}
                                            {activity.type === 'medication' && <MedicationIcon className="text-[hsl(38,92%,50%)] w-5 h-5" />}
                                            {activity.type === 'lab' && <LabIcon className="text-[hsl(174,62%,40%)] w-5 h-5" />}
                                            {activity.type === 'user' && <PeopleIcon className="text-[hsl(0,72%,51%)] w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-[hsl(215,25%,15%)] text-sm">{activity.action}</p>
                                            <p className="text-[hsl(215,15%,50%)] text-xs">{activity.user}</p>
                                        </div>
                                        <span className="text-xs text-[hsl(215,15%,50%)]">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System Health */}
                        {/* <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] shadow-[0_4px_6px_-1px_hsl(215,25%,15%,0.1),0_2px_4px_-2px_hsl(215,25%,15%,0.1)] p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold font-['Poppins'] text-[hsl(215,25%,15%)]">System Health</h2>
                                    <AssessmentIcon className="text-[hsl(215,15%,50%)]" />
                                </div>
                                <div className="space-y-5">
                                    {systemStats.map((stat) => (
                                        <div key={stat.label}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-[hsl(215,15%,50%)]">{stat.label}</span>
                                                <span className="text-sm font-semibold text-[hsl(215,25%,15%)]">{stat.value}%</span>
                                            </div>
                                            <LinearProgress
                                                variant="determinate"
                                                value={stat.value}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'hsl(215, 20%, 94%)', // Secondary
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        // Assuming stat.color contains a valid CSS color string. 
                                                        // If it contained a CSS var, it would need to be handled in the data source.
                                                        bgcolor: stat.color,
                                                    },
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div> */}
                    </div>
                </div>}

            {/* Quick Actions */}
            <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] shadow-[0_4px_6px_-1px_hsl(215,25%,15%,0.1),0_2px_4px_-2px_hsl(215,25%,15%,0.1)] p-6">
                <h2 className="text-lg font-semibold font-['Poppins'] text-[hsl(215,25%,15%)] mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            icon: <PeopleIcon />,
                            label: 'Add Admin',
                            color: 'bg-[hsl(174,62%,40%)]/10 text-[hsl(174,62%,40%)] hover:bg-[hsl(174,62%,40%)]/20',
                            onclick: () => { setAddAdmin(true); setDialogOpen(true); }

                        },
                        {
                            icon: <MedicationIcon />,
                            label: 'Add Medication',
                            color: 'bg-[hsl(38,92%,50%)]/10 text-[hsl(38,92%,50%)] hover:bg-[hsl(38,92%,50%)]/20',
                            onclick: () => { setAddMed(true); setDialogOpen(true); }

                        },
                        {
                            icon: <LabIcon />,
                            label: 'Add Lab Exam',
                            color: 'bg-[hsl(199,89%,48%)]/10 text-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,48%)]/20',
                            onclick: () => { setAddTest(true); setDialogOpen(true); }

                        },
                        {
                            icon: <CalendarIcon />,
                            label: 'View Reports',
                            color: 'bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,45%)]/20',
                            onclick: () => { navigate("/admin/reports") }

                        },
                    ].map((action) => (
                        <button
                            key={action.label}
                            className={`flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-200 ${action.color}`}
                            onClick={action.onclick}
                        >
                            <span className="text-2xl">{action.icon}</span>
                            <span className="font-medium text-sm">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Adding New Admin */}
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

            {/* Adding New Medication */}
            <Dialog
                open={AddMed}
                onClose={() => setAddMed(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    Add New Medication
                </DialogTitle>
                {missedFeilds && <p className='!mt-0 ml-5 mb-0 text-red-500'>fill In All the fields</p>}
                <DialogContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <TextField
                            label="Medication Name"
                            fullWidth
                            value={medForm.name}
                            onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                            className="md:col-span-2"
                        />
                        <TextField
                            label="Company"
                            fullWidth
                            value={medForm.company}
                            onChange={(e) => setMedForm({ ...medForm, company: e.target.value })}
                        />
                        <TextField
                            label="Price"
                            type="number"
                            value={medForm.price}
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                            defaultValue=''
                            onChange={(e) => { setMedForm({ ...medForm, price: e.target.value }); console.log(medForm.price); }}
                        />
                        <TextField
                            label="Side Effects"
                            fullWidth
                            value={medForm.side_effects}
                            onChange={(e) => setMedForm({ ...medForm, side_effects: e.target.value })}
                            className="md:col-span-2"
                            multiline
                            rows={2}
                        />
                    </div>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => { setAddMed(false); setMedForm({}); setMissedFeilds(false) }} sx={{ color: 'hsl(215, 15%, 50%)' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleMedicationSubmit}
                        disabled={submittingMed}
                        sx={{
                            bgcolor: 'hsl(174, 62%, 40%)', // Primary
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { bgcolor: 'hsl(174, 62%, 40%, 0.9)' }
                        }}
                    >
                        {submittingMed ? 'Adding...' : 'Add Medication'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Adding New Lab Test */}
            <Dialog
                open={AddTest}
                onClose={() => setAddTest(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    Add New Lab Test
                </DialogTitle>
                {missedFeilds && <p className='!mt-0 ml-5 mb-0 text-red-500'>fill In All the required fields</p>}
                <DialogContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <TextField
                            label="Test Name"
                            fullWidth
                            value={testForm.test_name}
                            onChange={(e) => setTestForm({ ...testForm, test_name: e.target.value })}
                            className="md:col-span-2"
                        />
                        {/* <TextField
                            label="Price"
                            type="number"
                            fullWidth
                            value={testForm.price}
                            onChange={(e) => setTestForm({ ...testForm, price: e.target.value })}
                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        /> */}
                        <TextField
                            label="Warnings"
                            fullWidth
                            value={testForm.warnings}
                            onChange={(e) => setTestForm({ ...testForm, warnings: e.target.value })}
                            className="md:col-span-2"
                        />
                        <TextField
                            label="Reference Range Min"
                            type="number"
                            fullWidth
                            value={testForm.reference_range_min}
                            onChange={(e) => setTestForm({ ...testForm, reference_range_min: e.target.value })}
                            placeholder="e.g., 0, if exists"
                        />
                        <TextField
                            label="Reference Range Max"
                            type="number"
                            fullWidth
                            value={testForm.reference_range_max}
                            onChange={(e) => setTestForm({ ...testForm, reference_range_max: e.target.value })}
                            placeholder="e.g., 50, if exists"
                        />
                        <TextField
                            label="Preparation Notes"
                            fullWidth
                            multiline
                            rows={2}
                            value={testForm.preparation_notes}
                            onChange={(e) => setTestForm({ ...testForm, preparation_notes: e.target.value })}
                            className="md:col-span-2"
                        />
                    </div>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => { setAddTest(false); setTestForm({}); setMissedFeilds(false) }} sx={{ color: 'hsl(215, 15%, 50%)' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleLabTestSubmit}
                        disabled={submittingTest}
                        sx={{
                            bgcolor: 'hsl(174, 62%, 40%)', // Primary
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { bgcolor: 'hsl(174, 62%, 40%, 0.9)' },
                        }}
                    >
                        {submittingTest ? 'Adding...' : 'Add Test'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
}