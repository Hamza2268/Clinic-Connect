import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AsyncSelect from "react-select/async";
import styles from "./Inventory.module.css";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { MedicalOrderContext } from "../../Context/MedicalOrderContext";
import { PrescriptionContext } from "../../Context/PrescriptionContext";
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

function Inventory() {
  const { searchValue = "" } = useOutletContext() || {};
  const [sortBy, setSortBy] = useState("name");
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [formData, setFormData] = useState({
    quantity: "",
    price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    pharmacistInventory,
    getPharmacistInventory,
    addPharmacistInventoryItem,
    updatePharmacistInventoryItem,
    deletePharmacistInventoryItem,
  } = useContext(MedicalOrderContext);
  const { getMedications } = useContext(PrescriptionContext);
  useEffect(() => {
    // BACKEND FETCH WILL GO HERE
    getPharmacistInventory(1, 50, sortBy, "asc");
  }, [sortBy]);

  // Map backend inventory shape to UI-friendly shape
  const inventoryList = (pharmacistInventory || []).map((item) => ({
    id: item.medicine_id?.toString() || String(item.id || ""),
    name: item.name || "",
    company: item.company || "",
    sideEffects: item.side_effects || item.sideEffects || "",
    quantity: Number(item.quantity) || 0,
    price: Number(item.price) || 0,
    raw: item,
  }));

  const filteredMedicines = inventoryList
    .filter((m) => m.name.toLowerCase().includes(searchValue.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "quantity") return a.quantity - b.quantity;
      return a.name.localeCompare(b.name);
    });

  // Load medications from catalog (using fake data for now)
  const loadMedicationCatalog = async (inputValue) => {
    // Don't search if less than 2 characters
    if (!inputValue || inputValue.length < 2) {
      return [];
    }
    // Use backend medication search
    try {
      const results = await getMedications(inputValue);
      if (!Array.isArray(results)) return [];
      return results.map((med) => ({
        value: med.id ?? med.medication_id ?? med.med_id ?? med.value,
        label:
          med.name ??
          med.med_name ??
          med.medication_name ??
          med.title ??
          String(med.value ?? ""),
        medicationData: med,
      }));
    } catch (err) {
      console.error("Error loading medications from backend:", err);
      return [];
    }
  };

  const handleEdit = (id) => {
    const medicine = inventoryList.find((m) => m.id === id);
    if (!medicine) return;
    setEditingMedicine(medicine.raw);
    setSelectedMedication({
      value: medicine.id,
      label: medicine.name,
      medicationData: medicine,
    });
    setFormData({
      quantity: String(medicine.quantity || ""),
      price: String(medicine.price || ""),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // find medicine id
    const med = inventoryList.find((m) => m.id === id);
    if (!med) return;
    //if (!confirm(`Delete ${med.name}?`)) return;
    try {
      await deletePharmacistInventoryItem(med.id);
      toast.success("Inventory item deleted");
    } catch (err) {
      toast.error("Failed to delete inventory item");
    }
  };

  const handleAddNew = () => {
    setEditingMedicine(null);
    setSelectedMedication(null);
    setFormData({
      quantity: "",
      price: "",
    });
    setShowModal(true);
  };

  const handleMedicationSelect = (option) => {
    setSelectedMedication(option);
  };

  const handleSubmit = async () => {
    // allow editing even if selectedMedication is null (use editingMedicine)
    const medSource =
      selectedMedication?.medicationData ||
      selectedMedication ||
      editingMedicine;

    if (
      !medSource ||
      !formData.quantity ||
      (editingMedicine && !formData.price)
    ) {
      const msg = editingMedicine
        ? "Please select a medication and fill in quantity and price"
        : "Please select a medication and fill in quantity";
      alert(msg);
      return;
    }

    const medicationData = medSource;

    const payload = {
      name: medicationData.name || medicationData.label || "",
      quantity: Number(formData.quantity),
      ...(editingMedicine ? { price: Number(formData.price) } : {}),
      side_effects:
        medicationData.sideEffects || medicationData.side_effects || "",
    };

    setIsSubmitting(true);
    try {
      console.log(
        "Inventory submit payload:",
        payload,
        "editing:",
        !!editingMedicine
      );
      if (editingMedicine) {
        const res = await updatePharmacistInventoryItem(
          editingMedicine.medicine_id,
          payload
        );
        if (!res) {
          toast.error("Failed to update inventory item");
        } else {
          toast.success("Inventory item updated");
        }
      } else {
        // extract medication id from selectedMedication
        const medId =
          (selectedMedication?.medicationData?.id ??
            selectedMedication?.medicationData?.medication_id ??
            selectedMedication?.medicationData?.med_id ??
            selectedMedication?.value) ||
          null;
        if (!medId) {
          toast.error("Please select a valid medication from the catalog");
        } else {
          const res = await addPharmacistInventoryItem(medId, payload);
          if (!res) {
            toast.error("Failed to add inventory item");
          } else {
            toast.success("Inventory item added");
          }
        }
      }

      setShowModal(false);
      setSelectedMedication(null);
      setFormData({ quantity: "", price: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save inventory item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory</h1>
          <p className={styles.subtitle}>
            Manage medicines available in the pharmacy
          </p>
        </div>

        <button className={styles.addBtn} onClick={handleAddNew}>
          <Plus size={16} />
          Add Medicine
        </button>
      </div>

      {/* SORTING */}
      <div className={styles.controls}>
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="quantity">Quantity</option>
          </select>
        </label>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Side Effects</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMedicines.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.company}</td>
                <td className={styles.sideEffects}>{m.sideEffects}</td>
                <td>{m.quantity}</td>
                <td>${m.price}</td>
                <td className={styles.actions}>
                  <button onClick={() => handleEdit(m.id)}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(m.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMedicines.length === 0 && (
          <p className={styles.empty}>No medicines found</p>
        )}
      </div>

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
                {editingMedicine ? "Edit Medicine" : "Add Medicine"}
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
                <label>Select Medication *</label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadMedicationCatalog}
                  value={selectedMedication}
                  onChange={handleMedicationSelect}
                  placeholder="Search medication from catalog..."
                  styles={selectStyles}
                  isClearable
                  isDisabled={!!editingMedicine}
                  noOptionsMessage={({ inputValue }) =>
                    !inputValue || inputValue.length < 2
                      ? "Type at least 2 characters to search"
                      : `No medications found for "${inputValue}"`
                  }
                  loadingMessage={() => "Searching medications..."}
                />
                {editingMedicine && (
                  <small
                    style={{
                      color: "#6b7280",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    Medication cannot be changed when editing. Delete and add
                    new instead.
                  </small>
                )}
              </div>

              {/* Show medication details if selected */}
              {selectedMedication && (
                <div className={styles.medicationInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Company:</span>
                    <span>{selectedMedication.medicationData.company}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Side Effects:</span>
                    <span>{selectedMedication.medicationData.sideEffects}</span>
                  </div>
                </div>
              )}

              <div className={styles.formField}>
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter quantity"
                />
              </div>

              {/* <div className={styles.formField}>
                <label>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter price per unit"
                />
              </div> */}

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
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingMedicine
                    ? "Update"
                    : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
