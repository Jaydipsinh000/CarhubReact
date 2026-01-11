import React from "react";
import { ArrowLeft, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = ({ onBack }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6"
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-gray-900 mb-4">
                        Terms & <span className="text-blue-600">Conditions</span>
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Please read these terms carefully before using our services.
                    </p>
                </div>

                {/* CONTENT */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-10">
                        {/* Section 1 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Shield size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 font-display">
                                    1. Driver's License & Eligibility
                                </h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed pl-14">
                                The renter must possess a valid driving license held for at least
                                2 years. International renters must present a valid International
                                Driving Permit (IDP) along with their original license. The
                                minimum age for renting a vehicle is 21 years.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <CheckCircle size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 font-display">
                                    2. Fuel Policy
                                </h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed pl-14">
                                Vehicles are supplied with a full tank of fuel and must be
                                returned with a full tank. If the vehicle is returned with less
                                fuel, a refueling charge will apply in addition to the cost of
                                the missing fuel.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                                    <AlertTriangle size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 font-display">
                                    3. Cancellation Policy
                                </h2>
                            </div>
                            <div className="text-gray-600 leading-relaxed pl-14 space-y-2">
                                <p>
                                    • Cancellations made <strong>48 hours</strong> or more before
                                    pickup: <strong>Full Refund</strong>.
                                </p>
                                <p>
                                    • Cancellations made between 24-48 hours: <strong>50% Refund</strong>.
                                </p>
                                <p>
                                    • Cancellations made less than 24 hours: <strong>No Refund</strong>.
                                </p>
                            </div>
                        </section>

                        {/* Section 4: Prohibited Uses */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pl-14">
                                4. Prohibited Uses
                            </h2>
                            <ul className="list-disc list-outside pl-18 space-y-2 text-gray-600 marker:text-blue-500">
                                <li className="ml-14">Using the vehicle for illegal purposes or racing.</li>
                                <li className="ml-14">Driving under the influence of alcohol or drugs.</li>
                                <li className="ml-14">Sub-renting the vehicle to third parties.</li>
                                <li className="ml-14">Driving off-road or on unpaved surfaces.</li>
                            </ul>
                        </section>
                    </div>

                    {/* FOOTER NOTE */}
                    <div className="bg-gray-50 p-8 text-center border-t border-gray-100">
                        <p className="text-gray-500 text-sm">
                            Effective Date: January 1, 2024. These terms are subject to change
                            without prior notice.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
