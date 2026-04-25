import { useMemo, useState, useContext, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputBase,
} from "@mui/material";
import {
  FileText,
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  AlertCircle,
  X,
  Search,
} from "lucide-react";
import { UseToast } from "../../Hooks/UseToast";
import axios from "axios";
import { AuthContext } from "../../Context/AuthProviderContext";
import { PharmacyContext } from "../../Context/PharmacyProvider";
import Select from "react-select";

export function OrderPanel({ open, onClose, pharmacistId }) {
  const [step, setStep] = useState("choose");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [cart, setCart] = useState([]);
  const [availableMedications, setAvailableMedications] = useState([]);
  const [loadingMedications, setLoadingMedications] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const { toast } = UseToast();
  const { token } = useContext(AuthContext);
  const { createMedicineOrderByPrescription, createMedicineOrder } =
    useContext(PharmacyContext);

  const handleBack = () => {
    if (step === "cart") {
      setStep("ordinary");
    } else {
      setStep("choose");
      setSelectedMedications([]);
      setCart([]);
    }
  };

  const handleClose = () => {
    setStep("choose");
    setSelectedPrescription(null);
    setCart([]);
    setSelectedMedications([]);
    onClose();
  };

  const addToCart = (medication) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.medication.id === medication.id,
      );
      if (existing) {
        return prev.map((item) =>
          item.medication.id === medication.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { medication, quantity: 1 }];
    });
  };

  const removeFromCart = (medicationId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medication.id === medicationId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.medication.id === medicationId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
      return prev.filter((item) => item.medication.id !== medicationId);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (sum, item) => sum + item.medication.price * item.quantity,
      0,
    );
  };

  const handleOrderPrescription = async () => {
    if (!selectedPrescription || !pharmacistId) return;
    try {
      await createMedicineOrderByPrescription(
        pharmacistId,
        selectedPrescription.prescription_id,
      );
      toast({
        title: "Prescription Order Placed",
        description: `Your refill request has been sent to ${selectedPrescription.doctor_name}.`,
      });
      handleClose();
    } catch (err) {
      toast({
        title: "Order Failed",
        description:
          err.response?.data?.message || "Failed to place prescription order",
      });
    }
  };

  const handleCheckout = async () => {
    if (!pharmacistId) return;
    try {
      const medicines = cart.map((item) => ({
        medicine_id: item.medication.id,
        quantity: item.quantity,
      }));
      await createMedicineOrder(pharmacistId, medicines);
      toast({
        title: "Order Placed Successfully",
        description: `${
          cart.length
        } items ordered. Total: $${getTotalPrice().toFixed(2)}`,
      });
      handleClose();
    } catch (err) {
      console.error("Failed to place order:", err);
      toast({
        title: "Order Failed",
        description: err.response?.data?.message || "Failed to place order",
      });
    }
  };

  const fetchPrescriptions = useCallback(async () => {
    if (!token) return;
    setLoadingPrescriptions(true);
    try {
      const response = await axios.get("/api/v1/prescriptions/patient", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch prescriptions:", err);
      setPrescriptions([]);
    } finally {
      setLoadingPrescriptions(false);
    }
  }, [token]);

  const handleMedicationSelect = (selectedOptions) => {
    setSelectedMedications(selectedOptions || []);
    // Update cart with selected medications, default quantity 1
    const newCart = (selectedOptions || []).map((option) => ({
      medication: {
        id: option.value,
        name: option.label,
        price: option.price,
        description: option.side_effects || "No description",
        inStock: option.quantity > 0,
      },
      quantity: 1,
    }));
    setCart(newCart);
  };

  useEffect(() => {
    const fetchMedications = async () => {
      if (step !== "ordinary" || !pharmacistId || !token) {
        setAvailableMedications([]);
        return;
      }
      setLoadingMedications(true);
      try {
        const response = await axios.get(
          `/api/v1/available-medications/${pharmacistId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setAvailableMedications(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch medications:", err);
        setAvailableMedications([]);
      } finally {
        setLoadingMedications(false);
      }
    };
    fetchMedications();
  }, [step, pharmacistId, token]);

  useEffect(() => {
    if (step === "prescription") {
      fetchPrescriptions();
    }
  }, [step, fetchPrescriptions]);

  const medicationOptions = useMemo(() => {
    return availableMedications.map((med) => ({
      value: med.medicine_id,
      label: med.name,
      price: med.price,
      quantity: med.quantity,
      side_effects: med.side_effects,
    }));
  }, [availableMedications]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-2xl",
        sx: { borderRadius: "1rem", minHeight: "60vh", maxHeight: "85vh" },
      }}
    >
      <DialogTitle className="flex items-center gap-3 border-b border-gray-100 pb-4">
        {step !== "choose" && (
          <IconButton
            onClick={handleBack}
            size="small"
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </IconButton>
        )}
        <span className="text-xl font-bold text-gray-900">
          {step === "choose" && "Place an Order"}
          {step === "prescription" && "Select Prescription"}
          {step === "ordinary" && "Select Medications"}
          {step === "cart" && "Review Cart"}
        </span>
        <IconButton
          onClick={handleClose}
          size="small"
          className="ml-auto hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="overflow-y-auto p-6 min-h-[40vh]">
        {step === "choose" && (
          <div className="grid gap-4 py-2">
            <Card
              className="cursor-pointer border-2 border-transparent hover:border-[#76BFBB] transition-all duration-200 hover:shadow-lg group"
              sx={{ borderRadius: "1rem" }}
            >
              <CardContent
                className="p-5 flex items-center gap-4"
                onClick={() => setStep("prescription")}
              >
                <div className="w-14 h-14 rounded-xl bg-[#76BFBB] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    Order Prescription
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Refill from your existing prescriptions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-2 border-transparent hover:border-[#5A78C9] transition-all duration-200 hover:shadow-lg group"
              sx={{ borderRadius: "1rem" }}
            >
              <CardContent
                className="p-5 flex items-center gap-4"
                onClick={() => setStep("ordinary")}
              >
                <div className="w-14 h-14 rounded-xl bg-[#5A78C9] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    Over the Counter Order
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Browse and order over-the-counter items
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "prescription" && (
          <div className="space-y-3 py-2">
            {loadingPrescriptions ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading prescriptions...</p>
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No prescriptions found</p>
              </div>
            ) : (
              prescriptions.map((prescription) => (
                <Card
                  key={prescription.prescription_id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedPrescription?.prescription_id ===
                    prescription.prescription_id
                      ? "border-2 border-[#76BFBB] ring-4 ring-[#76BFBB]/20"
                      : "border-2 border-transparent hover:border-[#76BFBB]"
                  }`}
                  onClick={() => setSelectedPrescription(prescription)}
                  sx={{ borderRadius: "0.75rem" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {prescription.medications.map((pres) => (
                          <div key={pres.medicine_id}>
                            <h4 className="font-semibold text-gray-900">
                              {pres.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {pres.dose}
                            </p>
                          </div>
                        ))}
                        {selectedPrescription?.prescription_id ===
                          prescription.prescription_id && (
                          <Check className="w-4 h-4 text-[#76BFBB]" />
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Prescribed by {prescription.doctor_name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {selectedPrescription && (
              <Button
                onClick={handleOrderPrescription}
                variant="contained"
                fullWidth
                className="mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold normal-case"
                sx={{
                  borderRadius: "0.75rem",
                  textTransform: "none",
                  backgroundColor: "#76BFBB",
                  "&:hover": { backgroundColor: "#63a89e" },
                  fontFamily: "Alan Sans, sans-serif",
                }}
              >
                Order Refill
              </Button>
            )}
          </div>
        )}

        {step === "ordinary" && (
          <div className="space-y-3 py-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Medications
              </label>
              {loadingMedications ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading medications...</p>
                </div>
              ) : (
                <Select
                  isMulti
                  options={medicationOptions}
                  value={selectedMedications}
                  onChange={handleMedicationSelect}
                  placeholder="Choose medications..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: "0.5rem",
                      borderColor: "#d1d5db",
                      minHeight: "50px",
                      "&:hover": {
                        borderColor: "#9ca3af",
                      },
                    }),
                    multiValue: (provided) => ({
                      ...provided,
                      backgroundColor: "#dbeafe",
                    }),
                    multiValueLabel: (provided) => ({
                      ...provided,
                      color: "#1e40af",
                    }),
                    multiValueRemove: (provided) => ({
                      ...provided,
                      color: "#1e40af",
                      "&:hover": {
                        backgroundColor: "#bfdbfe",
                        color: "#1d4ed8",
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      maxHeight: "400px", // Increase menu height
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      maxHeight: "400px", // Ensure menu list height
                    }),
                  }}
                />
              )}
            </div>

            {selectedMedications.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  Selected Medications:
                </h4>
                {selectedMedications.map((med) => (
                  <Card key={med.value} sx={{ borderRadius: "0.5rem" }}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {med.label}
                          </h5>
                          <p className="text-sm text-gray-500">${med?.price}</p>
                        </div>
                        <Chip
                          label={`${med.quantity} in stock`}
                          size="small"
                          color={med.quantity > 0 ? "success" : "error"}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="sticky bottom-0 bg-white pt-4 border-t mt-4">
                <Button
                  onClick={() => setStep("cart")}
                  variant="contained"
                  fullWidth
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold normal-case"
                  sx={{
                    borderRadius: "0.75rem",
                    textTransform: "none",
                    backgroundColor: "#3b82f6",
                    "&:hover": { backgroundColor: "#2563eb" },
                  }}
                >
                  View Cart ({cart.length} items) - $
                  {getTotalPrice().toFixed(2)}
                </Button>
              </div>
            )}
          </div>
        )}

        {step === "cart" && (
          <div className="space-y-3 py-2">
            {cart.map((item) => (
              <Card key={item.medication.id} sx={{ borderRadius: "0.75rem" }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.medication.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ${item?.medication?.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-600">
                        ${(item.medication.price * item.quantity).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.medication.id)}
                          className="hover:bg-gray-200"
                        >
                          <Minus className="h-3 w-3" />
                        </IconButton>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <IconButton
                          size="small"
                          onClick={() => addToCart(item.medication)}
                          className="hover:bg-gray-200"
                        >
                          <Plus className="h-3 w-3" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-green-600">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                variant="contained"
                fullWidth
                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold normal-case"
                sx={{
                  borderRadius: "0.75rem",
                  textTransform: "none",
                  backgroundColor: "#16a34a",
                  "&:hover": { backgroundColor: "#15803d" },
                }}
              >
                Place Order
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
