import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AsyncSelect from "react-select/async";
import styles from "./LabInventory.module.css";
import { Plus, Pencil, Trash2, X, FlaskConical } from "lucide-react";
import { LabContext } from "../../Context/LabProvider";
import { toast } from "sonner";

// Custom styles for react-select
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(99, 102, 241, 0.1)" : "none",
    borderRadius: "8px",
    padding: "2px",
    fontSize: "14px",
    "&:hover": {
      borderColor: "#6366f1",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#6366f1"
      : state.isFocused
      ? "#eef2ff"
      : "white",
    color: state.isSelected ? "white" : "#374151",
    cursor: "pointer",
    fontSize: "14px",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
  }),
};

function LabInventory() {
  const { searchValue = "" } = useOutletContext() || {};

  const [sortBy, setSortBy] = useState("test_name");

  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({
    total_count: "",
    fees: "",
  });

  const {
    getLabExamination,
    getAvailableLabTests,
    labtests,
    loading,
    updateLabTest,
    deleteLabTest,
    addLabTestToInventory,
  } = useContext(LabContext);

  useEffect(() => {
    getAvailableLabTests();
  }, []);

  // Load lab tests from catalog for AsyncSelect
  const loadLabTests = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];

    try {
      const results = await getLabExamination(inputValue);
      const list = Array.isArray(results) ? results : [];
      return list.map((test) => ({
        value: test.test_id ?? test.id,
        label: test.test_name ?? test.name,
        raw: test,
      }));
    } catch (err) {
      console.error("Error loading lab tests:", err);
      return [];
    }
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    setSelectedTest({
      value: test.test_id,
      label: test.test_name,
      raw: test,
    });
    setFormData({
      total_count: test.total_count,
      fees: test.fees,
    });
    setShowModal(true);
  };

  const handleDelete = async (test_id) => {
    try {
      await deleteLabTest(test_id);
      toast.success("Lab test deleted successfully");
      // Refresh the list
      await getAvailableLabTests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lab test");
    }
  };

  const handleAddNew = () => {
    setEditingTest(null);
    setSelectedTest(null);
    setFormData({
      total_count: "",
      fees: "",
    });
    setShowModal(true);
  };

  const handleTestSelect = (option) => {
    setSelectedTest(option);
  };

  const handleSubmit = async () => {
    if (!selectedTest || !formData.total_count || !formData.fees) {
      toast.error("Please select a lab test and fill in all fields");
      return;
    }

    try {
      if (editingTest) {
        // Update existing test
        await updateLabTest(editingTest.test_id, {
          fees: Number(formData.fees),
          total_count: Number(formData.total_count),
        });
        toast.success("Lab test updated successfully");
      } else {
        // Add new test
        await addLabTestToInventory(selectedTest.value, {
          fees: Number(formData.fees),
          total_count: Number(formData.total_count),
        });
        toast.success("Lab test added successfully");
      }

      // Refresh the list
      await getAvailableLabTests();

      // Close modal and reset
      setShowModal(false);
      setSelectedTest(null);
      setFormData({
        total_count: "",
        fees: "",
      });
      setEditingTest(null);
    } catch (err) {
      console.error(err);
      toast.error(
        editingTest ? "Failed to update lab test" : "Failed to add lab test"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sort lab tests
  const sortedTests = labtests
    ? [...labtests].sort((a, b) => {
        if (sortBy === "total_count") {
          return a.total_count - b.total_count;
        }
        return (a.test_name || "").localeCompare(b.test_name || "");
      })
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <FlaskConical
              size={32}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Lab Test Inventory
          </h1>
          <p className={styles.subtitle}>
            Manage lab tests available in the laboratory
          </p>
        </div>

        <button className={styles.addBtn} onClick={handleAddNew}>
          <Plus size={16} />
          Add Lab Test
        </button>
      </div>

      {/* SORTING */}
      <div className={styles.controls}>
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="test_name">Test Name</option>
            <option value="total_count">Available Count</option>
          </select>
        </label>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Warnings</th>
              <th>Preparation Instructions</th>
              <th>Available</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedTests.map((t) => (
              <tr key={t.test_id}>
                <td>{t.test_name}</td>
                <td className={styles.sideEffects}>{t.warnings || "-"}</td>
                <td className={styles.sideEffects}>
                  {t.preparation_notes || "-"}
                </td>
                <td>{t.total_count || 0}</td>
                <td>${t.fees || 0}</td>
                <td className={styles.actions}>
                  <button onClick={() => handleEdit(t)}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(t.test_id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedTests.length === 0 && (
          <p className={styles.empty}>No lab tests found</p>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitlem}>
                {editingTest ? "Edit Lab Test" : "Add Lab Test"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={styles.closeBtnmodal}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.formFields}>
              <div className={styles.formField}>
                <label>Select Lab Test *</label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadLabTests}
                  value={selectedTest}
                  onChange={handleTestSelect}
                  placeholder="Search lab test from catalog..."
                  styles={selectStyles}
                  isClearable
                  isDisabled={!!editingTest}
                  noOptionsMessage={({ inputValue }) =>
                    !inputValue || inputValue.length < 2
                      ? "Type at least 2 characters to search"
                      : `No lab tests found for "${inputValue}"`
                  }
                  loadingMessage={() => "Searching lab tests..."}
                />
                {editingTest && (
                  <small
                    style={{
                      color: "#6b7280",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    Lab test cannot be changed when editing. Delete and add new
                    instead.
                  </small>
                )}
              </div>

              {/* Show test details if selected */}
              {selectedTest && (
                <div className={styles.medicationInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Warnings:</span>
                    <span>{selectedTest?.raw?.warnings || "None"}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Preparation:</span>
                    <span>
                      {selectedTest?.raw?.preparation_notes || "None"}
                    </span>
                  </div>
                </div>
              )}

              <div className={styles.formField}>
                <label>Available Count *</label>
                <input
                  type="number"
                  name="total_count"
                  value={formData.total_count}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter available test count"
                />
              </div>

              <div className={styles.formField}>
                <label>Price *</label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter price per test"
                />
              </div>

              <div className={styles.formActions}>
                <button
                  onClick={() => setShowModal(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Processing..." : editingTest ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabInventory;
