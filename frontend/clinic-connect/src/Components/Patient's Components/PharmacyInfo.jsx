import { Card, CardContent, Button } from "@mui/material";
import { Star, MapPin, Phone, Pill, MessageCircle, Mail } from "lucide-react";
import { useState } from "react";
import { OrderPanel } from "./OrderPanel";
import { useParams } from "react-router-dom";

export function PharmacyInfo({
  Pharmacy,
  prescriptions,
  medications,
  conversations,
  onSendMessage,
}) {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { id } = useParams();
  // const pharmacyConversationId = id;
  const handleOpenChat = () => {
    setChatOpen(true);
  };
  console.log(Pharmacy, "heeyy annie");

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="card-shadow " style={{ borderRadius: 30 }}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-secondary mb-4">
              <img
                src={Pharmacy.img}
                alt={Pharmacy.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-xl font-bold text-foreground">
              {Pharmacy.pharmacy_name}
            </h1>
            <p className=" text-[#5A78C9] font-medium mt-1 mb-0">
              DR.{Pharmacy.name}
            </p>

            <div className="flex items-center gap-1 mt-4">
              <Star className="w-5 h-5 fill-warning text-warning" />
              <span className="font-semibold text-foreground text-lg">
                {Pharmacy.rating}
              </span>
              <span className="text-muted-foreground"></span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-[#5A78C9]" />
              <span>{Pharmacy.address}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-5 h-5 text-[#5A78C9]" />
              <span>{Pharmacy.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="w-5 h-5 text-[#5A78C9]" />
              <span>{Pharmacy.email}</span>
            </div>
          </div>

          {/* Action buttons inside the card to match the design */}
          <div className="mt-6">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#76BFBB",
                color: "#fff",
                py: 1.25,
                px: 3,
                borderRadius: "0.5rem",
                fontWeight: 600,
                fontSize: "0.9rem",
                boxShadow: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                "&:hover": { backgroundColor: "#63a89e" },
              }}
              fullWidth
              onClick={() => setOrderModalOpen(true)}
              aria-label="Order Prescription"
            >
              <Pill size={18} />
              <span>Order Prescription</span>
            </Button>

            <Button
              variant="contained"
              sx={{
                mt: 1.5,
                backgroundColor: "#5A78C9",
                color: "#fff",
                py: 1.25,
                px: 3,
                borderRadius: "0.5rem",
                fontWeight: 600,
                fontSize: "0.9rem",
                boxShadow: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                "&:hover": { backgroundColor: "#4766b2" },
              }}
              fullWidth
              onClick={handleOpenChat}
              aria-label="Message Pharmacy"
            >
              <MessageCircle size={18} />
              <span>Message</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <OrderPanel
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        prescriptions={prescriptions}
        medications={medications}
        pharmacistId={id}
        conversations={conversations}
        onSendMessage={onSendMessage}
        initialConversationId={id}
        PL={1}
      />
    </div>
  );
}
