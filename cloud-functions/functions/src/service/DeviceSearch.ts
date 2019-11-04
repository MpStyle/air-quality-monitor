import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import { Device } from "../entity/Device";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";
import admin = require('firebase-admin');

export const deviceSearch = (logging: ILogging) => (req: DeviceSearchRequest): Promise<DeviceSearchResponse> => {
    logging.info("deviceSearch", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.DEVICE);

    if (req.deviceId) {
        collectionRef = collectionRef.where('deviceId', '==', req.deviceId);
    }

    return collectionRef.get()
        .then(snapshots => {
            if (!snapshots || snapshots.docs.length === 0) {
                logging.debug("deviceSearch", "No device found");
                return Promise.resolve(<DeviceSearchResponse>{ payload: [] });
            }

            return Promise.resolve({
                payload: snapshots.docs.map(snapshot => <Device>snapshot.data())
            });
        })
        .catch((err: any) => {
            logging.error("deviceSearch", `Error while searching device: ${err}`);
            return Promise.resolve({ error: err })
        });
};

export interface DeviceSearchRequest extends ServiceRequest {
    deviceId: string;
    token: string;
}

export interface DeviceSearchResponse extends ServiceResponse<Device[]> {
}