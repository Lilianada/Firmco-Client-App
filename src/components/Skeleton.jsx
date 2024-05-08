import React, { useState } from "react";
import {
  Bars3Icon,
  DocumentChartBarIcon,
  CalendarIcon,
  CreditCardIcon,
  HomeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const navigation = [
  { name: "Home", to: "/dashboard", icon: HomeIcon, current: true },
  {
    name: "My Accounts",
    to: "/dashboard/my-accounts",
    icon: UserGroupIcon,
    count: 5,
    current: false,
  },
  {
    name: "Bonds",
    to: "/dashboard/bonds",
    icon: DocumentChartBarIcon,
    count: 3,
    current: false,
  },
  {
    name: "Term Deposits",
    to: "/dashboard/fixed-term-deposit",
    icon: CreditCardIcon,
    current: false,
  },
  {
    name: "Ipos",
    to: "/dashboard/ipos",
    icon: CalendarIcon,
    current: false,
  },
  {
    name: "Market Analysis",
    to: "/dashboard/market-analysis",
    icon: ArrowTrendingUpIcon,
    current: false,
  },
  {
    name: "Settings",
    to: "/dashboard/settings",
    icon: CalendarIcon,
    current: false,
  },
];

export default function Skeleton() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
      />

      <div className="lg:pl">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 "
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="h-6 w-px bg-gray-900/10 lg:hidden"
            aria-hidden="true"
          />

          {/* Header */}
          <Header />
        </div>

        <main className="pt-6 sm:pt-8 pb-10 lg:px-4 sm:px-6 bg-slate-50 min-h-[calc(100vh_-_64px)]">
          <div className="px-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
