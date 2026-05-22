import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

import { storage } from "../../../config/firebaseConfig";
import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

export async function POST(request) {
    try {
        const { imageUrl, roomType, designType, additionalReq, userEmail } = await request.json();

        const input = {
            image: imageUrl,
            prompt: `A ${roomType} with a ${designType} style interior ${additionalReq || ""}`,
            image_num_inference_steps: 20
        };
        const output = await replicate.run(
            "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
            { input }
        );

        const outputUrl = Array.isArray(output) ? output[0] : output;

        const base64Image = await ConvertToBase64(outputUrl);

        const fileName = `${Date.now()}_ai.png`;
        const storageRef = ref(storage, "interior-ai/" + fileName);

        await uploadString(storageRef, base64Image, "data_url");

        const downloadUrl = await getDownloadURL(storageRef);

        const dbResult = await db.insert(AiGeneratedImage).values({
            roomType: roomType,
            designType: designType,
            orgImage: imageUrl,
            aiImage: downloadUrl,
            userEmail: userEmail
        }).returning({ id: AiGeneratedImage.id });

        console.log("DB Insert Result:", dbResult);

        return NextResponse.json({
            result: downloadUrl
        });

    } catch (error) {
        console.log("API Error:", error);

        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}

async function ConvertToBase64(imageUrl) {
    const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64ImageRaw = Buffer.from(resp.data).toString("base64");

    return "data:image/png;base64," + base64ImageRaw;
}