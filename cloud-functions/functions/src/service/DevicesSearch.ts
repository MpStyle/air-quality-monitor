import { ILogging } from "../book/Logging";
import { Collections } from "../entity/Collections";
import { Device } from "../entity/Device";
import { ServiceRequest } from "../entity/ServiceRequest";
import { ServiceResponse } from "../entity/ServiceResponse";
import admin = require('firebase-admin');

export const devicesSearch = (logging: ILogging) => (req: DevicesSearchRequest): Promise<DevicesSearchResponse> => {
    logging.info("devicesSearch", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.DEVICE);

    if (req.deviceId) {
        collectionRef = collectionRef.where('deviceId', '==', req.deviceId);
    }

    return collectionRef.get()
        .then(snapshots => {
            if (!snapshots || snapshots.docs.length === 0) {
                logging.debug("devicesSearch", "No device found");
                return Promise.resolve(<DevicesSearchResponse>{ payload: [] });
            }

            return Promise.resolve({
                payload: snapshots.docs.map(snapshot => <Device>snapshot.data())
            });
        })
        .catch((err: any) => {
            logging.error("devicesSearch", `Error while searching device: ${err}`);
            return Promise.resolve({ error: err })
        });
};

export interface DevicesSearchRequest extends ServiceRequest {
    deviceId: string;
}

export interface DevicesSearchResponse extends ServiceResponse<Device[]> {
}