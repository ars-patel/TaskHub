import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  Users,
  Wrench,
  Archive
} from 'lucide-react';

const SidebarDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const location = useLocation();

  // On mount, get role and user from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setRole(storedRole);
    setUser(storedUser);
  }, []);

  const cn = (...classes) => classes.filter(Boolean).join(' ');

  // Admin navigation items
  const adminItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Workspaces", icon: Users, path: "/workspaces" },
    { title: "Tasks", icon: ListCheck, path: "/tasks" },
    { title: "Members", icon: Users, path: "/members" },
    { title: "Archived", icon: Archive, path: "/archived" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];

  // Member navigation items
  const memberItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Workspaces", icon: Users, path: "/workspaces" },
    { title: "My Tasks", icon: ListCheck, path: "/my-tasks" },
    { title: "Members", icon: Users, path: "/members" },
  ];

  // Determine which items to show based on role
  const filteredItems = role === "Admin" ? adminItems : memberItems;

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = '/login';
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col border-r border-gray-200 bg-white h-screen transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-black" />
            {!isCollapsed && (
              <span className="font-semibold text-lg text-black">TaskHub</span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronsRight className="h-4 w-4 text-black" />
            ) : (
              <ChevronsLeft className="h-4 w-4 text-black" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {filteredItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "w-full flex items-center rounded-md p-2 hover:bg-gray-100 transition-colors",
                  location.pathname === item.path ? 'bg-gray-100 text-blue-600' : 'text-gray-700',
                  isCollapsed ? "justify-center" : "justify-start gap-3"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsLogoutOpen(true)}
            className={cn(
              "w-full flex items-center rounded-md p-2 hover:bg-gray-100 transition-colors text-gray-700",
              isCollapsed ? "justify-center" : "justify-start gap-3"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {isLogoutOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Log out of TaskHuh?</h2>
            <p className="text-sm text-gray-600 mb-6">
              You'll need to log back in to access your account.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={() => setIsLogoutOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-red-600"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarDashboard;