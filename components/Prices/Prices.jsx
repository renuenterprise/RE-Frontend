"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaTimes,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaRedo,
  FaArrowUp,
  FaSave,
  FaEye,
  FaFilter,
  FaTag,
  FaUsers,
  FaCog,
  FaShoppingBag,
} from "react-icons/fa";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";

export default function Prices() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const pricesRef = useRef(null);

  // Sample data - replace with real data from your API
  const [services, setServices] = useState([
    { id: "SRV-001", name: "Dry Cleaning", description: "Professional dry cleaning service", active: true },
    { id: "SRV-002", name: "Steam Press", description: "Steam pressing service", active: true },
    { id: "SRV-003", name: "Wash & Fold", description: "Washing and folding service", active: true },
    { id: "SRV-004", name: "Stain Removal", description: "Specialized stain removal", active: true },
  ]);

  const [userTypes, setUserTypes] = useState([
    { id: "UT-001", name: "Men", description: "Men's clothing", active: true },
    { id: "UT-002", name: "Women", description: "Women's clothing", active: true },
    { id: "UT-003", name: "Kids", description: "Children's clothing", active: true },
    { id: "UT-004", name: "Households", description: "Household items", active: true },
  ]);

  const [products, setProducts] = useState([
    { id: "PRD-001", name: "Shirt", category: "Clothing", active: true },
    { id: "PRD-002", name: "Pants", category: "Clothing", active: true },
    { id: "PRD-003", name: "Blazer", category: "Clothing", active: true },
    { id: "PRD-004", name: "Dress", category: "Clothing", active: true },
    { id: "PRD-005", name: "Suit", category: "Clothing", active: true },
    { id: "PRD-006", name: "Bedsheet", category: "Household", active: true },
    { id: "PRD-007", name: "Curtains", category: "Household", active: true },
    { id: "PRD-008", name: "Cap", category: "Accessories", active: true },
  ]);

  const [prices, setPrices] = useState([
    { id: "PRC-001", serviceId: "SRV-001", productId: "PRD-001", userTypeId: "UT-001", price: 45, active: true },
    { id: "PRC-002", serviceId: "SRV-001", productId: "PRD-001", userTypeId: "UT-002", price: 40, active: true },
    { id: "PRC-003", serviceId: "SRV-001", productId: "PRD-002", userTypeId: "UT-001", price: 60, active: true },
    { id: "PRC-004", serviceId: "SRV-001", productId: "PRD-003", userTypeId: "UT-001", price: 120, active: true },
    { id: "PRC-005", serviceId: "SRV-002", productId: "PRD-001", userTypeId: "UT-001", price: 25, active: true },
    { id: "PRC-006", serviceId: "SRV-002", productId: "PRD-002", userTypeId: "UT-001", price: 35, active: true },
    { id: "PRC-007", serviceId: "SRV-001", productId: "PRD-004", userTypeId: "UT-002", price: 80, active: true },
    { id: "PRC-008", serviceId: "SRV-003", productId: "PRD-006", userTypeId: "UT-004", price: 50, active: true },
    { id: "PRC-009", serviceId: "SRV-001", productId: "PRD-008", userTypeId: "UT-003", price: 30, active: true },
  ]);

  // Form states
  const [newService, setNewService] = useState({ name: "", description: "", active: true });
  const [newUserType, setNewUserType] = useState({ name: "", description: "", active: true });
  const [newProduct, setNewProduct] = useState({ name: "", category: "", active: true });
  const [newPrice, setNewPrice] = useState({ serviceId: "", productId: "", userTypeId: "", price: "", active: true });

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (pricesRef.current) {
        setShowScrollTop(pricesRef.current.scrollTop > 200);
      }
    };

    const el = pricesRef.current;
    el?.addEventListener("scroll", handleScroll);

    return () => {
      el?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Helper functions
  const getServiceName = (serviceId) => services.find(s => s.id === serviceId)?.name || "Unknown";
  const getProductName = (productId) => products.find(p => p.id === productId)?.name || "Unknown";
  const getUserTypeName = (userTypeId) => userTypes.find(u => u.id === userTypeId)?.name || "Unknown";

  // Filter and search logic
  const filteredPrices = prices.filter((price) => {
    const serviceName = getServiceName(price.serviceId);
    const productName = getProductName(price.productId);
    const userTypeName = getUserTypeName(price.userTypeId);

    const matchesSearch = 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userTypeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService = selectedService === "all" || price.serviceId === selectedService;
    const matchesUserType = selectedUserType === "all" || price.userTypeId === selectedUserType;

    const matchesPrice = (() => {
      if (!minPrice && !maxPrice) return true;
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return price.price >= min && price.price <= max;
    })();

    return matchesSearch && matchesService && matchesUserType && matchesPrice;
  });

  // Sorting logic
  const sortedPrices = [...filteredPrices].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "name":
        aValue = getProductName(a.productId).toLowerCase();
        bValue = getProductName(b.productId).toLowerCase();
        break;
      case "service":
        aValue = getServiceName(a.serviceId).toLowerCase();
        bValue = getServiceName(b.serviceId).toLowerCase();
        break;
      case "userType":
        aValue = getUserTypeName(a.userTypeId).toLowerCase();
        bValue = getUserTypeName(b.userTypeId).toLowerCase();
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      default:
        aValue = getProductName(a.productId).toLowerCase();
        bValue = getProductName(b.productId).toLowerCase();
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
    return sortOrder === "asc" ? <FaSortUp className="h-3 w-3" /> : <FaSortDown className="h-3 w-3" />;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedService("all");
    setSelectedUserType("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("name");
    setSortOrder("asc");
  };

  // CRUD operations
  const handleAddService = () => {
    if (newService.name.trim()) {
      const service = {
        id: `SRV-${String(services.length + 1).padStart(3, '0')}`,
        ...newService,
      };
      setServices([...services, service]);
      setNewService({ name: "", description: "", active: true });
      setActiveModal(null);
    }
  };

  const handleAddUserType = () => {
    if (newUserType.name.trim()) {
      const userType = {
        id: `UT-${String(userTypes.length + 1).padStart(3, '0')}`,
        ...newUserType,
      };
      setUserTypes([...userTypes, userType]);
      setNewUserType({ name: "", description: "", active: true });
      setActiveModal(null);
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name.trim()) {
      const product = {
        id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
        ...newProduct,
      };
      setProducts([...products, product]);
      setNewProduct({ name: "", category: "", active: true });
      setActiveModal(null);
    }
  };

  const handleAddPrice = () => {
    if (newPrice.serviceId && newPrice.productId && newPrice.userTypeId && newPrice.price) {
      const price = {
        id: `PRC-${String(prices.length + 1).padStart(3, '0')}`,
        ...newPrice,
        price: parseFloat(newPrice.price),
      };
      setPrices([...prices, price]);
      setNewPrice({ serviceId: "", productId: "", userTypeId: "", price: "", active: true });
      setActiveModal(null);
    }
  };

  const handleDeletePrice = (priceId) => {
    setPrices(prices.filter(p => p.id !== priceId));
  };

  const handleEditPrice = (price) => {
    setEditingItem(price);
    setActiveModal("editPrice");
  };

  const handleUpdatePrice = () => {
    if (editingItem) {
      setPrices(prices.map(p => 
        p.id === editingItem.id 
          ? { ...editingItem, price: parseFloat(editingItem.price) }
          : p
      ));
      setEditingItem(null);
      setActiveModal(null);
    }
  };

  const PriceCard = ({ price }) => (
    <div className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-600">{price.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                price.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {price.active ? "Active" : "Inactive"}
              </span>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2 text-lg">
              {getProductName(price.productId)}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <FaCog className="h-3 w-3 mr-2" />
                Service: {getServiceName(price.serviceId)}
              </div>
              <div className="flex items-center">
                <FaUsers className="h-3 w-3 mr-2" />
                Type: {getUserTypeName(price.userTypeId)}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="text-2xl font-bold text-green-600">
              ₹{price.price}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditPrice(price)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition duration-200"
              >
                <FaEdit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeletePrice(price.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition duration-200"
              >
                <FaTrash className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Price Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage services, products, and pricing
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveModal("addService")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Add Service
              </button>
              <button
                onClick={() => setActiveModal("addProduct")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Add Product
              </button>
              <button
                onClick={() => setActiveModal("addUserType")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Add User Type
              </button>
              <button
                onClick={() => setActiveModal("addPrice")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Add Price
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
                placeholder="Search products, services, or user types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Services</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>

              <select
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All User Types</option>
                {userTypes.map(userType => (
                  <option key={userType.id} value={userType.id}>{userType.name}</option>
                ))}
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
                Reset
              </button>
            </div>

            {/* Sorting Options */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              {[
                { key: "name", label: "Product Name" },
                { key: "service", label: "Service" },
                { key: "userType", label: "User Type" },
                { key: "price", label: "Price" },
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
          </div>
        </div>

        {/* Price List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="flex rounded-t-lg bg-gray-200 p-1 flex-shrink-0">
            <div className="flex-1 rounded-md transition duration-200 p-2 px-4 md:p-4 md:px-6 border-b border-gray-200 bg-white text-blue-600 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Price List ({sortedPrices.length})
              </h3>
            </div>
          </div>

          <div
            ref={pricesRef}
            className={`${
              isFullscreen ? "fixed inset-0 bg-white z-50 p-4" : "max-h-[600px]"
            } overflow-y-auto space-y-4 p-4`}
          >
            {sortedPrices.map((price) => (
              <PriceCard key={price.id} price={price} />
            ))}

            {sortedPrices.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <FaTag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No prices found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={() =>
                pricesRef.current?.scrollTo({ top: 0, behavior: "smooth" })
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

      {/* Modals */}
      {activeModal === "addService" && (
        <Modal title="Add New Service" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name
              </label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter service name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Enter service description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Service
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === "addProduct" && (
        <Modal title="Add New Product" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option value="Clothing">Clothing</option>
                <option value="Household">Household</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === "addUserType" && (
        <Modal title="Add New User Type" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type Name
              </label>
              <input
                type="text"
                value={newUserType.name}
                onChange={(e) => setNewUserType({ ...newUserType, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter user type name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newUserType.description}
                onChange={(e) => setNewUserType({ ...newUserType, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Enter user type description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUserType}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add User Type
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === "addPrice" && (
        <Modal title="Add New Price" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                value={newPrice.serviceId}
                onChange={(e) => setNewPrice({ ...newPrice, serviceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                value={newPrice.productId}
                onChange={(e) => setNewPrice({ ...newPrice, productId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type
              </label>
              <select
                value={newPrice.userTypeId}
                onChange={(e) => setNewPrice({ ...newPrice, userTypeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select user type</option>
                {userTypes.map(userType => (
                  <option key={userType.id} value={userType.id}>{userType.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={newPrice.price}
                onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPrice}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Add Price
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === "editPrice" && editingItem && (
        <Modal title="Edit Price" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                value={editingItem.serviceId}
                onChange={(e) => setEditingItem({ ...editingItem, serviceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                value={editingItem.productId}
                onChange={(e) => setEditingItem({ ...editingItem, productId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type
              </label>
              <select
                value={editingItem.userTypeId}
                onChange={(e) => setEditingItem({ ...editingItem, userTypeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {userTypes.map(userType => (
                  <option key={userType.id} value={userType.id}>{userType.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={editingItem.price}
                onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={editingItem.active}
                onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePrice}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaSave className="h-4 w-4 mr-2" />
                Update Price
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FaCog className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{services.length}</div>
              <div className="text-sm text-gray-600">Services</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FaShoppingBag className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{products.length}</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FaUsers className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{userTypes.length}</div>
              <div className="text-sm text-gray-600">User Types</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FaTag className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{prices.length}</div>
              <div className="text-sm text-gray-600">Price Entries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}