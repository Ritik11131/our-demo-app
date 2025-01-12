"use client";

import GenericMap from "@/components/generic-map";
import GenericTable from "@/components/generic-table";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardData } from "@/interface/dashboard";
import { ResponseInterface } from "@/interface/response";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { CarFront } from "lucide-react";
import React from "react";

type TableDataItem = {
  vehicleNo?: string;
  deviceId?: string;
  deviceTime?: string;
  ign?: boolean;
  extVolt?: number;
};

const Dashboard = () => {
  const { isLoading, fetchVehicleList } = useDashboard();
  const [mapCardData, setMapCardData] = React.useState<
    { key:string, name: string; count: number; colorCode: string; items: any[] }[]
  >([]);
  const [tableData, setTableData] = React.useState<TableDataItem[]>([]);
  const [markersList, setMarkersList] = React.useState<{
    colorCode: string;
    items: { name: string; latitude: number; longitude: number }[];
  }>({ colorCode: "", items: [] });

  // Memoize the dynamic card data calculation
  // const getDynamicCardsData = React.useMemo(() => {
  //   return (data: DashboardData[]) => {
  //     const statusMap = new Map<string, { count: number }>([
  //       ["running", { count: 0 }],
  //       ["stop", { count: 0 }],
  //       ["idle", { count: 0 }],
  //       ["never_connected", { count: 0 }],
  //       ["offline", { count: 0 }],
  //       ["total", { count: 0 }],
  //     ]);

  //     data.forEach((object) => {
  //       const status = object?.position?.status?.status || "Unknown";
  //       const formattedStatus = normalizeStatus(status);

  //       if (statusMap.has(formattedStatus)) {
  //         const existing = statusMap.get(formattedStatus)!;
  //         statusMap.set(formattedStatus, { count: existing.count + 1 });
  //       } else {
  //         statusMap.set("offline", {
  //           count: statusMap.get("offline")!.count + 1,
  //         });
  //       }

  //       statusMap.set("total", { count: statusMap.get("total")!.count + 1 });
  //     });

  //     return Array.from(statusMap.entries()).map(([status, { count }]) => ({
  //       key: status.replace(/\s+/g, "_").toLowerCase(),
  //       name: status
  //         .replace(/_/g, " ")
  //         .replace(/\b\w/g, (char) => char.toUpperCase())
  //         .replace(/\s+/g, " "),
  //       count,
  //       colorCode: getColorForStatus(status),
  //     }));
  //   };
  // }, []);

  const processDataWithDeviceInfo = React.useMemo(() => {
    return (data: DashboardData[]) => {
      const statusMap = new Map<
        string,
        {
          count: number;
          items: { name: string; latitude: number; longitude: number }[];
        }
      >([
        ["running", { count: 0, items: [] }],
        ["stop", { count: 0, items: [] }],
        ["idle", { count: 0, items: [] }],
        ["never_connected", { count: 0, items: [] }],
        ["offline", { count: 0, items: [] }],
        ["total", { count: 0, items: [] }],
      ]);

      data.forEach((object) => {
        const status = object?.position?.status?.status || "Unknown";
        const formattedStatus = normalizeStatus(status);

        const vehicleNo = object?.device?.vehicleNo || "Unknown";
        const latitude = object?.position?.latitude;
        const longitude = object?.position?.longitude;

        // Update status count and items
        if (statusMap.has(formattedStatus)) {
          const existing = statusMap.get(formattedStatus)!;
          existing.items.push({ name: vehicleNo, latitude, longitude });
          statusMap.set(formattedStatus, {
            count: existing.count + 1,
            items: existing.items,
          });
        } else {
          const offline = statusMap.get("offline")!;
          offline.items.push({ name: vehicleNo, latitude, longitude });
          statusMap.set("offline", {
            count: offline.count + 1,
            items: offline.items,
          });
        }

        // Update total count and items
        const total = statusMap.get("total")!;
        total.items.push({ name: vehicleNo, latitude, longitude });
        statusMap.set("total", {
          count: total.count + 1,
          items: total.items,
        });
      });

      // Return the formatted data
      return Array.from(statusMap.entries()).map(
        ([status, { count, items }]) => ({
          key: status.replace(/\s+/g, "_").toLowerCase(),
          name: status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .replace(/\s+/g, " "),
          count,
          colorCode: getColorForStatus(status),
          items, // List of devices with name, latitude, and longitude
        })
      );
    };
  }, []);

  const normalizeStatus = (status: string) => {
    const formattedStatus = status.replace(/\s+/g, "_").toLowerCase();
    if (
      ["running", "stop", "idle", "never_connected"].includes(formattedStatus)
    ) {
      return formattedStatus;
    }
    return "offline";
  };

  const statusColorMapping: { [key: string]: string } = {
    running: "#22c55e",
    stop: "#ef4444",
    idle: "#facc15",
    never_connected: "#737373",
    offline: "#6b7280",
    total: "#3b82f6",
  };

  const getColorForStatus = (status: string) => {
    return statusColorMapping[status.toLowerCase()] || "#6b7280";
  };

  // Memoize dynamic table data calculation to prevent re-renders
  const getDynamicTableData = React.useMemo(() => {
    return (data: DashboardData[]) => {
      return data.map((item, index) => {
        const {
          device: { vehicleNo, deviceId } = {},
          position: { deviceTime, details: { ign, extVolt } = {} } = {},
        } = item;

        return { vehicleNo, deviceId, deviceTime, ign, extVolt, id: index };
      });
    };
  }, []);

  const loadDashboard = async () => {
    try {
      const response: ResponseInterface = await fetchVehicleList();
      if (!response?.data || !Array.isArray(response.data)) {
        console.error("Invalid response structure");
        return;
      }

      // Memoized function to calculate the dynamic cards data
      const dynamicCardsData = processDataWithDeviceInfo(response?.data);
      setMapCardData(dynamicCardsData);
      setMarkersList({
        colorCode: dynamicCardsData[dynamicCardsData.length - 1]?.colorCode,
        items: dynamicCardsData[dynamicCardsData.length - 1]?.items,
      }); // Initially set it to Total items

      // Memoized function to calculate dynamic table data
      const dynamicTableData = getDynamicTableData(response?.data);
      setTableData(dynamicTableData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const columns = [
    { name: "NAME", uid: "vehicleNo", sortable: true },
    { name: "IMEI", uid: "deviceId", sortable: true },
    { name: "TIMESTAMP", uid: "deviceTime", sortable: true },
    { name: "IGNITION", uid: "ign" },
    { name: "BATT VOLT", uid: "extVolt" },
  ];

  const INITIAL_VISIBLE_COLUMNS = [
    "vehicleNo",
    "deviceId",
    "deviceTime",
    "ign",
    "extVolt",
  ];

  React.useEffect(() => {
    loadDashboard();
  }, [fetchVehicleList]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mapCardData.map((card, index) => (
              <Card isPressable={card?.key !== 'never_connected'} shadow="md" key={index} className="w-full max-w-[400px] mx-auto" onPress={() => {console.log(card); setMarkersList({
                colorCode: card?.colorCode,
                items: card?.items,
              })}}>
                <CardHeader className="flex gap-3">
                  <CarFront color={card?.colorCode} size={40} />
                  <div className="flex flex-col">
                    <p className="text-md">{card?.name}</p>
                    <p className="font-bold text-large text-start">{card?.count}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-16">
            <div className="col-span-1 md:col-span-7">
              <GenericTable
                columns={columns}
                data={tableData}
                initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
              />
            </div>
            <div className="col-span-1 md:col-span-5">
              <Card>
                <CardBody>
                  <GenericMap markers={markersList} />
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
