import { useState } from 'react';
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
    Chip,
    InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Medication as MedicationIcon,
} from '@mui/icons-material';
import { mockAdminMedications } from "../../MockInfo";
import { useContext } from 'react';
import { AdminContext } from '../../Context/AdminContext';
import { useEffect } from 'react';
import Progress from '../../Components/Patient\'s Components/Progress';
import Error from '../../Components/Patient\'s Components/Error';
import { toast } from '../../Hooks/UseToast';

export default function Medications() {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [medForm, setMedForm] = useState({ name: '', company: '', side_effects: '', price: '' });
    const [AddMed, setAddMed] = useState(null);
    const [submittingMed, setSubmittingMed] = useState(false);
    const [editMedOpen, setEditMedOpen] = useState(false)
    const [missedFeilds, setMissedFeilds] = useState(false)





    const handleChange = (event, value) => {
        setRowsPerPage(value.props.children);
        setPage(1)
        console.log(value.props.children);
    };

    useEffect(() => {
        const loadMedications = async () => {
            await fetchMedication({
                pages: 1,
                lim: rowsPerPage,
            });
        };

        loadMedications();
    }, [rowsPerPage, page]);

    const handleEditClick = (medication) => {
        setMedForm({
            ...medication,
            // Explicitly ensure the ID is captured
            medicine_id: medication.medication_id || medication.id
        });
        setEditMedOpen(true);
    };

    const handleEditSubmit = async () => {
        // 1. Validation (ensure medForm.id or similar is present)
        if (!medForm.name?.trim() || !medForm.company?.trim() || !medForm.side_effects?.trim() || !medForm.price) {
            setMissedFeilds(true);
            toast({
                title: "Please fill in all fields!",
                variant: "destructive", // Optional: depending on your toast library
            });
            return;
        }

        setSubmittingMed(true);

        // 2. Call your Update function (passing the ID and the data)
        const result = await UpdateMedication({
            medicine_id: medForm.medication_id || medForm.id,//, // Ensure your medForm contains the ID of the record
            name: medForm.name,
            company: medForm.company,
            side_effects: medForm.side_effects,
            price: parseInt(medForm.price)
        });

        setSubmittingMed(false);
        setMissedFeilds(false);

        if (result.success) {
            toast({
                title: "Medication updated successfully!",
                description: `Medicine ${medForm.name} has been updated.`,
            });

            // 3. Reset and Close
            setMedForm({ name: '', company: '', side_effects: '', price: '' });
            setEditMedOpen(false); // Close the edit dialog
            await fetchMedication(); // Refresh the list
        } else {
            toast({
                title: "Error updating the medicine!",
                description: result.error || "Please try again later.",
            });
        }
    };

    const handleMedicationSubmit = async () => {
        if (!medForm.name.trim() || !medForm.company.trim() || !medForm.side_effects.trim() || !medForm.price) {
            // alert('Please fill in all fields');
            setMissedFeilds(true);
            toast({
                title: "Please fill in all fields!",
                // description: `Medicine ${medForm.name} for ${medForm.company} is added successfully.`,
            });
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
            setDeleteDialogOpen(false);
            await fetchMedication();
        } else {
            // alert(`Error: ${result.error}`);
            toast({
                title: "Error Adding the new Medicine!",
            });
        }
    };
    // This only opens the modal and "remembers" which item was clicked
    const HandleDelete = (medication) => {
        setSelectedMedication(medication);
        setDeleteDialogOpen(true);
    }

    // This runs when the user clicks 'Delete' inside the Dialog
    const handleConfirmDelete = async () => {
        const id = selectedMedication.medication_id || selectedMedication.id;

        setSubmittingMed(true);
        const result = await DeleteMedication(id); // Use DeleteMedication from AdminContext
        setSubmittingMed(false);

        if (result.success) {
            toast({
                title: "Deleted!",
                description: `${selectedMedication.name} removed successfully.`,
            });
            setDeleteDialogOpen(false);
            setSelectedMedication(null);
            await fetchMedication({
                pages: 1,
                lim: rowsPerPage,
            });
        } else {
            toast({
                title: "Error deleting medication",
                description: result.error,
            });
        }
    }

    const columns = [
        {
            id: 'icon',
            label: '',
            minWidth: 50,
            render: () => (
                <div className="w-10 h-10 rounded-lg bg-[hsl(38,92%,50%)]/10 flex items-center justify-center">
                    <MedicationIcon className="text-[hsl(38,92%,50%)] w-5 h-5" />
                </div>
            ),
        },
        { id: 'name', label: 'Medication Name', minWidth: 200 },
        { id: 'company', label: 'Company', minWidth: 150 },

        {
            id: 'price',
            label: 'Price',
            minWidth: 100,
            render: (row) => <span className="font-semibold">${row?.price}</span>,
        },
        { id: 'side_effects', label: 'Side Effects', minWidth: 180 },
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
                        onClick={() => { handleEditClick(row) }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: 'hsl(0, 72%, 51%)' }} // Destructive
                        onClick={() => { HandleDelete(row) }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const { fetchMedication,
        AdminMedications,
        loading,
        error,
        AddNewMedication,
        UpdateMedication,
        DeleteMedication,
        medications_count,
        medications_stock,
        medication_companies,

    } = useContext(AdminContext);

    useEffect(() => {
        fetchMedication()
    }, [])

    const filteredMedications = AdminMedications.filter(
        (med) =>
            med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            med.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[hsl(215,25%,15%)] mb-1 font-['Poppins']">
                    Medications
                </h1>
                <p className="text-[hsl(215,15%,50%)]">
                    Manage all medications in the system including stock levels and pricing.
                </p>
            </div>
            {loading ? <Progress />
                : error ? <Error /> : <div>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Stat Card 1 */}
                        <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] p-6 transition-all duration-300 shadow-[0_1px_2px_0_hsl(215,25%,15%,0.05)] hover:shadow-[0_10px_15px_-3px_hsl(215,25%,15%,0.1),0_4px_6px_-4px_hsl(215,25%,15%,0.1)] hover:-translate-y-0.5">
                            <p className="text-[hsl(215,15%,50%)] text-sm">Total Medications</p>
                            <p className="text-2xl font-bold font-['Poppins'] text-[hsl(215,25%,15%)]">{AdminMedications.length}</p>
                        </div>

                        {/* Stat Card 2 */}
                        {/* <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] p-6 transition-all duration-300 shadow-[0_1px_2px_0_hsl(215,25%,15%,0.05)] hover:shadow-[0_10px_15px_-3px_hsl(215,25%,15%,0.1),0_4px_6px_-4px_hsl(215,25%,15%,0.1)] hover:-translate-y-0.5">
                            <p className="text-[hsl(215,15%,50%)] text-sm">Low Stock Items</p>
                            <p className="text-2xl font-bold font-['Poppins'] text-[hsl(38,92%,50%)]">
                                {mockAdminMedications.filter((m) => m.quantity < 350).length}
                            </p>
                        </div> */}

                        {/* Stat Card 3 */}
                        {/* <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] p-6 transition-all duration-300 shadow-[0_1px_2px_0_hsl(215,25%,15%,0.05)] hover:shadow-[0_10px_15px_-3px_hsl(215,25%,15%,0.1),0_4px_6px_-4px_hsl(215,25%,15%,0.1)] hover:-translate-y-0.5">
                            <p className="text-[hsl(215,15%,50%)] text-sm">Total Stock Value</p>
                            <p className="text-2xl font-bold font-['Poppins'] text-[hsl(215,25%,15%)]">
                                ${AdminMedications.reduce((acc, m) => acc + m.price * m.quantity, 0).toLocaleString()}
                            </p>
                        </div> */}

                        {/* Stat Card 4 */}
                        <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] p-6 transition-all duration-300 shadow-[0_1px_2px_0_hsl(215,25%,15%,0.05)] hover:shadow-[0_10px_15px_-3px_hsl(215,25%,15%,0.1),0_4px_6px_-4px_hsl(215,25%,15%,0.1)] hover:-translate-y-0.5">
                            <p className="text-[hsl(215,15%,50%)] text-sm">Companies</p>
                            <p className="text-2xl font-bold font-['Poppins'] text-[hsl(215,25%,15%)]">
                                {new Set(AdminMedications.map((m) => m.company)).size}
                            </p>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                        <TextField
                            placeholder="Search medications..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon className="text-[hsl(215,15%,50%)]" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                minWidth: 300,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',  // Change this value
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => { setAddMed(true); setDialogOpen(true); }}
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
                            Add Medication
                        </Button>
                    </div>

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={filteredMedications}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalCount={filteredMedications.length}
                        onPageChange={setPage}
                        onRowsPerPageChange={setRowsPerPage}
                        handleChange={handleChange}
                    />

                    {/* Add/Edit Dialog */}
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

                    <Dialog
                        open={editMedOpen} // Assuming a separate state for edit dialog
                        onClose={() => setEditMedOpen(false)}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{ sx: { borderRadius: '16px' } }}
                    >
                        <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                            Edit Medication
                        </DialogTitle>

                        {missedFeilds && <p className='!mt-0 ml-5 mb-0 text-red-500'>Please fill in all the fields</p>}

                        <DialogContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <TextField
                                    label="Medication Name"
                                    fullWidth
                                    value={medForm.name || ''}
                                    onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                                    className="md:col-span-2"
                                />
                                <TextField
                                    label="Company"
                                    fullWidth
                                    value={medForm.company || ''}
                                    onChange={(e) => setMedForm({ ...medForm, company: e.target.value })}
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={medForm.price || ''}
                                    fullWidth
                                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                    onChange={(e) => setMedForm({ ...medForm, price: e.target.value })}
                                />
                                <TextField
                                    label="Side Effects"
                                    fullWidth
                                    value={medForm.side_effects || ''}
                                    onChange={(e) => setMedForm({ ...medForm, side_effects: e.target.value })}
                                    className="md:col-span-2"
                                    multiline
                                    rows={2}
                                />
                            </div>
                        </DialogContent>

                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            <Button
                                onClick={() => { setEditMedOpen(false); setMedForm({}); setMissedFeilds(false) }}
                                sx={{ color: 'hsl(215, 15%, 50%)' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleEditSubmit} // Pointing to your Update/Put function
                                disabled={submittingMed}
                                sx={{
                                    bgcolor: 'hsl(174, 62%, 40%)',
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: 'hsl(174, 62%, 40%, 0.9)' }
                                }}
                            >
                                {submittingMed ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog
                        open={deleteDialogOpen}
                        onClose={() => setDeleteDialogOpen(false)}
                        PaperProps={{ sx: { borderRadius: '16px' } }}
                    >
                        <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                            Delete Medication
                        </DialogTitle>
                        <DialogContent>
                            <p className="text-[hsl(215,15%,50%)]">
                                Are you sure you want to delete <strong>{selectedMedication?.name}</strong>?
                                This action cannot be undone.
                            </p>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            <Button
                                onClick={() => setDeleteDialogOpen(false)}
                                disabled={submittingMed} // Disable while deleting
                                sx={{ color: 'hsl(215, 15%, 50%)' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleConfirmDelete} // Call the execution function
                                disabled={submittingMed}      // Disable while deleting
                                sx={{
                                    bgcolor: 'hsl(0, 72%, 51%)',
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: 'hsl(0, 72%, 51%, 0.9)' },
                                }}
                            >
                                {submittingMed ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>}
        </AdminLayout>
    );
}