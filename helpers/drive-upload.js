import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const drive = google.drive({
    version: 'v3',
    auth: new google.auth.GoogleAuth({
        keyFile: './helpers/drive-credentials.json',
        scopes: ['https://www.googleapis.com/auth/drive']
    })
});

const uploadFile = async (file, folderId) => {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: file.originalname,
                mimeType: file.mimeType,
                parents: [folderId]
            },
            media: {
                mimeType: file.mimeType,
                body: fs.createReadStream(file.path)
            }
        });
        return response.data.id;
    } catch (err) {
        console.error(err);
    }
};

const uploadMultipleFiles = async (files, folderId) => {
    try {
        await Promise.all(files.map(async (file) => {
            await drive.files.create({
                requestBody: {
                    name: file.originalname,
                    mimeType: file.mimeType,
                    parents: [folderId]
                },
                media: {
                    mimeType: file.mimeType,
                    body: fs.createReadStream(file.path)
                }
            });
        }));
    } catch (err) {
        console.error(err);
    }
};

const deleteFile = async (fileId) => {
    await drive.files.delete({ fileId });
};

const createFolder = async (name, parentFolderId) => {
    try {
        const res = await drive.files.create({
            resource: {
                name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentFolderId]
            },
            fields: 'id'
        });
        return res.data.id;
    } catch (err) {
        console.error(err);
    }
};

const getFilesInFolder = async (folderId) => {
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents`,
            fields: 'nextPageToken, files(id, name)',
        });
        return res.data.files;
    } catch (err) {
        console.error(err);
    }
};

const renameFolder = async (folderId, newName) => {
    try {
        await drive.files.update({
            fileId: folderId,
            resource: {
                name: newName
            }
        });
    } catch (err) {
        console.error(err);
    }
};

const deleteFolderAndContents = async (folderId) => {
    try {
        // Get the list of files and subfolders in the folder
        const filesInFolder = await getFilesInFolder(folderId);

        // Delete each file and subfolder
        await Promise.all(filesInFolder.map(async (file) => {
            if (file.mimeType === 'application/vnd.google-apps.folder') {
                // Recursively delete subfolders
                await deleteFolderAndContents(file.id);
            } else {
                // Delete individual file
                await deleteFile(file.id);
            }
        }));

        // After deleting all contents, delete the folder itself
        await deleteFile(folderId);
    } catch (err) {
        console.error(err);
    }
};


const getFileById = async (fileId) => {
    try {
        const metadata = await drive.files.get({
            fileId: fileId,
            fields: 'mimeType',
        });
        const mimeType = metadata.data.mimeType;
        const stream = await drive.files.get({
            fileId: fileId,
            alt: 'media',
        }, { responseType: 'stream' });
        return { stream: stream.data, mimeType };
    } catch (err) {
        console.error(err);
    }

}

export {
    uploadFile,
    uploadMultipleFiles,
    createFolder,
    deleteFile,
    getFilesInFolder,
    renameFolder,
    deleteFolderAndContents,
    getFileById
};
