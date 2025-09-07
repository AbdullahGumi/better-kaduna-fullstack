import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import apiService from "../../services/apiService";
import { toast } from "react-toastify";

const AdminUserManagement = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-kaduna-gray mb-6">
          Access Denied
        </h1>
        <p className="text-kaduna-gray">
          Please log in as an admin to access this page.
        </p>
        <Link
          to="/"
          className="text-kaduna-green hover:text-kaduna-green-dark mt-4 inline-block"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-kaduna-gray">Manage Users</h1>
        <button
          onClick={handleLogout}
          className="btn-green px-4 py-2 rounded-md hover:shadow-sm transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-kaduna-gray mb-4">
            {editingUser ? "Edit User" : "Create New User"}
          </h2>
          <form
            onSubmit={editingUser ? handleEditUser : handleCreateUser}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-kaduna-gray">
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
                placeholder="User Name"
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-kaduna-gray">
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
                placeholder="User Email"
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-kaduna-gray">
                Password
              </label>
              <input
                type="password"
                value={editingUser ? "" : newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
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
              <label className="block text-sm font-medium text-kaduna-gray">
                Role
              </label>
              <select
                value={editingUser ? editingUser.role : newUser.role}
                onChange={(e) =>
                  editingUser
                    ? setEditingUser({ ...editingUser, role: e.target.value })
                    : setNewUser({ ...newUser, role: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
              >
                <option value="registered">Registered</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-green px-4 py-2 rounded-md hover:shadow-sm transition transform hover:scale-105"
            >
              {editingUser ? "Update User" : "Create User"}
            </button>
            {editingUser && (
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-kaduna-gray hover:text-kaduna-green px-4 py-2 rounded-md"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-kaduna-gray mb-4">
            User List
          </h2>
          {loading ? (
            <p className="text-kaduna-gray">Loading users...</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div>
                    <p className="text-kaduna-gray font-medium">{u.name}</p>
                    <p className="text-sm text-kaduna-gray">
                      {u.email} ({u.role})
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="text-kaduna-green hover:text-kaduna-green-dark"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-600 hover:text-red-800"
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
      <Link
        to="/admin"
        className="text-kaduna-green hover:text-kaduna-green-dark mt-6 inline-block"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default AdminUserManagement;
