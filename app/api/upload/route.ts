import { NextRequest, NextResponse } from 'next/server';
import { upload } from '@/lib/multer';
import nextConnect from 'next-connect';

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Something went wrong! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.single('file')); // name="file" in formData

apiRoute.post((req: any, res: any) => {
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
});

export const POST = (req: NextRequest, res: NextResponse) => {
    return apiRoute(req, res);
};
