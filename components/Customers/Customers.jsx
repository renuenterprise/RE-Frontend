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
  FaArrowDown,
  FaEnvelope,
  FaCalendarAlt,
  FaDollarSign,
  FaUserPlus,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaRedo,
} from "react-icons/fa";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import Image from "next/image";
import Logo from "../../public/RELogo.png";

export default function Customers() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const customersRef = useRef(null);
  const lastScrollY = useRef(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [activeTab, setActiveTab] = useState("customers");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sample customers data - replace with real data from your API
  const [customers, setCustomers] = useState([
    {
      id: "CUST-001",
      name: "John Doe",
      phone: "+91 98765 43210",
      email: "john.doe@example.com",
      address: "123 Main St, Jaleshwar, Odisha",
      totalBookings: 15,
      totalValue: 2850,
      customerSince: "2024-03-15",
      lastOrderDate: "2025-01-05",
      preferredSource: "walk-in",
      status: "active",
      notes: "Regular customer, prefers morning pickup",
    },
    {
      id: "CUST-002",
      name: "Jane Smith",
      phone: "+91 87654 32109",
      email: "jane.smith@example.com",
      address: "456 Oak Ave, Jaleshwar, Odisha",
      totalBookings: 8,
      totalValue: 1450,
      customerSince: "2024-06-20",
      lastOrderDate: "2025-01-04",
      preferredSource: "phone",
      status: "active",
      notes: "Prefers delivery between 2-4 PM",
    },
  ]);

  // Navbar scroll
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

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (customersRef.current) {
        setShowScrollTop(customersRef.current.scrollTop > 200);
      }
    };

    const el = customersRef.current;
    el?.addEventListener("scroll", handleScroll);

    return () => {
      el?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Filter and search logic
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSource =
      selectedSource === "all" || customer.preferredSource === selectedSource;

    const matchesDateRange =
      selectedDateRange === "all" ||
      (() => {
        const customerDate = new Date(customer.customerSince);
        const now = new Date();

        switch (selectedDateRange) {
          case "last-month":
            return (
              customerDate >= new Date(now.getFullYear(), now.getMonth() - 1, 1)
            );
          case "last-3-months":
            return (
              customerDate >= new Date(now.getFullYear(), now.getMonth() - 3, 1)
            );
          case "last-6-months":
            return (
              customerDate >= new Date(now.getFullYear(), now.getMonth() - 6, 1)
            );
          case "this-year":
            return customerDate >= new Date(now.getFullYear(), 0, 1);
          default:
            return true;
        }
      })();

    const matchesPrice = (() => {
      if (!minPrice && !maxPrice) return true;
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return customer.totalValue >= min && customer.totalValue <= max;
    })();

    return matchesSearch && matchesSource && matchesDateRange && matchesPrice;
  });

  // Sorting logic
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "phone":
        aValue = a.phone;
        bValue = b.phone;
        break;
      case "totalBookings":
        aValue = a.totalBookings;
        bValue = b.totalBookings;
        break;
      case "totalValue":
        aValue = a.totalValue;
        bValue = b.totalValue;
        break;
      case "customerSince":
        aValue = new Date(a.customerSince);
        bValue = new Date(b.customerSince);
        break;
      case "lastOrderDate":
        aValue = new Date(a.lastOrderDate);
        bValue = new Date(b.lastOrderDate);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="h-3 w-3" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="h-3 w-3" />
    ) : (
      <FaSortDown className="h-3 w-3" />
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSource("all");
    setSelectedDateRange("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("name");
    setSortOrder("asc");
  };

  const getActiveFilters = () => {
    const filters = [];
    if (selectedSource !== "all")
      filters.push({ type: "source", value: selectedSource });
    if (selectedDateRange !== "all")
      filters.push({ type: "date", value: selectedDateRange });
    if (minPrice)
      filters.push({ type: "minPrice", value: `Min: ₹${minPrice}` });
    if (maxPrice)
      filters.push({ type: "maxPrice", value: `Max: ₹${maxPrice}` });
    if (searchTerm) filters.push({ type: "search", value: searchTerm });
    return filters;
  };

  const removeFilter = (filterType) => {
    if (filterType === "source") setSelectedSource("all");
    if (filterType === "date") setSelectedDateRange("all");
    if (filterType === "minPrice") setMinPrice("");
    if (filterType === "maxPrice") setMaxPrice("");
    if (filterType === "search") setSearchTerm("");
  };

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
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const CustomerCard = ({ customer }) => (
    <div className="border border-b-2 border-b-gray-300 border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">
                {customer.id}
              </span>
              <span className="text-lg">
                {getSourceIcon(customer.preferredSource)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  customer.status
                )}`}
              >
                {customer.status}
              </span>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2 text-lg">
              {customer.name}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <FaPhoneAlt className="h-3 w-3 mr-2" />
                {customer.phone}
              </div>
              <div className="flex items-center">
                <FaEnvelope className="h-3 w-3 mr-2" />
                {customer.email}
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="h-3 w-3 mr-2" />
                {customer.address}
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="h-3 w-3 mr-2" />
                Since: {formatDate(customer.customerSince)}
              </div>
            </div>

            {customer.notes && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                <strong>Notes:</strong> {customer.notes}
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
            <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200">
              <FaEdit className="h-4 w-4 mr-2" />
              Edit Customer
            </button>
            <button className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 transition duration-200">
              <FaShoppingBag className="h-4 w-4 mr-2" />
              View Orders
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-0 border-t border-gray-200">
        <div className="p-3 text-center border-r border-gray-200">
          <div className="text-lg font-semibold text-gray-900">
            {customer.totalBookings}
          </div>
          <div className="text-xs text-gray-500">Total Bookings</div>
        </div>
        <div className="p-3 text-center border-r border-gray-200">
          <div className="text-lg font-semibold text-green-600">
            ₹{customer.totalValue}
          </div>
          <div className="text-xs text-gray-500">Total Value</div>
        </div>
        <div className="p-3 text-center border-r border-gray-200">
          <div className="text-sm font-medium text-gray-900">
            {formatDate(customer.customerSince)}
          </div>
          <div className="text-xs text-gray-500">Customer Since</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-sm font-medium text-gray-900">
            {formatDate(customer.lastOrderDate)}
          </div>
          <div className="text-xs text-gray-500">Last Order</div>
        </div>
      </div>
    </div>
  );

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
                <Image
                  src={Logo}
                  width={1920}
                  height={1920}
                  priority={true}
                  quality={100}
                  sizes="(min-width: 1180px) 80px, 64px"
                  alt="Renu Enterprise Logo"
                  className="h-full w-auto object-contain"
                />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Customers
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your customer database
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-md active:scale-[95%]">
                <FaUserPlus className="h-4 w-4 mr-2" />
                Add New Customer
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
                placeholder="Search customers by name, phone, or email..."
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
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="last-6-months">Last 6 Months</option>
                <option value="this-year">This Year</option>
              </select>

              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={resetFilters}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center"
              >
                <FaRedo className="h-4 w-4 mr-2" />
                Reset Filters
              </button>
            </div>

            {/* Sorting Options */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              {[
                { key: "name", label: "Name" },
                { key: "phone", label: "Phone" },
                { key: "totalBookings", label: "Total Bookings" },
                { key: "totalValue", label: "Total Value" },
                { key: "customerSince", label: "Customer Since" },
                { key: "lastOrderDate", label: "Last Order" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`flex items-center px-2 py-1 rounded text-sm font-medium transition duration-200 ${
                    sortBy === key
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {label}
                  <span className="ml-1">{getSortIcon(key)}</span>
                </button>
              ))}
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

        {/* Customer List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="flex rounded-t-lg bg-gray-200 p-1 flex-shrink-0">
            <div className="flex-1 rounded-md transition duration-200 p-2 px-4 md:p-4 md:px-6 border-b border-gray-200 bg-white text-blue-600 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Customer List ({sortedCustomers.length})
              </h3>
            </div>
          </div>

          <div
            ref={customersRef}
            className={`${
              isFullscreen ? "fixed inset-0 bg-white z-50 p-4" : "max-h-[600px]"
            } overflow-y-auto space-y-4 p-4`}
          >
            {sortedCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}

            {sortedCustomers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <FaUsers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No customers found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={() =>
                customersRef.current?.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
            >
              <FaArrowUp />
            </button>
          )}

          {/* Fullscreen button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`fixed flex items-center bottom-6 right-6 text-white p-3 rounded-full shadow-lg z-50 text-sm px-3 py-3 transition duration-200 ${
              isFullscreen
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isFullscreen ? (
              <BiExitFullscreen className="h-4 w-4 mr-2" />
            ) : (
              <BiFullscreen className="h-4 w-4 mr-2" />
            )}
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>
    </div>
  );
}
