import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp?: string; // Optional for OTP verification
};

const Register = () => {
  const { showToast } = useAppContext();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(apiClient.sendRegisterOtp, {
    onSuccess: async (data) => {
      // await queryClient.invalidateQueries("validateToken");
      showToast({ message: data.message, type: "SUCCESS" });
      setIsOtpSent(true);
      setResendTimer(10);
      setFocus("otp");
      // navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const { mutate: verifyOtpMutate, isLoading: verifyOtpLoading } = useMutation(
    apiClient.verifyRegisterOtp,
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries("validateToken");
        showToast({ message: data.message, type: "SUCCESS" });
        navigate("/");
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    }
  );

  const onSubmit = handleSubmit((data) => {
    isOtpSent ? verifyOtpMutate(data) : mutate(data);
  });

  const handleResendOtp = () => {
    const formValues = watch();
    const { otp, ...rest } = formValues;
    mutate(rest);
    setResendTimer(60);
    setFocus("otp");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (resendTimer > 0) {
        setResendTimer((prev) => prev - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal disabled:bg-gray-100 "
            {...register("firstName", { required: "First Name is required" })}
            placeholder="Enter First Name..."
            disabled={isOtpSent}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal disabled:bg-gray-100 "
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Enter Last Name..."
            disabled={isOtpSent}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal disabled:bg-gray-100 "
          {...register("email", { required: "Email is required" })}
          placeholder="Enter Your Email..."
          disabled={isOtpSent}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal disabled:bg-gray-100 "
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password of at least 6 Character is required",
            },
          })}
          placeholder="Enter password between 6-20 digits..."
          disabled={isOtpSent}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Confirm Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal disabled:bg-gray-100 "
          {...register("confirmPassword", {
            validate: (value) => {
              if (!value) {
                return "Confirm Password is required";
              } else if (watch("password") !== value) {
                return "Your Passwords do not match";
              }
            },
          })}
          placeholder="Enter password again..."
          disabled={isOtpSent}
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      {isOtpSent && (
        <label className="text-gray-700 text-sm font-bold max-w-[240px]">
          Enter OTP
          <input
            type="password"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("otp", {
              required: isOtpSent
                ? { value: true, message: "OTP is required" }
                : false,
              minLength: { value: 6, message: "OTP must be 6 digits" },
              maxLength: { value: 6, message: "OTP must be 6 digits" },
            })}
            placeholder="Enter OTP..."
          />
          {errors.otp && (
            <span className="text-red-500">{errors.otp.message}</span>
          )}
        </label>
      )}
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Already Registered?{" "}
          <Link className="underline" to="/sign-in">
            Sign in here
          </Link>
        </span>
        <span className="flex gap-3">
          {isOtpSent && (
            <button
              type="button"
              onClick={handleResendOtp}
              className="bg-blue-600 cursor-pointer text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={resendTimer > 0}
            >
              Resend OTP {resendTimer > 0 && `in ${resendTimer} s`}
            </button>
          )}

          <button
            type="submit"
            className="bg-blue-600 cursor-pointer text-white p-2 font-bold hover:bg-blue-500 text-xl"
          >
            {isOtpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </span>
      </span>

      {(isLoading || verifyOtpLoading) && <Loader />}
    </form>
  );
};

export default Register;
