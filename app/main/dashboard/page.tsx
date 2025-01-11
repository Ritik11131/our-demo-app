"use client";

import GenericMap from "@/components/generic-map";
import GenericTable from "@/components/generic-table";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardData } from "@/interface/dashboard";
import { ResponseInterface } from "@/interface/response";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import { CarFront } from "lucide-react";
import React from "react";

const Dashboard = () => {
  const { isLoading, fetchVehicleList } = useDashboard();
  const [cardsData, setCardsData] = React.useState<
    { name: string; count: number; colorCode: string }[]
  >([]);
  const [tableData, setTableData] = React.useState<DashboardData | null>(null);
  const [mapData, setMapData] = React.useState<DashboardData | null>(null);

  const statusColorMapping = {
    running: "green",
    never_connected: "grey",
    idle: "orange",
    offline: "red", // Default color for 'offline' status
  };

  React.useEffect(() => {
    loadDashboard();
  }, [fetchVehicleList]);

  const getDynamicCardsData = React.useMemo(() => {
    return (data: DashboardData[]) => {
      // Initialize the fixed statuses with 0 count using an array of tuples
      const statusMap = new Map<string, { count: number }>([
        ["running", { count: 0 }],
        ["stop", { count: 0 }],
        ["idle", { count: 0 }],
        ["never_connected", { count: 0 }],
        ["offline", { count: 0 }],
        ["total", { count: 0 }],
      ]);

      // Iterate through the data and update the statusMap
      data.forEach((object: DashboardData) => {
        const status = object?.position?.status?.status || "Unknown";

        // Normalize the status value
        const formattedStatus = normalizeStatus(status);

        // Update the count for the normalized status
        if (statusMap.has(formattedStatus)) {
          const existing = statusMap.get(formattedStatus)!;
          statusMap.set(formattedStatus, { count: existing.count + 1 });
        } else {
          // If a status isn't recognized, assign it to 'offline'
          statusMap.set("offline", {
            count: statusMap.get("offline")!.count + 1,
          });
        }

        // Increment the total count
        statusMap.set("total", { count: statusMap.get("total")!.count + 1 });
      });

      // Convert the Map to an array for rendering
      return Array.from(statusMap.entries()).map(([status, { count }]) => ({
        key: status.replace(/\s+/g, "_").toLowerCase(),
        name: status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
          .replace(/\s+/g, " "),
        count,
        colorCode: getColorForStatus(status),
      }));
    };
  }, []);

  // Helper function to normalize the status values
  const normalizeStatus = (status: string) => {
    // Normalize the status by checking and replacing as needed
    const formattedStatus = status.replace(/\s+/g, "_").toLowerCase();

    // Group statuses that are not explicitly handled into 'offline'
    if (
      ["running", "stop", "idle", "never_connected"].includes(formattedStatus)
    ) {
      return formattedStatus;
    }
    return "offline"; // If status is anything else, treat it as 'offline'
  };

  // Function to return color code based on the status
  const getColorForStatus = (status: string) => {
    const statusColorMapping: { [key: string]: string } = {
      running: "#22c55e",
      stop: "#ef4444",
      idle: "#a16207",
      never_connected: "#737373",
      offline: "#6b7280",
      total: "#3b82f6", // You can customize this color as needed
    };

    return statusColorMapping[status.toLowerCase()] || "#6b7280";
  };

  const loadDashboard = async () => {
    try {
      const response: ResponseInterface = await fetchVehicleList();
      if (!response?.data || !Array.isArray(response.data)) {
        console.error("Invalid response structure");
        return;
      }

      // Call the memoized function to calculate the dynamic cards data
      const dynamicCardsData = getDynamicCardsData(response.data);

      setCardsData(dynamicCardsData);
    } catch (error) {
      console.error("Failed to fetch parents:", error);
    }
  };


  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "ROLE", uid: "role", sortable: true },
    { name: "LICENSE NO", uid: "licenseNumber" },
    { name: "EMAIL", uid: "email" },
    { name: "CONTACT NO", uid: "contactNumber", sortable: true },
  ];

  const INITIAL_VISIBLE_COLUMNS = ["id","name", "email","contactNumber","licenseNumber","role"];


  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cardsData.map((card, index) => (
              <Card key={index} className="w-full max-w-[400px] mx-auto">
                <CardHeader className="flex gap-3">
                  <CarFront color={card.colorCode} size={40} />
                  <div className="flex flex-col">
                    <p className="text-md">{card.name}</p>
                    <h4 className="font-bold text-large">{card.count}</h4>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-16">
            <div className="col-span-1 md:col-span-7">
              <GenericTable columns={columns} data={[]}  initialVisibleColumns={INITIAL_VISIBLE_COLUMNS} />
            </div>
            <div className="col-span-1 md:col-span-5">
              <Card>
                <CardBody>
                  <GenericMap />
                </CardBody>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
