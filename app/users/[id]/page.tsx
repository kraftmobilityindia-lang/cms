"use client";

import {
  getUserById,
  type UserDetailsResponse,
  deleteUser,
} from "@/lib/api/admin";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  Calendar,
  TrendingUp,
  Clock,
  Filter,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause,
  Ban,
  Building,
  Bed,
  Bath,
  Square,
  Layers,
  Shield,
  Activity,
} from "lucide-react";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [userData, setUserData] = useState<UserDetailsResponse>();
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchUserData() {
    try {
      setLoading(true);
      const user = await getUserById(userId);
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "inProgress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      case "cancelled":
        return <Ban className="h-4 w-4" />;
      default:
        return <Pause className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-rose-400/30 text-rose-300 border-rose-400/40";
      case "inProgress":
        return "bg-amber-400/30 text-amber-300 border-amber-400/40";
      case "resolved":
        return "bg-emerald-400/30 text-emerald-300 border-emerald-400/40";
      case "closed":
        return "bg-slate-400/30 text-slate-300 border-slate-400/40";
      case "cancelled":
        return "bg-orange-400/30 text-orange-300 border-orange-400/40";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-400/30 text-red-300 border-red-400/40";
      case "high":
        return "bg-orange-400/30 text-orange-300 border-orange-400/40";
      case "medium":
        return "bg-yellow-400/30 text-yellow-300 border-yellow-400/40";
      case "low":
        return "bg-emerald-400/30 text-emerald-300 border-emerald-400/40";
      default:
        return "bg-slate-400/30 text-slate-300 border-slate-400/40";
    }
  };

  const filteredComplaints =
    userData?.allComplaints.filter((complaint) => {
      const matchesStatus =
        statusFilter === "all" || complaint.status === statusFilter;
      const matchesSearch =
        complaint.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040d19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#040d19] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040d19] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="border-gray-700 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {userData.name || "Unknown User"}
              </h1>
              <p className="text-gray-400">User Details & Activity</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={userData.isActive ? "default" : "secondary"}>
              {userData.isActive ? "Active" : "Inactive"}
            </Badge>
            {userData.isVerified && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Details Card */}
          <Card className="bg-[#152030] border-none">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-200" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-white font-medium">
                  {userData.mobile}
                </span>
              </div>
              {userData.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-indigo-200" />
                  <span className="text-white font-medium">
                    {userData.email}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-indigo-200" />
                <span className="text-white font-medium">
                  Member since{" "}
                  {new Date(userData.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">
                  Last updated{" "}
                  {new Date(userData.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Complaint Stats */}
          <Card className="bg-[#152030] border-none">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-200" />
                Complaint Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userData.complaintStats.total}
                  </div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {userData.complaintStats.open}
                  </div>
                  <div className="text-sm text-gray-400">Open</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {userData.complaintStats.inProgress}
                  </div>
                  <div className="text-sm text-gray-400">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {userData.complaintStats.resolved}
                  </div>
                  <div className="text-sm text-gray-400">Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card className="bg-[#152030] border-none">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-200" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-lg font-semibold text-white">
                  {userData.metrics.avgResolutionTimeDays} days
                </div>
                <div className="text-sm text-gray-400">Avg Resolution Time</div>
              </div>
              {userData.metrics.lastComplaint && (
                <div>
                  <div className="text-sm text-gray-300">
                    {new Date(
                      userData.metrics.lastComplaint
                    ).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-400">Last Complaint</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Property Details */}
        <Card className="bg-[#152030] border-none">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Home className="h-5 w-5 text-fuchsia-200" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <div className="text-white font-medium">
                      {userData.property.address}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {userData.property.fullAddress}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {userData.property.city}, {userData.property.state} -{" "}
                      {userData.property.pincode}
                    </div>
                  </div>
                </div>
                {userData.property.propertyType && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      {userData.property.propertyType}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    {userData.property.bedrooms} Bedrooms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    {userData.property.bathrooms} Bathrooms
                  </span>
                </div>
                {userData.property.area && (
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      {userData.property.area} sq ft
                    </span>
                  </div>
                )}
                {userData.property.floor && (
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      Floor {userData.property.floor}/
                      {userData.property.totalFloors}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <Separator className="my-4 bg-gray-700" />
            <div>
              <h4 className="text-white font-medium mb-3">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {userData.property.hasLivingArea && <Badge>Living Area</Badge>}
                {userData.property.hasDiningArea && <Badge>Dining Area</Badge>}
                {userData.property.hasKitchen && <Badge>Kitchen</Badge>}
                {userData.property.hasUtility && <Badge>Utility</Badge>}
                {userData.property.hasGarden && <Badge>Garden</Badge>}
                {userData.property.hasPowderRoom && <Badge>Powder Room</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Complaints */}
          <Card className="bg-[#152030] border-none">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-200" />
                Recent Complaints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {userData.recentComplaints.length > 0 ? (
                    userData.recentComplaints.map((complaint) => (
                      <div
                        key={complaint.id}
                        className="p-3 bg-indigo-600/30 rounded-lg shadow-md shadow-indigo-500/20"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-white text-sm font-medium line-clamp-1">
                            {complaint.title || "Untitled Complaint"}
                          </h5>
                          <Badge
                            className={`text-xs ${getStatusColor(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </Badge>
                        </div>
                        <p className="text-white/90 text-xs line-clamp-2 mb-2">
                          {complaint.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {complaint.category}
                          </Badge>
                          <span className="text-xs text-white/80">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No recent complaints
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* All Complaints */}
          <div className="lg:col-span-2">
            <Card className="bg-[#152030] border-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="h-5 w-5 text-violet-200" />
                    All Complaints ({filteredComplaints.length})
                  </CardTitle>
                </div>
                <div className="flex gap-4 mt-4">
                  <Input
                    placeholder="Search complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#152030] text-white"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#152030]  border-violet-600/30 text-white rounded-md px-3 py-2"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="inProgress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredComplaints.length > 0 ? (
                      filteredComplaints.map((complaint) => (
                        <div
                          key={complaint.id}
                          className="p-4 bg-violet-600/30 rounded-lg border border-violet-400 hover:bg-violet-500/40 transition-colors shadow-md shadow-violet-500/20"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h5 className="text-white font-medium mb-1">
                                {complaint.title || "Untitled Complaint"}
                              </h5>
                              <p className="text-white/90 text-sm line-clamp-2">
                                {complaint.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge
                                className={`${getStatusColor(
                                  complaint.status
                                )}`}
                              >
                                {getStatusIcon(complaint.status)}
                                <span className="ml-1">{complaint.status}</span>
                              </Badge>
                              <Badge
                                className={`${getPriorityColor(
                                  complaint.priority
                                )}`}
                              >
                                {complaint.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {complaint.category}
                            </Badge>
                            <div className="text-xs text-white/80">
                              Created:{" "}
                              {new Date(
                                complaint.createdAt
                              ).toLocaleDateString()}
                              {complaint.resolvedAt && (
                                <span className="ml-2">
                                  • Resolved:{" "}
                                  {new Date(
                                    complaint.resolvedAt
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        No complaints found matching your criteria
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete User Section */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Delete User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be
                undone. All associated complaints and data will be permanently
                deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  const dialogTrigger = document.querySelector(
                    '[data-state="open"]'
                  );
                  if (dialogTrigger) {
                    const closeButton = dialogTrigger.querySelector(
                      '[data-slot="dialog-close"]'
                    );
                    if (closeButton instanceof HTMLElement) {
                      closeButton.click();
                    }
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    await deleteUser(userId);
                    toast.success("User deleted successfully");
                    router.push("/users");
                  } catch (error) {
                    toast.error("Failed to delete user");
                    console.error("Error deleting user:", error);
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
