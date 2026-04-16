import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import RescueRequestCard from "../components/RescueRequestCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:5000");

const getLocationName = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    const data = await res.json();
    return data.display_name || "Unknown location";
  } catch (error) {
    console.error("Error getting location name:", error);
    return "Unknown location";
  }
};

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(2);
};

function RescuerDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [activeRescues, setActiveRescues] = useState([]);
  const [rescuerLocation, setRescuerLocation] = useState(null);
  const prevNewCountRef = useRef(0);
  const audioRef = useRef(null);

  const newRequestCount = requests.filter((request) => request.isNew).length;

  useEffect(() => {
    audioRef.current = new Audio("/mixkit-software-interface-start-2574.wav");
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRescuerLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting rescuer location:", error);
      }
    );
  }, []);

  useEffect(() => {
    if (!rescuerLocation) return;

    const fetchReports = async () => {
      try {
        const [openResponse, acceptedResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/reports/open"),
          axios.get("http://localhost:5000/api/reports/accepted"),
        ]);

        const formattedOpenRequests = await Promise.all(
          openResponse.data.map(async (report) => {
            const locationName = await getLocationName(report.lat, report.lng);
            const distance = calculateDistance(
              rescuerLocation.lat,
              rescuerLocation.lng,
              report.lat,
              report.lng
            );

            return {
              rescueId: report.rescueId,
              description: report.description,
              location: locationName,
              distance: `${distance} km`,
              status: report.status,
              isNew: Date.now() - new Date(report.createdAt).getTime() < 5 * 60 * 1000,
            };
          })
        );

        const formattedAcceptedRequests = await Promise.all(
          acceptedResponse.data.map(async (report) => {
            const locationName = await getLocationName(report.lat, report.lng);
            const distance = calculateDistance(
              rescuerLocation.lat,
              rescuerLocation.lng,
              report.lat,
              report.lng
            );

            return {
              rescueId: report.rescueId,
              description: report.description,
              location: locationName,
              distance: `${distance} km`,
              status: report.status,
              isNew: false,
            };
          })
        );

        setRequests(formattedOpenRequests);
        setActiveRescues(formattedAcceptedRequests);
      } catch (error) {
        console.error("Error fetching rescue reports:", error);
      }
    };

    fetchReports();
  }, [rescuerLocation]);

  useEffect(() => {
    socket.on("new_rescue_request", async (newRequest) => {
      if (!rescuerLocation) return;

      const alreadyExists = requests.some(
        (request) => request.rescueId === newRequest.rescueId
      );

      if (alreadyExists) return;

      const locationName = await getLocationName(newRequest.lat, newRequest.lng);
      const distance = calculateDistance(
        rescuerLocation.lat,
        rescuerLocation.lng,
        newRequest.lat,
        newRequest.lng
      );

      const formattedRequest = {
        rescueId: newRequest.rescueId,
        description: newRequest.description,
        location: locationName,
        distance: `${distance} km`,
        status: newRequest.status,
        isNew: true,
      };

      setRequests((prev) => [formattedRequest, ...prev]);
    });

    return () => {
      socket.off("new_rescue_request");
    };
  }, [requests, rescuerLocation]);

  useEffect(() => {
    if (newRequestCount > prevNewCountRef.current) {
      toast.success("New rescue request received!");

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.log("Audio play blocked:", error);
        });
      }
    }

    prevNewCountRef.current = newRequestCount;
  }, [newRequestCount]);

  const handleAccept = async (rescueId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/reports/${rescueId}/accept`
      );

      const acceptedRequest = requests.find(
        (request) => request.rescueId === rescueId
      );

      setRequests((prev) =>
        prev.filter((request) => request.rescueId !== rescueId)
      );

      if (acceptedRequest) {
        setActiveRescues((prev) => [
          { ...acceptedRequest, status: "Accepted", isNew: false },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error("Error accepting report:", error);
      toast.error("Failed to accept request.");
    }
  };

  const handleReject = async (rescueId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/reports/${rescueId}/reject`
      );

      setRequests((prev) =>
        prev.filter((request) => request.rescueId !== rescueId)
      );
    } catch (error) {
      console.error("Error rejecting report:", error);
      toast.error("Failed to reject request.");
    }
  };

  const handleComplete = async (rescueId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/reports/${rescueId}/complete`
      );

      setActiveRescues((prev) =>
        prev.filter((request) => request.rescueId !== rescueId)
      );
    } catch (error) {
      console.error("Error completing report:", error);
      toast.error("Failed to complete rescue.");
    }
  };

  const handleMarkAsSeen = (rescueId) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.rescueId === rescueId
          ? { ...request, isNew: false }
          : request
      )
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('/frame-with-dogs-vector-white-background_53876-127700.avif')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
        backgroundSize: "cover",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          backgroundColor: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.3)",
          margin: "0 auto",
          padding: "16px",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: "16px",
            padding: "20px 24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: "0",
                  fontSize: "32px",
                  color: "#1f2937",
                }}
              >
                Nearby Rescue Requests
              </h1>

              <p
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "16px",
                  color: "#6b7280",
                }}
              >
                Live alerts for nearby animal rescue emergencies
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#f6e8d8",
                color: "#d97706",
                padding: "10px 16px",
                borderRadius: "999px",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Notifications: {newRequestCount}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            marginBottom: "18px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "18px",
              color: "#111827",
              textAlign: "center",
              fontSize: "24px",
            }}
          >
            Active Rescue
          </h2>

          {activeRescues.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center" }}>
              No active rescues yet.
            </p>
          ) : (
            activeRescues.map((request) => (
              <RescueRequestCard
                key={request.rescueId}
                request={request}
                onAccept={() => {}}
                onReject={() => {}}
                onMarkAsSeen={() => {}}
                onComplete={handleComplete}
              />
            ))
          )}
        </div>

        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "18px",
              color: "#111827",
              textAlign: "center",
              fontSize: "24px",
            }}
          >
            Incoming Requests
          </h2>

          {requests.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center" }}>
              No open rescue requests found.
            </p>
          ) : (
            requests.map((request) => (
              <RescueRequestCard
                key={request.rescueId}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
                onMarkAsSeen={handleMarkAsSeen}
                onComplete={() => {}}
              />
            ))
          )}
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default RescuerDashboardPage;
