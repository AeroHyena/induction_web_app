const dropbox = require("dropbox");
require("dotenv").config();
const fs = require('fs');
const path = require('path');




class BackupTool {
    constructor(parentDirectory, filesToUpload, directoriesToUpload, databasesToUpload, uploadInterval) {
        this.parentDirectory = parentDirectory;
        this.filesToUpload = filesToUpload;
        this.directoriesToUpload = directoriesToUpload;
        this.uploadInterval = uploadInterval;
        this.databasesToUpload = databasesToUpload;
        this.dropboxDirectory = "/backup";
        this.hourInMilliseconds = 3600000;
        this.DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;
        this.dropboxObject = new dropbox.Dropbox({
            accessToken: this.DROPBOX_ACCESS_TOKEN
        });
        console.log("BackupTool: Instance created, will back up files: " 
        + filesToUpload, " and directrories: " + directoriesToUpload 
        + "and databases: " + databasesToUpload + "at an interval of " + uploadInterval + " hours");
    }

    async uploadFileToDropbox(filePath, dropboxPath) {
        try {
            // Normalize the dropboxPath to use forward slashes and start with a single slash
            dropboxPath = dropboxPath.replace(/\\/g, '/').replace(/^\/*/, '/');
            const currentTime = new Date().toISOString().split('T')[0]; // Get current date in ISO format
    
            // Combine the current date with the dropboxPath
            const folderPath = `${dropboxPath}/${currentTime}`;
            const uniquePath = `${folderPath}/${path.basename(filePath)}`;
    
            const fileContents = fs.readFileSync(filePath);
    
            await this.dropboxObject.filesUpload({
                path: uniquePath,
                contents: fileContents,
            });
    
            console.log(`Uploaded: ${uniquePath}`);
        } catch (error) {
            console.error(`Error uploading ${dropboxPath}:`, error);
        }
    }
    
    
    
    // Function to upload a directory and its contents recursively
    async uploadDirectoryToDropbox(directoryPath, dropboxPath = '') {
        console.log("BackupTool: performing back ups un directory ...")
        const items = fs.readdirSync(directoryPath);
    
        for (const item of items) {
            const itemPath = path.join(directoryPath, item);
            const itemDropboxPath = path.join(dropboxPath, item);
    
            const stats = fs.statSync(itemPath);
            if (stats.isFile()) {
                // Upload the file to Dropbox
                await this.uploadFileToDropbox(itemPath, itemDropboxPath);
            } else if (stats.isDirectory()) {
                // Recursively upload the subdirectory
                await this.uploadDirectoryToDropbox(itemPath, itemDropboxPath);
            }
        }
    }


    async uploadDatabaseToDropbox(database) {
        const sourcePath = path.join(this.parentDirectory, database);
        const tempPath = path.join(this.parentDirectory, 'temp', database);
    
        // Copy the database file to the temporary directory
        fs.copyFileSync(sourcePath, tempPath);
    
        // Upload the copied database to Dropbox
        this.uploadFileToDropbox(tempPath, path.join(this.dropboxDirectory, "database", database));
    }


    async initialize() {
        if (this.filesToUpload) {
            for (let file = this.filesToUpload.length - 1; file > -1; file --) {
                setInterval(() => this.uploadFileToDropbox(path.join(this.parentDirectory, this.filesToUpload[file]),
                 path.join(this.dropboxDirectory, new Date(), `/logs/${database}`)), () => this.uploadInterval * this.hourInMilliseconds);

            };
        };

        if (this.directoriesToUpload) {
            for (let directory = this.directoriesToUpload.length - 1; directory > -1; directory--) {
                setInterval(() => this.uploadDirectoryToDropbox(path.join(this.parentDirectory, this.directoriesToUpload[directory])),
                (this.hourInMilliseconds  * this.uploadInterval));
            };
        };

        if (this.databasesToUpload) {
            for (let database = this.databasesToUpload.length - 1; database > -1; database--) {
                setInterval(() => this.uploadDatabaseToDropbox(this.databasesToUpload[database]),
                (this.hourInMilliseconds  * this.uploadInterval));
            };
        };
    }
}



module.exports = {
    BackupTool
};