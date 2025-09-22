
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import * as XLSX from 'xlsx';
import type { NextApiRequest } from 'next';

export const config = {
    api: {
        bodyParser: false,
    },
};

// We can't use the standard `request: Request` because we need the raw Node.js request object
// for formidable to work. We'll cast it to `any` to bypass TypeScript errors in this specific case.
export async function POST(request: any) {
    try {
        const data = await request.formData();
        const file = data.get('file');

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Process the file with xlsx
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        // In a real app, you would now process this JSON data, e.g., save it to a database.
        // For now, we'll just return a success message with the number of rows found.
        const rowCount = json.length;

        return NextResponse.json({ success: true, message: `File processed successfully. Found ${rowCount} rows.` });
    } catch (error: any) {
        console.error('File upload error:', error);
        return NextResponse.json({ success: false, message: 'File processing failed.', error: error.message }, { status: 500 });
    }
}
