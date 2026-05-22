"use client"

import React, { useState } from 'react'
import ImageSelection from './_components/ImageSelection'
import RoomType from './_components/RoomType'
import DesignType from './_components/DesignType'
import AdditionalReq from './_components/AdditionalReq'
import axios from 'axios'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './../../../config/firebaseConfig'
import { useUser } from '@clerk/nextjs'
import CustomLoading from './_components/CustomLoading'
import AiOutputDialog from './_components/AiOutputDialog'

function CreateNew() {

    const { user } = useUser();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [aiOutputImage, setAiOutputImage] = useState();
    const [openOuputDialog, setOpenOutputDialog] = useState(false);
    const [orgImage, setOrgImage] = useState();
    
    const onHandleInputChange = (value, fieldName) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    }

    const generateAIImage = async () => {

        console.log("Form Data: ", formData);
        if (!formData.image || !formData.roomType || !formData.designType) {
            alert("Please fill in all required fields.");
            return;
        }   

        setLoading(true);

        const rawImageUrl = await saveRawImageToFirebase();

        const result = await axios.post("/api/interior-ai", {
            imageUrl: rawImageUrl,
            roomType: formData?.roomType,
            designType: formData?.designType,
            additionalReq: formData?.additionalReq,
            userEmail: user?.primaryEmailAddress?.emailAddress
        });
        setAiOutputImage(result.data.result);
        setOpenOutputDialog(true);
        setLoading(false);

        console.log("result: ", result.data);
    };

    const saveRawImageToFirebase = async () => {
        const imageFile = formData.image;

        const convertedFile = await convertImageToJpeg(imageFile);

        const fileName = `${Date.now()}_raw.jpg`;
        const imageRef = ref(storage, `interior-ai/${fileName}`);

        await uploadBytes(imageRef, convertedFile, {
            contentType: 'image/jpeg'
        });

        console.log("File Uploaded...");

        const downloadUrl = await getDownloadURL(imageRef);
        console.log(downloadUrl);

        setOrgImage(downloadUrl);

        return downloadUrl;
    }

    const convertImageToJpeg = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            img.onload = () => {
                const canvas = document.createElement("canvas");

                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");

                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(objectUrl);

                    if (!blob) {
                        reject(new Error("이미지를 JPEG로 변환하지 못했습니다."));
                        return;
                    }

                    const jpegFile = new File(
                        [blob],
                        "converted-room-image.jpg",
                        { type: "image/jpeg" }
                    );

                    resolve(jpegFile);
                }, "image/jpeg", 0.95);
            };

            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error("이미지를 불러오지 못했습니다."));
            };

            img.src = objectUrl;
        });
    }

    return (
        <div>
            <h2 style={{
                color: 'purple',
                fontWeight: 'bold',
                fontSize: '2.4rem',
                textAlign: 'center'
            }}>
                Create New
            </h2>

            {loading ? (
                <CustomLoading />
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-6'>
                    <div>
                        <ImageSelection
                            selectedFile={(value) =>
                                onHandleInputChange(value, 'image')}
                        />
                    </div>

                    <div>
                        <RoomType
                            selectedRoomType={(value) =>
                                onHandleInputChange(value, 'roomType')}
                        />

                        <DesignType
                            selectedDesignType={(value) =>
                                onHandleInputChange(value, 'designType')}
                        />

                        <AdditionalReq
                            additionalReqInput={(value) =>
                                onHandleInputChange(value, 'additionalReq')}
                        />

                        <button
                            onClick={generateAIImage}
                            className="btn btn-primary w-full"
                        >
                            Generate
                        </button>

                        <p className='text-gray-500'>
                            Each generation costs one credit
                        </p>
                    </div>
                    <AiOutputDialog
                        openDialog={openOuputDialog}
                        setOpenDialog={setOpenOutputDialog}
                        orgImage={orgImage}
                        aiImage={aiOutputImage}
                    />  
                </div>
            )}
        </div>
    )
}

export default CreateNew