import { useState } from "react";
import { Card, CardContent, Button } from "@mui/material";
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  TestTubeDiagonal,
} from "lucide-react";
import { LabOrderPanel } from "./LabOrderPanel";
import { ChatSideBar } from "./ChatSideBar";

export function LabInfo({
  Lab,
  conversations,
  onSendMessage,
  labTests,
  availableTests,
  labtechId,
}) {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  if (!Lab) return null;

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="card-shadow" style={{ borderRadius: 30 }}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-secondary mb-4">
              {Lab.img ? (
                <img
                  src={Lab.img}
                  alt={Lab.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>

            <h1 className="text-xl font-bold text-foreground">
              {Lab.lab_name || "No Name"}
            </h1>

            <div className="flex items-center gap-1 mt-4">
              <Star className="w-5 h-5 fill-warning text-warning" />
              <span className="font-semibold text-foreground text-lg">
                {Lab.rating ?? "N/A"}
              </span>
              <span className="text-muted-foreground">
                ({Lab.reviewCount ?? 0} reviews)
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {Lab.address && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-[#5A78C9]" />
                <span>{Lab.address}</span>
              </div>
            )}

            {Lab.phone && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-[#5A78C9]" />
                <span>{Lab.phone}</span>
              </div>
            )}
          </div>

          {/* Action buttons moved here */}
          <div className="mt-6">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#76BFBB",
                color: "#fff",
                py: 1.25,
                px: 3,
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "0.95rem",
                boxShadow: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                "&:hover": { backgroundColor: "#63a89e" },
              }}
              fullWidth
              onClick={() => setOrderModalOpen(true)}
              aria-label="Schedule Test"
            >
              <TestTubeDiagonal size={18} />
              <span>Schedule Test</span>
            </Button>

            <Button
              variant="contained"
              sx={{
                mt: 1.5,
                backgroundColor: "#5A78C9",
                color: "#fff",
                py: 1.25,
                px: 3,
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "0.95rem",
                boxShadow: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                "&:hover": { backgroundColor: "#4766b2" },
              }}
              fullWidth
              onClick={() => setChatOpen(true)}
              aria-label="Message Lab"
            >
              <MessageCircle size={18} />
              <span>Message</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <LabOrderPanel
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        prescribedTests={labTests}
        availableTests={availableTests}
        labtechId={labtechId}
      />

      <ChatSideBar
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        conversations={conversations}
        onSendMessage={onSendMessage}
        initialConversationId={labtechId}
        PL={0}
      />
    </div>
  );
}
