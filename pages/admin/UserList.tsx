import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/api';
import { UserResponse } from '../../types';
import { Shield, Ban, CheckCircle, Eye, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (user: UserResponse) => {
    if(!window.confirm(`Are you sure you want to ${user.banned ? 'unban' : 'ban'} ${user.username}?`)) return;
    try {
        await userService.setBanned(user.id, !user.banned);
        // Optimistic update
        setUsers(users.map(u => u.id === user.id ? {...u, banned: !u.banned} : u));
    } catch (e) {
        alert("Failed to update ban status");
    }
  };

  // Prepare Chart Data: Registrations over time (by month/year)
  const chartData = useMemo(() => {
      const grouped: {[key: string]: number} = {};
      users.forEach(u => {
          if(u.createdAt) {
            const date = new Date(u.createdAt);
            const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
            grouped[key] = (grouped[key] || 0) + 1;
          }
      });
      return Object.entries(grouped).map(([name, count]) => ({ name, count }));
  }, [users]);

  if (loading) return <div className="text-white text-center pt-10">Loading users...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Shield className="text-brand-400" /> Admin User Management
            </h1>
            <div className="bg-brand-800 px-4 py-2 rounded-lg border border-brand-700 text-sm text-gray-300">
                Total Users: <span className="text-white font-bold ml-1">{users.length}</span>
            </div>
        </div>

        {/* Stats Chart */}
        <div className="bg-brand-800 p-6 rounded-xl border border-brand-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart2 size={18} /> User Registrations Over Time
            </h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                            itemStyle={{ color: '#60a5fa' }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Registrations" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* User Table */}
        <div className="bg-brand-800 rounded-xl border border-brand-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-brand-900 text-xs uppercase text-gray-300">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-brand-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{user.username}</div>
                                            <div className="text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.role === 'ADMIN' ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-400 bg-purple-900/30 px-2 py-1 rounded">
                                            <Shield size={10} /> ADMIN
                                        </span>
                                    ) : (
                                        <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded">
                                            USER
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {user.banned ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-900/50 text-red-400 border border-red-900">
                                            <Ban size={10} /> Banned
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-900">
                                            <CheckCircle size={10} /> Active
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link 
                                            to={`/admin/users/${user.id}`}
                                            className="p-1.5 hover:bg-brand-600 rounded-md text-gray-300 hover:text-white transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        {user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => handleToggleBan(user)}
                                                className={`p-1.5 rounded-md transition-colors ${
                                                    user.banned 
                                                    ? 'text-green-400 hover:bg-green-900/50' 
                                                    : 'text-red-400 hover:bg-red-900/50'
                                                }`}
                                                title={user.banned ? "Unban User" : "Ban User"}
                                            >
                                                {user.banned ? <CheckCircle size={18} /> : <Ban size={18} />}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};