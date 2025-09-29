"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Zap,
  Wrench,
  Monitor,
  Hammer,
  Building,
  Filter,
  Search,
  Phone,
  User,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

// Import your API functions
import {
  getAllComplaints,
  getPendingComplaints,
  getComplaintsByStatus,
  getComplaintsByCategory,
  getComplaintsByPriority,
  closeComplaint,
  searchComplaints,
} from "@/lib/api/admin";

interface Complaint {
  id: string;
  title?: string;
  description: string;
  category:
    | "ELECTRICAL"
    | "PLUMBING"
    | "ELECTRONICS"
    | "CARPENTRY"
    | "STRUCTURAL"
    | "OTHER";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  createdAt: string;
  user: {
    id: string;
    name?: string;
    mobile: string;
  };
}

const ComplaintsDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("pending");
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Status colors
  const statusColors = {
    OPEN: "bg-green-500",
    IN_PROGRESS: "bg-blue-500",
    RESOLVED: "bg-teal-500",
    CLOSED: "bg-emerald-500",
    CANCELLED: "bg-red-500",
  };

  // Priority colors
  const priorityColors = {
    LOW: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    MEDIUM: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    URGENT: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  // Category icons
  const categoryIcons = {
    ELECTRICAL: <Zap className="w-4 h-4" />,
    PLUMBING: <Wrench className="w-4 h-4" />,
    ELECTRONICS: <Monitor className="w-4 h-4" />,
    CARPENTRY: <Hammer className="w-4 h-4" />,
    STRUCTURAL: <Building className="w-4 h-4" />,
    OTHER: <Filter className="w-4 h-4" />,
  };

  // Priority icons
  const priorityIcons = {
    LOW: <ArrowDown className="w-3 h-3" />,
    MEDIUM: <Minus className="w-3 h-3" />,
    HIGH: <ArrowUp className="w-3 h-3" />,
    URGENT: <AlertCircle className="w-3 h-3" />,
  };

  const filterCards = [
    {
      id: "pending",
      title: "Pending to Close",
      icon: <Clock className="w-6 h-6" />,
      color: "bg-gradient-to-br from-amber-600 to-amber-700",
      description: "Resolved complaints awaiting closure",
    },
    {
      id: "status",
      title: "By Status",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-600 to-blue-700",
      description: "Filter by complaint status",
    },
    {
      id: "category",
      title: "By Category",
      icon: <Filter className="w-6 h-6" />,
      color: "bg-gradient-to-br from-indigo-600 to-indigo-700",
      description: "Filter by complaint category",
    },
    {
      id: "priority",
      title: "By Priority",
      icon: <ArrowUp className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-600 to-red-700",
      description: "Filter by priority level",
    },
  ];

  const statusOptions = [
    "OPEN",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
    "CANCELLED",
  ];
  const categoryOptions = [
    "ELECTRICAL",
    "PLUMBING",
    "ELECTRONICS",
    "CARPENTRY",
    "STRUCTURAL",
    "OTHER",
  ];
  const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let data: Complaint[] = [];

      if (activeFilter === "pending") {
        data = await getPendingComplaints();
        data = data.filter((c) => c.status === "RESOLVED"); // Only resolved, pending closure
      } else if (activeFilter === "status") {
        if (selectedSubFilter === "all") {
          data = await getAllComplaints();
        } else {
          data = await getComplaintsByStatus(selectedSubFilter as any);
        }
      } else if (activeFilter === "category") {
        if (selectedSubFilter === "all") {
          data = await getAllComplaints();
        } else {
          data = await getComplaintsByCategory(selectedSubFilter as any);
        }
      } else if (activeFilter === "priority") {
        if (selectedSubFilter === "all") {
          data = await getAllComplaints();
        } else {
          data = await getComplaintsByPriority(selectedSubFilter as any);
        }
      }

      // Apply search filter
      if (searchQuery.trim()) {
        data = await searchComplaints(searchQuery);
      }

      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseComplaint = async (complaintId: string) => {
    try {
      await closeComplaint(complaintId);
      fetchComplaints(); // Refresh the list
    } catch (error) {
      console.error("Error closing complaint:", error);
      alert("Failed to close complaint");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [activeFilter, selectedSubFilter]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchComplaints();
      } else if (searchQuery === "") {
        fetchComplaints();
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setSelectedSubFilter("all");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderSubFilters = () => {
    if (activeFilter === "pending") return null;

    let options: string[] = [];
    if (activeFilter === "status") options = statusOptions;
    else if (activeFilter === "category") options = categoryOptions;
    else if (activeFilter === "priority") options = priorityOptions;

    return (
      <div className="flex flex-wrap gap-2 mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <button
          onClick={() => setSelectedSubFilter("all")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedSubFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          All
        </button>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelectedSubFilter(option)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedSubFilter === option
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {activeFilter === "category" &&
              categoryIcons[option as keyof typeof categoryIcons]}
            {activeFilter === "priority" &&
              priorityIcons[option as keyof typeof priorityIcons]}
            {option.charAt(0) + option.slice(1).toLowerCase().replace("_", " ")}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#040d19] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Complaints Dashboard
          </h1>
          <p className="text-slate-400">
            Manage and track all tenant complaints
          </p>
        </div>

        <div className="flex gap-6">
          <div className="w-80 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {filterCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleFilterChange(card.id)}
                className={`${
                  card.color
                } text-white p-6 rounded-xl shadow-lg cursor-pointer transition-colors ${
                  activeFilter === card.id ? "ring-2 ring-blue-400" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    {card.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {card.id === "pending" &&
                        complaints.filter((c) => c.status === "RESOLVED")
                          .length}
                      {card.id !== "pending" && complaints.length}
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                <p className="text-sm text-white text-opacity-80">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex-1 bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-800/50">
            {renderSubFilters()}

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {complaints.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                      <p>No complaints found</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            User Details
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Complaint
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50 max-h-96 overflow-y-auto">
                        {complaints.map((complaint) => (
                          <tr
                            key={complaint.id}
                            className="hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <User className="w-8 h-8 text-slate-400 bg-slate-700 rounded-full p-1" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">
                                    {complaint.user.name || "N/A"}
                                  </div>
                                  <div className="text-sm text-slate-400 flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {complaint.user.mobile}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="max-w-xs">
                                <div className="text-sm font-medium text-white truncate">
                                  {complaint.title || "No title"}
                                </div>
                                <div className="text-sm text-slate-400 truncate">
                                  {complaint.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center text-sm text-slate-300">
                                {categoryIcons[complaint.category]}
                                <span className="ml-2">
                                  {complaint.category}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                  priorityColors[complaint.priority]
                                }`}
                              >
                                {priorityIcons[complaint.priority]}
                                <span className="ml-1">
                                  {complaint.priority}
                                </span>
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    statusColors[complaint.status]
                                  } mr-2`}
                                ></div>
                                <span className="text-sm text-slate-300">
                                  {complaint.status.replace("_", " ")}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-400">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(complaint.createdAt)}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {complaint.status === "RESOLVED" && (
                                <button
                                  onClick={() =>
                                    handleCloseComplaint(complaint.id)
                                  }
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Close
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsDashboard;
