"use client"
import { useState } from "react";
import { FiPlusSquare, FiUser, FiUsers } from "react-icons/fi";
import TabUser from "../Tab/TabUser";
import TabAbsen from "../Tab/TabAbsen";
import TabPegawai from "../Tab/TabPegawai";
import TabSlug from "../Tab/TabSlug";

const Menu = () => {
    const [activeTab, setActiveTab] = useState("profil");

    const renderTabContent = () => {
        switch (activeTab) {
            case "profil": return <TabUser />;
            case "absen": return <TabAbsen />;
            case "pegawai": return <TabPegawai />;
            default: return <TabUser />;
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Tab Content - Full height with padding bottom untuk navigation */}
            <div className="h-full pt-17 overflow-auto">
                {renderTabContent()}
            </div>

            {/* Tab Navigation - Fixed di bagian bawah */}
            <div className="border-t border-gray-200 py-2 flex justify-around px-4">
                <button onClick={() => setActiveTab("profil")} className={`flex flex-col items-center p-2 ${activeTab === "profil" ? "text-blue-600" : "text-gray-500"}`}>
                    <FiUser className="text-xl" />
                    <span className="text-xs mt-1">Profil</span>
                </button>
                <button onClick={() => setActiveTab("absen")} className={`flex flex-col items-center p-2 ${activeTab === "absen" ? "text-blue-600" : "text-gray-500"}`}>
                    <FiPlusSquare className="text-xl" />
                    <span className="text-xs mt-1">Absen</span>
                </button>
                <button onClick={() => setActiveTab("pegawai")} className={`flex flex-col items-center p-2 ${activeTab === "pegawai" ? "text-blue-600" : "text-gray-500"}`}>
                    <FiUsers className="text-xl" />
                    <span className="text-xs mt-1">Pegawai</span>
                </button>
            </div>
        </div>
    );
};

export default Menu;