import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No se envió ninguna imagen" }, { status: 400 });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "inmuebles",
    });

    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 });
  }
}
