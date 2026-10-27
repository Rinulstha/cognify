import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      {/* Tabs Header */}
      <nav className="flex gap-2 border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative px-2 md:px-6 pb-4 text-sm font-semibold rounded-t-xl transition-all duration-300 whitespace-nowrap
                ${
                  isActive
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }
              `}
            >
              <span className="relative z-10">{tab.label}</span>

              {/* Active underline */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[250px] transition-all duration-300">
        {tabs.map((tab) =>
          tab.name === activeTab ? (
            <div
              key={tab.name}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {tab.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Tabs;