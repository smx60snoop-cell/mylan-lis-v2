import fs from "fs";
import path from "path";

export const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

export const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.error("Failed to delete file:", err);
    }
};

export const getFileExtension = (filename) => {
    return path.extname(filename).toLowerCase();
};
