import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error("Invalid or missing token");
        setIsVerifying(false);
        return;
      }

      try {
        await Promise.all([
          axios.post("http://localhost:8000/api/v1/auth/verify-email", { token }),
          new Promise((resolve) => setTimeout(resolve, 1500)) // 👈 enforce 2s minimum loading
        ]);

        setIsSuccess(true);
        toast.success("Email verified successfully");
      } catch (error) {
        // console.error("Verification error:", error);
        const errorMessage =
          error.response?.data?.message || "Email verification failed";
        toast.error(errorMessage);
        setIsSuccess(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">Verify Email</h1>
      <p className="text-sm text-gray-500 mb-6">
        Checking your email status...
      </p>

      <Card className="w-full max-w-md">
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 space-y-2">
            {isVerifying ? (
              <>
                <Loader className="w-10 h-10 text-gray-500 animate-spin" />
                <h3 className="text-lg font-semibold">Verifying email...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify your email.
                </p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500" style={{ animationDelay: "1000ms" }} />
                <h3 className="text-lg font-semibold">Email Verified</h3>
                <p className="text-sm text-gray-500">
                  Your email has been verified successfully.
                </p>
                <Link to="/login" className="mt-4">
                  <Button variant="outline">  
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign in
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10 text-red-500" />
                <h3 className="text-lg font-semibold">Verification Failed</h3>
                <p className="text-sm text-gray-500">
                  Your email verification failed. Please try again or request a
                  new link.
                </p>
                <Link to="/login" className="mt-4">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
