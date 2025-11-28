import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { ensureDir } from "../../utils/file.js";
import { db } from "../../config/db.js";

export const ReportsService = {

    // ----------------------------------------------------
    // INTERNAL METHOD — GENERATE PDF WITH PUPPETEER
    // ----------------------------------------------------
    async generatePDF(htmlContent, outputFileName) {
        const tmpDir = "uploads/reports/";
        ensureDir(tmpDir);

        const filePath = path.join(tmpDir, outputFileName);

        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        await page.pdf({
            path: filePath,
            format: "A4",
            printBackground: true
        });

        await browser.close();

        return filePath;
    },

    // ----------------------------------------------------
    // PARCEL REPORT
    // ----------------------------------------------------
    async parcelReport(parcelId) {
        const q = `
            SELECT id, parcel_no, owner, size, land_use,
                ST_AsGeoJSON(geom) AS geometry, schema_name
            FROM parcels
            WHERE id = $1
        `;
        const r = await db.query(q, [parcelId]);

        if (r.rowCount === 0) return null;

        const parcel = r.rows[0];

        const html = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial; padding: 20px; }
                        h1 { color: #333; }
                        hr { margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <h1>Parcel Report</h1>
                    <hr/>
                    <p><strong>Parcel Number:</strong> ${parcel.parcel_no}</p>
                    <p><strong>Owner:</strong> ${parcel.owner}</p>
                    <p><strong>Size:</strong> ${parcel.size}</p>
                    <p><strong>Land Use:</strong> ${parcel.land_use}</p>
                    <p><strong>Schema:</strong> ${parcel.schema_name}</p>
                </body>
            </html>
        `;

        const fileName = `parcel_${parcelId}_${Date.now()}.pdf`;

        return await this.generatePDF(html, fileName);
    },

    // ----------------------------------------------------
    // APPLICATION REPORT
    // ----------------------------------------------------
    async applicationReport(appId) {
        const r = await db.query(`
            SELECT id, applicant_name, phone, email,
                   parcel_id, status, schema_name, created_at
            FROM applications
            WHERE id = $1
        `, [appId]);

        if (r.rowCount === 0) return null;

        const app = r.rows[0];

        const html = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial; padding: 20px; }
                        h1 { color: #333; }
                        hr { margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <h1>Application Report</h1>
                    <hr/>
                    <p><strong>Applicant:</strong> ${app.applicant_name}</p>
                    <p><strong>Phone:</strong> ${app.phone}</p>
                    <p><strong>Email:</strong> ${app.email}</p>
                    <p><strong>Status:</strong> ${app.status}</p>
                    <p><strong>Parcel ID:</strong> ${app.parcel_id}</p>
                    <p><strong>Schema:</strong> ${app.schema_name}</p>
                </body>
            </html>
        `;

        const fileName = `application_${appId}_${Date.now()}.pdf`;

        return await this.generatePDF(html, fileName);
    },

    // ----------------------------------------------------
    // LISTING REPORT
    // ----------------------------------------------------
    async listingReport(id) {
        const r = await db.query(`
            SELECT id, title, description, price, status,
                   parcel_id, schema_name, created_at
            FROM listings
            WHERE id = $1
        `, [id]);

        if (r.rowCount === 0) return null;

        const L = r.rows[0];

        const html = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial; padding: 20px; }
                        h1 { color: #333; }
                        hr { margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <h1>Listing Brochure</h1>
                    <hr/>
                    <p><strong>Title:</strong> ${L.title}</p>
                    <p><strong>Description:</strong> ${L.description}</p>
                    <p><strong>Price:</strong> GHS ${L.price}</p>
                    <p><strong>Status:</strong> ${L.status}</p>
                    <p><strong>Parcel ID:</strong> ${L.parcel_id}</p>
                    <p><strong>Schema:</strong> ${L.schema_name}</p>
                </body>
            </html>
        `;

        const fileName = `listing_${id}_${Date.now()}.pdf`;

        return await this.generatePDF(html, fileName);
    }
};
