import { ILogging } from "../../book/Logging";
import { Collections } from "../../entity/Collections";
import { Device } from "../../entity/Device";
import { PagedRequest } from "../../entity/PagedRequest";
import { buildErrorResponse, buildResponse, Service } from "../../entity/Service";
import admin = require('firebase-admin');

export const devicesSearch = (logging: ILogging): Service<DevicesSearchRequest, DevicesSearchResponse> => req => {
    logging.info("devicesSearch", "Starts");

    const db = admin.firestore();
    let collectionRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = db.collection(Collections.DEVICE);

    if (req.deviceId) {
        collectionRef = collectionRef.where('deviceId', '==', req.deviceId);
    }

    if (req.offset) {
        collectionRef = collectionRef.startAt(req.offset);
    }

    if (req.limit) {
        collectionRef = collectionRef.endAt(req.offset ? req.offset + req.limit : req.limit);
    }

    collectionRef = collectionRef.where('enabled', '==', true);

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

export interface DevicesSearchRequest extends PagedRequest {
    deviceId: string;
}

export interface DevicesSearchResponse {
    devices: Device[];
}