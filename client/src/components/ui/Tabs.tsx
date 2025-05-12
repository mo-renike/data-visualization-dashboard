import React, { useState } from "react";

interface Tab {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface CustomTabsProps {
  tabs: Tab[];
  defaultValue?: string;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].value);

  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {activeTab === "login"
          ? "Sign in to your account"
          : "Create your account"}
      </h2>
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`flex-1 py-2 text-center ${
              activeTab === tab.value
                ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>{" "}
      <br />
      <div>
        {tabs.map(
          (tab) =>
            activeTab === tab.value && (
              <div key={tab.value} className="tab-content">
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default CustomTabs;
