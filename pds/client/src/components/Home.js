import React from 'react'
import { User, Lock, Phone, Building2 } from 'lucide-react';
export default function Home() {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
                            <Building2 className="w-10 h-10 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
