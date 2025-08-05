import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin"); // 👈 add role state
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !role) {
      toast.error("Please enter your email and select a role");
      return;
    }

    setIsPending(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/reset-password-request",
        {
          email,
          role, // 👈 include role
        }
      );

      toast.success(response.data.message || "Reset email sent successfully");
      setIsSuccess(true);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground">
            Enter your email and select your role to receive a reset link
          </p>
        </div>

        <Card>
          <CardHeader>
            <Link to="/login" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to sign in</span>
            </Link>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <CheckCircle className="w-10 h-10 text-green-500" />
                <h2 className="text-lg font-bold text-center">
                  Reset password email sent!
                </h2>
                <p className="text-muted-foreground text-center">
                  Please check your inbox and follow the link to reset your
                  password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordRequest;