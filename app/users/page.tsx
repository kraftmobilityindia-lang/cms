"use client";

import { getAllUsers, type UsersResponse } from "@/lib/api/admin";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [users, setUsers] = useState<UsersResponse>();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchUsers() {
    try {
      setLoading(true);
      const users = await getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers =
    users?.users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRowClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  const handleAddUser = () => {
    router.push("/users/add");
  };

  return (
    <div className="bg-[#040d19] min-h-screen p-6 w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Users</h1>
              <p className="text-gray-400">Manage all kraftMobility users</p>
            </div>
          </div>
          <Button
            onClick={handleAddUser}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-4 w-6 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats Card */}
        <Card className="bg-[#152030] border-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Total Users: {users?.totalUsers || 0}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Search and Table Card */}
        <Card className="bg-[#152030] border-none">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-slate-800/80 backdrop-blur-sm">
                  <TableRow className="border-slate-700 hover:bg-slate-700/30">
                    <TableHead className="text-gray-300 font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold">
                      Mobile
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold">
                      Email
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold">
                      Complaints
                    </TableHead>
                    <TableHead className="text-gray-300 font-semibold">
                      Created At
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                          Loading users...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-400"
                      >
                        {searchTerm
                          ? "No users found matching your search."
                          : "No users found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        onClick={() => handleRowClick(user.id)}
                        className="border-slate-700 hover:bg-slate-700/30 cursor-pointer transition-colors duration-200"
                      >
                        <TableCell className="text-white font-medium">
                          {user.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {user.mobile}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {user.email || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-sm">
                            {user._count.complaints}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {formatDate(user.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
