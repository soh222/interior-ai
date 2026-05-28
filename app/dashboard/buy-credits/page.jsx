"use client"
import React, { useState, useContext } from 'react'
import { PayPalButtons } from "@paypal/react-paypal-js";
import { UserDetailContext } from '../../_context/UserDetailContext';
import { useRouter } from 'next/navigation';
import { db } from '../../../config/db';
import { Users } from '../../../config/schema';

function BuyCredits() {

    // 사용자가 선택한 크레딧 옵션 저장
    const [selectedOption, setSelectedOption] = useState({})
    const {userDetail, setUserDetail} = useContext(UserDetailContext);
    const router = useRouter();
    // 크레딧 구매 옵션 배열
    const creditsOption = [
        {
            credits: 5,
            amount: 0.99
        },
        {
            credits: 10,
            amount: 1.99
        },
        {
            credits: 25,
            amount: 3.99
        },
        {
            credits: 50,
            amount: 6.99
        },
        {
            credits: 100,
            amount: 9.99
        },
    ]
    
    const onPaymentSuccess = async () => {
        console.log("Payment successful!")
        const result = await db.update(Users)
        .set({
            credits: userDetail?.credits + selectedOption?.credits
        }).returning({id: Users.id});
        
        if (result) {
            setUserDetail(prev => ({...prev, credits: userDetail?.credits + selectedOption?.credits}));
            router.push('/dashboard');
        }
    }
    

    return (
        <div>

            {/* 페이지 제목 */}
            <div className='text-2xl font-bold text-center mb-6'>
                Buy More Credits
            </div>

            {/* 크레딧 카드 목록 */}
            <div className='flex flex-row gap-4 justify-center'>

                {creditsOption.map((item, index) => (

                    <div
                        key={index}
                        className='card bg-base-100 w-48 shadow-xl'
                    >

                        <div className='card-body p-4 place-items-center'>

                            {/* 크레딧 수 */}
                            <h2 className='card-title'>
                                {item.credits} credits
                            </h2>

                            {/* 가격 */}
                            <p>for ${item.amount}</p>

                            {/* 선택 버튼 */}
                            <button
                                className='btn btn-primary'
                                onClick={() => setSelectedOption(item)}
                            >
                                Buy
                            </button>

                        </div>
                    </div>

                ))}

            </div>
            <div className="max-w-3xl mx-auto mt-4 px-4">
                {selectedOption?.amount && 
                    <PayPalButtons style={{ layout: "horizontal", width: "100%" }}
                        onApprove={() => onPaymentSuccess()}
                        onCancel={() => console.log("Payment cancelled")}
                        createOrder={(data, actions) => {
                            return actions?.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: selectedOption?.amount?.toFixed(2), currency_code: "USD"
                                        }
                                    }
                                ]
                            })
                        }}
                    />
                }
            </div>

        </div>
    )
}

export default BuyCredits