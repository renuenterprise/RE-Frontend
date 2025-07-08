"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaTshirt,
  FaUser,
  FaSignOutAlt,
  FaPlus,
  FaSearch,
  FaFilter,
  FaTimes,
  FaClipboardList,
  FaUsers,
  FaTags,
  FaTag,
  FaChartBar,
  FaBell,
  FaEdit,
  FaClock,
  FaShoppingBag,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBars,
  FaArrowUp,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import Image from "next/image";
import Logo from "../../public/RELogo.png"

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("today");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOrderView, setSelectedOrderView] = useState("new"); // 'new' or 'processing'

  const lastScrollY = useRef(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScrollTopNew, setShowScrollTopNew] = useState(false);
  const [showScrollTopProcessing, setShowScrollTopProcessing] = useState(false);
  const newOrdersRef = useRef(null);
  const processingOrdersRef = useRef(null);

  // Sample data - replace with real data from your API
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customerName: "John Doe",
      phone: "+91 98765 43210",
      address: "123 Main St, Jaleshwar",
      items: ["Shirts - 3", "Pants - 2"],
      source: "walk-in",
      status: "new",
      amount: 250,
      date: "2025-01-05",
      time: "10:30 AM",
      deliveryDate: "2025-01-07",
      assignedTo: null,
      ready: false,
    },
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      phone: "+91 87654 32109",
      address: "456 Oak Ave, Jaleshwar",
      items: ["Bedsheet - 1", "Curtains - 2"],
      source: "phone",
      status: "processing",
      amount: 180,
      date: "2025-01-05",
      time: "11:15 AM",
      deliveryDate: "2025-01-07",
      assignedTo: "Delivery Boy 1",
      ready: true,
    }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Toggle navbar visibility
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (newOrdersRef.current) {
        setShowScrollTopNew(newOrdersRef.current.scrollTop > 200);
      }
      if (processingOrdersRef.current) {
        setShowScrollTopProcessing(processingOrdersRef.current.scrollTop > 200);
      }
    };

    const newEl = newOrdersRef.current;
    const processingEl = processingOrdersRef.current;

    newEl?.addEventListener("scroll", handleScroll);
    processingEl?.addEventListener("scroll", handleScroll);

    return () => {
      newEl?.removeEventListener("scroll", handleScroll);
      processingEl?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const getActiveFilters = () => {
    const filters = [];
    if (selectedSource !== "all")
      filters.push({ type: "source", value: selectedSource });
    if (selectedDateRange !== "all")
      filters.push({ type: "date", value: selectedDateRange });
    if (searchTerm) filters.push({ type: "search", value: searchTerm });
    return filters;
  };

  const removeFilter = (filterType) => {
    if (filterType === "source") setSelectedSource("all");
    if (filterType === "date") setSelectedDateRange("all");
    if (filterType === "search") setSearchTerm("");
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource =
      selectedSource === "all" || order.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  const newOrders = filteredOrders.filter((order) => order.status === "new");
  const processingOrders = filteredOrders.filter(
    (order) => order.status === "processing"
  );

  const getSourceIcon = (source) => {
    switch (source) {
      case "walk-in":
        return "🚶";
      case "phone":
        return "📞";
      case "online":
        return "💻";
      default:
        return "📋";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateOrderStatus = (orderId, field, value) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, [field]: value } : order
      )
    );
  };

  const markOrderReady = (orderId) => {
    updateOrderStatus(orderId, "ready", true);
  };

  const assignDelivery = (orderId, deliveryPerson) => {
    updateOrderStatus(orderId, "assignedTo", deliveryPerson);
  };

  const markDeliveryDone = (orderId) => {
    updateOrderStatus(orderId, "status", "completed");
  };

  const OrderCard = ({ order }) => {
    return (
      <div className="border border-b-2 border-b-gray-300 border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Header with checkbox, order ID, and customer info */}
        <div
          key={order.id}
          className="p-4 hover:bg-gray-50 transition duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  {order.id}
                </span>
                <span className="text-lg">{getSourceIcon(order.source)}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <h4 className="font-medium text-gray-900 mb-1">
                {order.customerName}
              </h4>
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center">
                  <FaPhoneAlt className="h-3 w-3 mr-2" />
                  {order.phone}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="h-3 w-3 mr-2" />
                  {order.address}
                </div>
                <div className="flex items-center">
                  <FaClock className="h-3 w-3 mr-2" />
                  {order.time} - {order.date}
                </div>
                <div className="flex items-center text-sm text-gray-800 mt-4">
                  <FaTshirt className="h-3 w-3 mr-2" />
                  Items: {order.items.join(", ")}
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-6">
              <div className="h-[28px] flex flex-row justify-end items-center space-x-2 mb-2">
                <button className="text-gray-600 hover:text-gray-800 transition duration-200 flex items-center gap-4 flex-1 rounded-md p-2 border border-gray-200 bg-white shadow-sm active:scale-[95%]">
                  <p className="md:block hidden">Edit order details</p>{" "}
                  <FaEdit className="h-4 w-4" />
                </button>
              </div>

              <div className="h-[28px] flex flex-row justify-end items-center space-x-2 mb-2">
                <button className="text-white transition duration-200 flex items-center gap-4 flex-1 rounded-md p-2 bg-green-600 hover:bg-green-700 shadow-sm active:scale-[95%]">
                  <p className="md:block hidden">Generate invoice</p>{" "}
                  <FaFileInvoiceDollar className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-6 gap-0 min-h-[80px]">
          {/* Order Column */}
          <div className="col-span-1 border-t md:border-r border-gray-200 p-3 bg-white">
            <div className="text-xs text-gray-500 mb-2">Final Amount</div>
            <div className="text-sm font-medium text-gray-900">
              ₹{order.amount}
            </div>
            <div className="text-xs text-gray-500">{order.date}</div>
          </div>

          {/* Pickup Column */}
          <div className="col-span-1 border-t md:border-r border-gray-200 p-3 bg-white">
            <div className="text-xs text-gray-500 mb-2">Pickup date</div>
            <div className="text-sm font-medium text-gray-900">
              {order.date}
            </div>
            <div className="text-xs text-gray-500">{order.time}</div>
          </div>

          {/* Delivery Column */}
          <div className="col-span-1 border-t md:border-r border-gray-200 p-3 bg-white">
            <div className="text-xs text-gray-500 mb-2">Delivery date</div>
            <div className="text-sm font-medium text-gray-900">
              {order.deliveryDate}
            </div>
            <div
              className={`text-xs ${
                order.assignedTo ? "text-green-600" : "text-red-500"
              }`}
            >
              {order.assignedTo
                ? `Assigned to: ${order.assignedTo}`
                : "Not assigned"}
            </div>
          </div>

          {/* Order Ready Column */}
          <div className="col-span-1 border-t md:border-r border-gray-200 p-3 bg-white flex flex-col items-center justify-start">
            <div className="text-xs text-gray-500 mb-2">Order ready</div>
            {order.ready ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">
                  Ready
                </span>
              </div>
            ) : (
              <button
                onClick={() => markOrderReady(order.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200 active:scale-[95%]"
              >
                Mark Ready
              </button>
            )}
          </div>

          {/* Assign Delivery Column */}
          <div className="col-span-1 border-t md:border-r border-gray-200 p-3 bg-white flex flex-col items-center justify-start">
            <div className="text-xs text-gray-500 mb-2">Assign delivery</div>
            {order.assignedTo ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700 font-medium">
                  Assigned
                </span>
              </div>
            ) : order.ready ? (
              <button
                onClick={() => assignDelivery(order.id, "Delivery Boy 1")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200 active:scale-[95%]"
              >
                Assign delivery
              </button>
            ) : (
              <span className="text-sm text-gray-400">Pending</span>
            )}
          </div>

          {/* Delivery Done Column */}
          <div className="col-span-1 border-t border-gray-200 p-3 bg-white flex flex-col items-center justify-start">
            <div className="text-xs text-gray-500 mb-2">Delivery done</div>
            {order.status === "completed" ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">
                  Completed
                </span>
              </div>
            ) : order.assignedTo ? (
              <button
                onClick={() => markDeliveryDone(order.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200 active:scale-[95%]"
              >
                Mark Done
              </button>
            ) : (
              <span className="text-sm text-gray-400">Pending</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Navigation Bar */}
      <nav
        className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Shop Name */}
            <div className="flex items-center">
              <div className="h-10 w-auto rounded-full flex items-center justify-center">
                <Image src={Logo} width={1920} height={1920} priority={true} quality={100}
              sizes="(min-width: 1180px) 80px, 64px" alt="Renu Enterprise Logo" className="h-full w-auto object-contain" />
              </div>
              <div className="ml-3">
                <h1 className="LogoTxt text-lg md:text-xl font-bold text-gray-900">
                  Renu Enterprise
                </h1>
                {/* <p className="text-xs text-gray-500 hidden md:block">
                  Admin Dashboard
                </p> */}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => router.push("./dashboard")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === "dashboard"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaClipboardList className="h-4 w-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => router.push("./customers")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === "customers"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaUsers className="h-4 w-4 mr-2" />
                Customers
              </button>
              <button
                onClick={() => router.push("./prices")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === "prices"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaTags className="h-4 w-4 mr-2" />
                Prices
              </button>
              <button
                onClick={() => router.push("./coupons")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === "coupons"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaTag className="h-4 w-4 mr-2" />
                Coupons
              </button>
              <button
                onClick={() => router.push("./reports")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === "reports"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaChartBar className="h-4 w-4 mr-2" />
                Reports
              </button>
            </div>

            {/* Right Side - Mobile Menu, Notifications, Account, Logout */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition duration-200"
              >
                <FaBars className="h-5 w-5" />
              </button>

              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition duration-200">
                <FaBell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  3
                </span>
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaUser className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition duration-200"
              >
                <FaSignOutAlt className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <button
                onClick={() => {
                  router.push("./dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === "dashboard"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaClipboardList className="h-4 w-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  router.push("./customers");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === "customers"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaUsers className="h-4 w-4 mr-2" />
                Customers
              </button>
              <button
                onClick={() => {
                  router.push("./prices");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === "prices"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaTags className="h-4 w-4 mr-2" />
                Prices
              </button>
              <button
                onClick={() => {
                  router.push("./coupons");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === "coupons"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaTag className="h-4 w-4 mr-2" />
                Coupons
              </button>
              <button
                onClick={() => {
                  router.push("./reports");
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === "reports"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaChartBar className="h-4 w-4 mr-2" />
                Reports
              </button>
              <div className="border-t border-gray-200 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition duration-200"
                >
                  <FaSignOutAlt className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Dashboard
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your laundry orders and business
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-md active:scale-[95%]">
                <FaPlus className="h-4 w-4 mr-2" />
                Add New Order
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                <option value="walk-in">Walk-in</option>
                <option value="phone">Phone</option>
                <option value="online">Online</option>
              </select>

              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center"
              >
                <FaFilter className="h-4 w-4 mr-2" />
                More Filters
              </button>
            </div>

            {/* Active Filters */}
            {getActiveFilters().length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {getActiveFilters().map((filter, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {filter.type}: {filter.value}
                      <button
                        onClick={() => removeFilter(filter.type)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order list */}
        {isFullscreen ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex flex-col">
            {/* New Orders */}
            <div
              ref={newOrdersRef}
              className={`${
                selectedOrderView === "new" ? "block" : "hidden"
              } fixed inset-0 bg-white z-50 p-4 overflow-y-auto space-y-4`}
            >
              {newOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {newOrders.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <FaShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No new orders found</p>
                </div>
              )}

              {showScrollTopNew && (
                <button
                  onClick={() =>
                    newOrdersRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  className="fixed md:bottom-20 bottom-16 md:right-6 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
                >
                  <FaArrowUp />
                </button>
              )}

              {/* Full screen */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`fixed flex items-center bottom-6 md:right-6 right-4 text-white p-3 rounded-full shadow-lg z-50 text-sm px-3 py-3 transition duration-200 ${
                  isFullscreen
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isFullscreen ? (
                  <p className="hidden md:block mr-0 md:mr-[10px]">
                    Exit Fullscreen
                  </p>
                ) : (
                  <p className="hidden md:block mr-0 md:mr-[10px]">
                    Fullscreen View
                  </p>
                )}
                {isFullscreen ? (
                  <BiExitFullscreen className="" />
                ) : (
                  <BiFullscreen className="" />
                )}
              </button>
            </div>

            {/* Orders in Process */}
            <div
              ref={processingOrdersRef}
              className={`${
                selectedOrderView === "processing" ? "block" : "hidden"
              } fixed inset-0 bg-white z-50 p-4 overflow-y-auto space-y-4`}
            >
              {processingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {processingOrders.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <FaClock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No orders in process</p>
                </div>
              )}

              {showScrollTopProcessing && (
                <button
                  onClick={() =>
                    processingOrdersRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  className="fixed md:bottom-20 bottom-16 md:right-6 right-4 bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg z-50"
                >
                  <FaArrowUp />
                </button>
              )}

              {/* Full screen */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`fixed flex items-center bottom-6 md:right-6 right-4 text-white p-3 rounded-full shadow-lg z-50 text-sm px-3 py-3 transition duration-200 ${
                  isFullscreen
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isFullscreen ? (
                  <p className="hidden md:block mr-0 md:mr-[10px]">
                    Exit Fullscreen
                  </p>
                ) : (
                  <p className="hidden md:block mr-0 md:mr-[10px]">
                    Fullscreen View
                  </p>
                )}
                {isFullscreen ? <BiExitFullscreen /> : <BiFullscreen />}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-48px)] bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex flex-col">
            {/* Order Toggle */}
            <div className="hidden md:flex rounded-t-lg bg-gray-200 p-1 flex-shrink-0">
              <button
                className={`flex-1 rounded-md transition duration-200 p-4 md:p-6 border-b border-gray-200 ${
                  selectedOrderView === "new"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setSelectedOrderView("new")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        New Orders
                      </h3>
                      <p className="text-sm text-gray-500">
                        {newOrders.length} pending orders
                      </p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {newOrders.length}
                  </span>
                </div>
              </button>

              <button
                className={`flex-1 rounded-md transition duration-200 p-4 md:p-6 border-b border-gray-200 ${
                  selectedOrderView === "processing"
                    ? "bg-white text-yellow-600 shadow-sm"
                    : "text-gray-700 hover:text-yellow-600"
                }`}
                onClick={() => setSelectedOrderView("processing")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FaClock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Orders in Process
                      </h3>
                      <p className="text-sm text-gray-500">
                        {processingOrders.length} being processed
                      </p>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {processingOrders.length}
                  </span>
                </div>
              </button>
            </div>

            {/* Mobile Order Toggle */}
            <div className="md:hidden mb-4 flex-shrink-0">
              <div className="flex rounded-t-lg bg-gray-200 p-1">
                <button
                  onClick={() => setSelectedOrderView("new")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition duration-200 ${
                    selectedOrderView === "new"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  New Orders ({newOrders.length})
                </button>
                <button
                  onClick={() => setSelectedOrderView("processing")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition duration-200 ${
                    selectedOrderView === "processing"
                      ? "bg-white text-yellow-600 shadow-sm"
                      : "text-gray-700 hover:text-yellow-600"
                  }`}
                >
                  Processing ({processingOrders.length})
                </button>
              </div>
            </div>

            {/* New Orders */}
            <div
              ref={newOrdersRef}
              className={`${
                selectedOrderView === "new" ? "block" : "hidden"
              } flex-1 p-4 overflow-y-auto min-h-0 space-y-4`}
            >
              {newOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {newOrders.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <FaShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No new orders found</p>
                </div>
              )}

              {showScrollTopNew && (
                <button
                  onClick={() =>
                    newOrdersRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  className="fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
                >
                  <FaArrowUp />
                </button>
              )}

              {/* Full screen */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`fixed flex items-center bottom-6 right-6 text-white p-3 rounded-full shadow-lg z-50 text-sm px-3 py-3 transition duration-200 ${
                  isFullscreen
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isFullscreen ? (
                  <p className="hidden md:block mr-0 md:mr-[10px]">
                    Exit Fullscreen
                  </p>
                ) : (
                  <p className="hidden md:block mr-0 md:mr-[10px]">
                    Fullscreen View
                  </p>
                )}
                {isFullscreen ? (
                  <BiExitFullscreen className="" />
                ) : (
                  <BiFullscreen className="" />
                )}
              </button>
            </div>

            {/* Orders in Process */}
            <div
              ref={processingOrdersRef}
              className={`${
                selectedOrderView === "processing" ? "block" : "hidden"
              } flex-1 p-4 overflow-y-auto min-h-0 space-y-4`}
            >
              {processingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {processingOrders.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <FaClock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No orders in process</p>
                </div>
              )}

              {showScrollTopProcessing && (
                <button
                  onClick={() =>
                    processingOrdersRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  className="fixed bottom-20 right-6 bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg z-50"
                >
                  <FaArrowUp />
                </button>
              )}

              {/* Full screen */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`fixed flex items-center bottom-6 right-6 text-white p-3 rounded-full shadow-lg z-50 text-sm px-3 py-3 transition duration-200 ${
                  isFullscreen
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isFullscreen ? (
                  <p className="hidden md:block mr-0 md:mr-[10px]">
                    Exit Fullscreen
                  </p>
                ) : (
                  <p className="hidden md:block mr-0 md:mr-[10px]">
                    Fullscreen View
                  </p>
                )}
                {isFullscreen ? <BiExitFullscreen /> : <BiFullscreen />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
