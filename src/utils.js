import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log(__dirname)

export async function obtenerArchivosDeUploads() {
    const uploadsPath = path.join(__dirname, "../uploads");
    try {
        return await fs.readdir(uploadsPath);
    } catch (e) {
        return [];
    }
}

export default __dirname