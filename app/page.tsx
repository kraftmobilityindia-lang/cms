"use client";

import { type DashboardStats, getDashboardStats } from "@/lib/api/admin";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Users,
  Building2,
  AlertCircle,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchStats() {
    try {
      setIsLoading(true);
      const stats = await getDashboardStats();
      setStats(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  // Prepare pie chart data
  const complaintsPieData = stats
    ? [
        {
          name: "Open",
          value: stats.complaintsByStatus.open,
          color: "#ef4444",
        },
        {
          name: "In Progress",
          value: stats.complaintsByStatus.inProgress,
          color: "#f59e0b",
        },
        {
          name: "Resolved",
          value: stats.complaintsByStatus.resolved,
          color: "#10b981",
        },
        {
          name: "Closed",
          value: stats.complaintsByStatus.closed,
          color: "#6b7280",
        },
      ]
    : [];

  // Prepare bar chart data for overview
  const overviewData = stats
    ? [
        { name: "Users", value: stats.totalUsers, color: "#3b82f6" },
        { name: "Properties", value: stats.totalProperties, color: "#8b5cf6" },
        { name: "Complaints", value: stats.totalComplaints, color: "#ef4444" },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="bg-[#040d19] w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#040d19] w-full min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">kraftMobility</h1>
          </div>
        </div>
        <p className="text-gray-400 text-lg">Dashboard Overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-900 border-blue-500/50  shadow-lg shadow-blue-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">
              Total Users
            </CardTitle>
            <Users className="h-5 w-5 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-blue-200/70 mt-1">
              Active platform users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-900 border-purple-500/50 shadow-lg shadow-purple-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">
              Total Properties
            </CardTitle>
            <Building2 className="h-5 w-5 text-purple-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.totalProperties.toLocaleString()}
            </div>
            <p className="text-xs text-purple-200/70 mt-1">
              Managed properties
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-600 to-red-900 border-red-500/50 shadow-lg shadow-red-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-100">
              Total Complaints
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-red-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.totalComplaints.toLocaleString()}
            </div>
            <p className="text-xs text-red-200/70 mt-1">All time complaints</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Complaints Status Pie Chart */}
        <Card className="bg-[#152030] border-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-400" />
              <span>Complaints by Status</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Distribution of complaint statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                open: { label: "Open", color: "#ef4444" },
                inProgress: { label: "In Progress", color: "#f59e0b" },
                resolved: { label: "Resolved", color: "#10b981" },
                closed: { label: "Closed", color: "#6b7280" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complaintsPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {complaintsPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 mt-4 ">
              {complaintsPieData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-300">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overview Bar Chart */}
        <Card className="bg-[#152030] border-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span>Platform Overview</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Key metrics at a glance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: { label: "Users", color: "#3b82f6" },
                properties: { label: "Properties", color: "#8b5cf6" },
                complaints: { label: "Complaints", color: "#ef4444" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overviewData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Complaints Status Cards */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-red-900/20 border-red-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Open</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.complaintsByStatus.open}
                </p>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-900/20 border-yellow-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm font-medium">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-white">
                  {stats?.complaintsByStatus.inProgress}
                </p>
              </div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-900/20 border-green-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Resolved</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.complaintsByStatus.resolved}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/20 border-gray-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Closed</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.complaintsByStatus.closed}
                </p>
              </div>
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
