import { useState } from "react";
import AdminLayout from "../../Components/Admin Components/AdminLayout";
import DataTable from "../../Components/Admin Components/DataTable";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Science as ScienceIcon,
} from "@mui/icons-material";
import { useContext, useEffect } from "react";
import { AdminContext } from "../../Context/AdminContext";
import Progress from '../../Components/Patient\'s Components/Progress';
import Error from '../../Components/Patient\'s Components/Error';
import { toast } from '../../Hooks/UseToast';

export default function LabExaminations() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [testForm, setTestForm] = useState({
    test_id: null,
    test_name: '',
    warnings: '',
    preparation_notes: '',
    reference_range_min: '',
    reference_range_max: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [missedFields, setMissedFields] = useState(false);

  const {
    fetchLab,
    AdminLab,
    AddNewLabTest,
    UpdateExam,
    DeleteExam,
    loading,
    error
  } = useContext(AdminContext);

  useEffect(() => {
    fetchLab({ pages: 1, lim: rowsPerPage });
  }, [rowsPerPage]);

  const filteredExams = AdminLab?.filter((exam) =>
    exam?.test_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const columns = [
    {
      id: "icon",
      label: "",
      minWidth: 50,
      render: () => (
        <div className="w-10 h-10 rounded-lg bg-[hsl(174,62%,40%)]/10 flex items-center justify-center">
          <ScienceIcon className="text-[hsl(174,62%,40%)] w-5 h-5" />
        </div>
      ),
    },
    { id: "test_name", label: "Test Name", minWidth: 220 },
    { id: "preparation_notes", label: "Preparation", minWidth: 180 },
    {
      id: "reference_range",
      label: "Reference Range",
      minWidth: 150,
      render: (row) => (
        <span className="text-sm font-medium">
          {row.reference_range || 'N/A'}
        </span>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 120,
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <IconButton
            size="small"
            sx={{ color: "hsl(174, 62%, 40%)" }}
            onClick={() => handleEditClick(row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "hsl(0, 72%, 51%)" }}
            onClick={() => handleDeleteClick(row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  // Parse reference_range string like "[40,80]" → min/max
  const parseReferenceRange = (rangeStr) => {
    if (!rangeStr || !rangeStr.startsWith('[') || !rangeStr.endsWith(']')) {
      return { min: '', max: '' };
    }
    const cleaned = rangeStr.slice(1, -1); // remove [ ]
    const [min, max] = cleaned.split(',');
    return { min: min?.trim() || '', max: max?.trim() || '' };
  };

  // Handle Edit Click
  const handleEditClick = (exam) => {
    const { min, max } = parseReferenceRange(exam.reference_range);

    setTestForm({
      test_id: exam.test_id,
      test_name: exam.test_name || '',
      warnings: exam.warnings || '',
      preparation_notes: exam.preparation_notes || '',
      reference_range_min: min,
      reference_range_max: max,
    });
    setEditDialogOpen(true);
  };

  // Handle Delete Click
  const handleDeleteClick = (exam) => {
    setSelectedExam(exam);
    setDeleteDialogOpen(true);
  };

  // Build payload — only include reference_range if both min/max filled
  const buildPayload = () => {
    const payload = {
      test_name: testForm.test_name.trim(),
      warnings: testForm.warnings.trim(),
      preparation_notes: testForm.preparation_notes.trim(),
    };

    // Only add reference_range if both min and max are provided
    if (testForm.reference_range_min && testForm.reference_range_max) {
      if (Number(testForm.reference_range_max) <= Number(testForm.reference_range_min)) {
        toast({
          title: "Invalid Range!",
          description: "Max must be greater than min.",
        });
        return null;
      }
      payload.reference_range = `[${testForm.reference_range_min},${testForm.reference_range_max}]`;
    }

    return payload;
  };

  // Submit Add or Edit
  const handleSubmit = async () => {
    if (!testForm.test_name.trim() || !testForm.warnings.trim() || !testForm.preparation_notes.trim()) {
      setMissedFields(true);
      return;
    }

    const payload = buildPayload();
    if (!payload) return; // Invalid range

    setSubmitting(true);

    let result;

    if (testForm.test_id) {
      // Edit
      result = await UpdateExam({
        test_id: testForm.test_id,
        ...payload
      });
    } else {
      // Add
      result = await AddNewLabTest(payload);
    }

    setSubmitting(false);

    if (result.success) {
      toast({
        title: testForm.test_id ? "Updated!" : "Added!",
        description: `Lab test "${testForm.test_name}" has been ${testForm.test_id ? 'updated' : 'added'} successfully.`,
      });

      // Reset form
      setTestForm({
        test_id: null,
        test_name: '',
        warnings: '',
        preparation_notes: '',
        reference_range_min: '',
        reference_range_max: '',
      });

      setAddDialogOpen(false);
      setEditDialogOpen(false);
      setMissedFields(false);

      // Refresh
      await fetchLab({ pages: 1, lim: rowsPerPage });
    } else {
      toast({
        title: "Error",
        description: result.error || "Operation failed.",
      });
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedExam) return;

    setSubmitting(true);
    const result = await DeleteExam(selectedExam.test_id);
    setSubmitting(false);

    if (result.success) {
      toast({
        title: "Deleted!",
        description: `${selectedExam.test_name} removed successfully.`,
      });
      setDeleteDialogOpen(false);
      setSelectedExam(null);
      await fetchLab({ pages: 1, lim: rowsPerPage });
    } else {
      toast({
        title: "Error deleting test",
        description: result.error || "Please try again.",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[hsl(215,25%,15%)] mb-1 font-['Poppins']">
          Lab Examinations
        </h1>
        <p className="text-[hsl(215,15%,50%)]">
          Manage laboratory tests and examination types available in the system.
        </p>
      </div>

      {loading ? <Progress /> : error ? <Error /> : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[hsl(215,15%,50%)] text-sm">Total Tests</p>
              <p className="text-2xl font-bold text-[hsl(215,25%,15%)]">
                {AdminLab?.length || 0}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <TextField
              placeholder="Search tests..."
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
              sx={{ minWidth: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setTestForm({
                  test_id: null,
                  test_name: '',
                  warnings: '',
                  preparation_notes: '',
                  reference_range_min: '',
                  reference_range_max: '',
                });
                setAddDialogOpen(true);
              }}
              sx={{
                bgcolor: "hsl(174, 62%, 40%)",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "hsl(174, 62%, 35%)" },
              }}
            >
              Add Lab Test
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={filteredExams}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={filteredExams.length}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
          />

          {/* Unified Add/Edit Dialog */}
          <Dialog
            open={addDialogOpen || editDialogOpen}
            onClose={() => {
              setAddDialogOpen(false);
              setEditDialogOpen(false);
              setMissedFields(false);
            }}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: '16px' } }}
          >
            <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              {editDialogOpen ? 'Edit Lab Test' : 'Add New Lab Test'}
            </DialogTitle>
            {missedFields && <p className='ml-5 mb-2 text-red-500'>Please fill in all required fields (*)</p>}
            <DialogContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <TextField
                  label="Test Name *"
                  fullWidth
                  value={testForm.test_name}
                  onChange={(e) => setTestForm({ ...testForm, test_name: e.target.value })}
                  className="md:col-span-2"
                />
                <TextField
                  label="Warnings *"
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
                  placeholder="Optional"
                />
                <TextField
                  label="Reference Range Max"
                  type="number"
                  fullWidth
                  value={testForm.reference_range_max}
                  onChange={(e) => setTestForm({ ...testForm, reference_range_max: e.target.value })}
                  placeholder="Optional"
                />
                <TextField
                  label="Preparation Notes *"
                  fullWidth
                  multiline
                  rows={3}
                  value={testForm.preparation_notes}
                  onChange={(e) => setTestForm({ ...testForm, preparation_notes: e.target.value })}
                  className="md:col-span-2"
                />
              </div>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={() => {
                  setAddDialogOpen(false);
                  setEditDialogOpen(false);
                  setMissedFields(false);
                }}
                sx={{ color: 'hsl(215, 15%, 50%)' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                sx={{
                  bgcolor: 'hsl(174, 62%, 40%)',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'hsl(174, 62%, 35%)' },
                }}
              >
                {submitting ? 'Saving...' : (editDialogOpen ? 'Save Changes' : 'Add Test')}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            PaperProps={{ sx: { borderRadius: "16px" } }}
          >
            <DialogTitle sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
              Delete Lab Test
            </DialogTitle>
            <DialogContent>
              <p className="text-[hsl(215,15%,50%)]">
                Are you sure you want to delete{" "}
                <strong>{selectedExam?.test_name}</strong>?
                This action cannot be undone.
              </p>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "hsl(215, 15%, 50%)" }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmDelete}
                disabled={submitting}
                sx={{
                  bgcolor: "hsl(0, 72%, 51%)",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "hsl(0, 72%, 45%)" },
                }}
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </AdminLayout>
  );
}