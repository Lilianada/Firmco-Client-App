import React, { useState } from 'react';
import Table from './SharesTable';
import BondTable from './BondTable';
import TermTable from './TermsTable';
import IPOsTable from './IPOsTable';

const tabsInfo = [
    { name: 'My Bonds', content: <BondTable/> },
    { name: 'My Terms Deposit', content: <TermTable/> },
    { name: 'My IPOs', content: <IPOsTable/> },
    { name: 'My Shares', content: <Table/> },
];

export default function Tabs() {
    // State to keep track of the current active tab
    const [activeTab, setActiveTab] = useState(tabsInfo[0].name); // Default to 'My IPOs' as it's initially true

    function handleTabClick(tabName) {
        setActiveTab(tabName);
    }

    // Find the tab object to display its content
    const activeTabInfo = tabsInfo.find(tab => tab.name === activeTab);

    return (
        <div>
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={activeTab}
                    onChange={(e) => handleTabClick(e.target.value)}
                >
                    {tabsInfo.map((tab) => (
                        <option key={tab.name} value={tab.name}>
                            {tab.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex" aria-label="Tabs">
                        {tabsInfo.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => handleTabClick(tab.name)}
                                className={`w-1/4 py-4 px-1 text-center text-sm font-medium 
                                    ${tab.name === activeTab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                                    border-b-2 cursor-pointer`}
                                aria-current={tab.name === activeTab ? 'page' : undefined}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
            <div className="mt-4 w-full overflow-scroll">
                {activeTabInfo && activeTabInfo.content}
            </div>
        </div>
    );
}
