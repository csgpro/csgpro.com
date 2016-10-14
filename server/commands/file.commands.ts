// libs
import * as azure from 'azure-storage';

// app
import { contentTypes } from '../shared/content-types';

const AZURE_STORAGE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;
const AZURE_STORAGE_ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY;
export const MAX_FILE_SIZE = 4 * 1024 * 1024; // ~4MB
const CONTAINER = 'uploads';

const blobService = azure.createBlobService(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY);

let uploadsContainer: azure.BlobService.ContainerResult;

blobService.createContainerIfNotExists(CONTAINER, {
    publicAccessLevel: 'blob'
}, (error, result, response) => {
    if (error) {
        console.error(error);
    } else {
        if (result) {
            console.log(`created ${CONTAINER} container`);
        } else {
            console.log(`using existing ${CONTAINER} container`);
        }
        uploadsContainer = result;
    }
});

export function uploadFile(file: NodeJS.ReadableStream, filename: string) {

    let contentType = contentTypes[filename.slice(filename.lastIndexOf('.') + 1)];
    // Prevent duplicate filename
    let accessConditions = azure['AccessCondition'].generateIfNoneMatchCondition('*');

    function upload(file, filename, cb: (error, result?) => any) {

        blobService.doesBlobExist(CONTAINER, filename, (error, results, response) => {
            if (error) {
                cb(error);
                return;
            }

            if (results.exists) {
                filename = _incrementFilename(filename);
                return upload(file, filename, cb);
            }

            blobService.createBlockBlobFromStream(CONTAINER, filename, file, file['_data']['byteLength'], { accessConditions, contentSettings: { contentType } }, (error, result, response) => {

                if (error) {
                    cb(error);
                    return;
                }

                cb(null, result);

            });
        });
    }

    return new Promise<azure.BlobService.BlobResult>((resolve, reject) => {

        upload(file, filename, (error, result) => {

            if (error) {
                reject(error);
            } else {
                resolve(result);
            }

        });
    });
}

export function getUrl(host: string, filename: string) {
    let protocol = 'https';
    if (!/^www.csgpro.com$/.test(host)) {
        protocol = 'http';
    }
    return `${protocol}://${host}/file/${filename}`;
}

export function getBlobUrl(filename: string) {
    return blobService.getUrl(CONTAINER, filename);
}

export function doesBlobExist(filename: string, callback: (err: any, result: azure.BlobService.BlobResult, response: any) => void) {
    return blobService.doesBlobExist(CONTAINER, filename, callback);
}

export function getBlobProperties(filename, callback: (err: any, result: azure.BlobService.BlobResult, response: any) => void) {
    return blobService.getBlobProperties(CONTAINER, filename, callback);
}

function _incrementFilename(filename: string) {

    let name = filename.slice(0, filename.lastIndexOf('.'));
    let ext = filename.slice(filename.lastIndexOf('.') + 1);
    let num = 1;

    if (/-\d+$/.test(name)) {
        let numPosition = name.lastIndexOf('-') + 1;
        let numStr = name.slice(numPosition);
        num = Number(numStr) + 1;
        name = name.slice(0, numPosition) + num;
    } else {
        name = name + '-' + num;
    }

    return `${name}.${ext}`;

}