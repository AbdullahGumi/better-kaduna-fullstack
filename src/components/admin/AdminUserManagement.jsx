"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import apiService from "@/services/apiService";
import { toast } from "react-toastify";

const AdminUserManagement = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "registered",
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersData = await apiService.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load users", { autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Name, email, and password are required", {
        autoClose: 3000,
      });
      return;
    }
    try {
      const createdUser = await apiService.createUser({
        ...newUser,
        createdAt: new Date().toISOString(),
      });
      setUsers([...users, createdUser]);
      setNewUser({ name: "", email: "", password: "", role: "registered" });
      toast.success("User created successfully", { autoClose: 2000 });
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user", { autoClose: 3000 });
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser.name || !editingUser.email) {
      toast.error("Name and email are required", { autoClose: 3000 });
      return;
    }
    try {
      // Remove password from update - admins cannot change user passwords
      const { password: _password, ...userDataWithoutPassword } = editingUser;
      const updatedUser = await apiService.updateUser(
        editingUser.id,
        userDataWithoutPassword
      );
      setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
      setEditingUser(null);
      toast.success("User updated successfully", { autoClose: 2000 });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user", { autoClose: 3000 });
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiService.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User deleted successfully", { autoClose: 2000 });
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user", { autoClose: 3000 });
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Access Denied</h1>
        <p className="text-gray-600">
          Please log in as an admin to access this page.
        </p>
        <button
          onClick={() => router.push("/")}
          className="text-green-600 hover:text-green-700 mt-4 inline-block"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center sm:text-left">Manage Users</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {editingUser ? "Edit User" : "Create New User"}
          </h2>
          <form
            onSubmit={editingUser ? handleEditUser : handleCreateUser}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={editingUser ? editingUser.name : newUser.name}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, name: e.target.value })
                    : setNewUser({ ...newUser, name: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="User Name"
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={editingUser ? editingUser.email : newUser.email}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, email: e.target.value })
                    : setNewUser({ ...newUser, email: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="User Email"
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={editingUser ? "" : newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={
                  editingUser
                    ? "Password cannot be changed by admin"
                    : "User Password"
                }
                disabled={editingUser ? true : false}
                aria-required={!editingUser}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={editingUser ? editingUser.role : newUser.role}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, role: e.target.value })
                    : setNewUser({ ...newUser, role: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="registered">Registered</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-green px-4 py-3 sm:py-2 rounded-md hover:shadow-sm transition transform active:scale-95 sm:hover:scale-105 w-full sm:w-auto relative z-10"
            >
              {editingUser ? "Update User" : "Create User"}
            </button>
            {editingUser && (
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-gray-600 hover:text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            User List
          </h2>
          {loading ? (
            <p className="text-gray-600">Loading users...</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row justify-between sm:items-center border-b py-4 sm:py-2 gap-4"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{u.name}</p>
                    <p className="text-sm text-gray-600">
                      {u.email} ({u.role})
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-2 border-t sm:border-t-0 pt-3 sm:pt-0 relative z-10">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-green-600 hover:text-green-700 p-2 border border-green-100 sm:border-0 rounded-md sm:rounded-none flex-1 sm:flex-initial text-center transition-all active:scale-95"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-600 hover:text-red-800 p-2 border border-red-100 sm:border-0 rounded-md sm:rounded-none flex-1 sm:flex-initial text-center transition-all active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => router.push("/admin")}
        className="text-green-600 hover:text-green-700 mt-6 inline-block transition-all active:scale-95"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default AdminUserManagement;
