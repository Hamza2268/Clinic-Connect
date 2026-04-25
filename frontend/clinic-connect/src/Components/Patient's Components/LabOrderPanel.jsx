import { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import {
  FlaskConical,
  Clipboard,
  ArrowLeft,
  Plus,
  Check,
  AlertCircle,
  X,
  Calendar,
} from "lucide-react";
import { UseToast } from "../../Hooks/UseToast";
import { LabContext } from "../../Context/LabProvider";
import { AuthContext } from "../../Context/AuthProviderContext";
import AsyncSelect from "react-select/async";
import style from "../../Style/Profile.module.css";
import { useParams } from "react-router-dom";

export function LabOrderPanel({
  open,
  onClose,
  prescribedTests: initialPrescribedTests,
  availableTests,
  labtechId,
}) {
  const { id } = useParams();
  const [step, setStep] = useState("choose");
  const [selectedTest, setSelectedTest] = useState(null);
  const { toast } = UseToast();
  const {
    getAvailableTestsForLabtech,
    createLabRequest,
    getRequiredLabTestsForPatient,
    updateLabTest,
    assignLabTestToTechnician,
  } = useContext(LabContext);
  const { user } = useContext(AuthContext);
  const [fetchedAvailableTests, setFetchedAvailableTests] = useState([]);
  const [prescribedTests, setPrescribedTests] = useState(
    initialPrescribedTests || [],
  );

  const loadOptions = async (inputValue) => {
    const data = await getAvailableTestsForLabtech(labtechId, inputValue);
    setFetchedAvailableTests(data);
    return data.map((test) => ({
      value: test.test_id,
      label: test.test_name,
    }));
  };

  useEffect(() => {
    if (labtechId) {
      loadOptions("").then(() => {});
    }
  }, [labtechId]);

  useEffect(() => {
    if (step === "prescribed") {
      getRequiredLabTestsForPatient()
        .then(setPrescribedTests)
        .catch(console.error);
    }
  }, [step, getRequiredLabTestsForPatient]);

  const HandlePrescribedTestSelection = async (test) => {
    try {
      await assignLabTestToTechnician(test.labtest_id, id);
      toast({
        title: "Lab Test Assigned",
        description: `has been assigned successfully.`,
      });
      // Close panel after successful assignment
      handleClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to assign lab test.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setStep("choose");
  };

  const handleClose = () => {
    setStep("choose");
    setSelectedTest(null);
    onClose();
  };

  const handleAddTest = async (test) => {
    try {
      await createLabRequest(test.test_id, id);
      toast({
        title: "Lab Test Ordered",
        description: `${test.test_name} has been ordered successfully.`,
      });
      // Close panel after successful order
      handleClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to order lab test.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
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
          {step === "choose" && "Schedule Lab Tests"}
          {step === "prescribed" && "Prescribed Tests"}
          {step === "ordinary" && "Available Tests"}
        </span>
        <IconButton
          onClick={handleClose}
          size="small"
          className="ml-auto hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="overflow-y-auto p-6">
        {step === "choose" && (
          <div className="grid gap-4 py-2">
            <Card
              className="cursor-pointer border-2 border-transparent hover:border-[#5A78C9] transition-all duration-200 hover:shadow-lg group"
              onClick={() => setStep("prescribed")}
              sx={{ borderRadius: "1rem" }}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#5A78C9] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clipboard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    Prescribed Tests
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Schedule tests ordered by your doctor
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-2 border-transparent hover:border-[#76BFBB] transition-all duration-200 hover:shadow-lg group"
              onClick={() => setStep("ordinary")}
              sx={{ borderRadius: "1rem" }}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#76BFBB] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    Browse Tests
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Order routine checkups and screenings
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "prescribed" && (
          <div className="space-y-3 py-2">
            {prescribedTests.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No prescribed tests found</p>
              </div>
            ) : (
              prescribedTests.map((test) => (
                <Card
                  key={test.id}
                  className="cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-[#76BFBB]"
                  onClick={() => HandlePrescribedTestSelection(test)}
                  sx={{ borderRadius: "0.75rem" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {test.test_name}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {test.reference_range}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Ordered by {test.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>Ordered: {test.date}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {step === "ordinary" && (
          <div className="space-y-3 py-2">
            <AsyncSelect
              loadOptions={loadOptions}
              placeholder="Search tests..."
              isClearable
              cacheOptions
              defaultOptions
            />
            {fetchedAvailableTests.map((test) => {
              return (
                <Card
                  key={test.test_id}
                  className="overflow-hidden"
                  sx={{ borderRadius: "0.75rem" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {test.test_name}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {test.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-teal-600 font-semibold">
                            ${test.fees.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleAddTest(test)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          sx={{ textTransform: "none", borderRadius: "0.5rem" }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
