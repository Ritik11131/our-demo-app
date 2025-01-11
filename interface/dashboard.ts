export interface DeviceDetails {
    speedLimit: number;
    lastOdometer: number;
    lastEngineHours: number;
}

export interface Device {
    deviceId: string;
    vehicleNo: string;
    vehicleType: number;
    deviceType: number;
    id: number;
    details: DeviceDetails;
}

export interface PositionStatus {
    status: string;
}

export interface PositionDetails {
    armed: boolean;
    avl06: number;
    avl09: string;
    avl10: string;
    charge: boolean;
    distance: number;
    engHours: number;
    extVolt: number;
    ign: boolean;
    intVolt: number;
    motion: boolean;
    rssi: number;
    sat: number;
    sos: boolean;
    totalDistance: number;
    vDuration: number;
    vStatus: string;
}

export interface Position {
    status: PositionStatus;
    protocol: string;
    servertime: string;
    deviceTime: string;
    valid: number;
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    altitude: number;
    accuracy: number;
    details: PositionDetails;
}

export interface Validity {
    installationOn: string;
    nextRechargeDate: string;
    customerRechargeDate: string;
}

export interface DashboardData {
    device: Device;
    position: Position;
    validity: Validity;
    parking: null | unknown; // Adjust the type if more information about parking becomes available
}
