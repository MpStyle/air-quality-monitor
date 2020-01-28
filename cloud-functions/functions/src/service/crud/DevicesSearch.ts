import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Device } from "../../entity/Device";
import { Service, buildResponse, buildErrorResponse } from "../../entity/Service";
import admin = require('firebase-admin');

export const devicesSearch = (logging: ILogging): Service<DevicesSearchRequest, DevicesSearchResponse> => req => {
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
                return buildResponse({ devices: [] });
            }

            return buildResponse({ devices: snapshots.docs.map(snapshot => <Device>snapshot.data()) });
        })
        .catch((err: any) => {
            logging.error("devicesSearch", `Error while searching device: ${err}`);
            return buildErrorResponse(err);
        });
};

export interface DevicesSearchRequest {
    deviceId: string;
}

export interface DevicesSearchResponse {
    devices: Device[];
}