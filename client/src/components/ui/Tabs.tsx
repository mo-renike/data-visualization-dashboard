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
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`flex-1 py-2 text-center ${
              activeTab === tab.value
                ? "border-b-2 border-brand-blue text-brand-blue"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
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
