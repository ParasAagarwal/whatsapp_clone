import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/vaidation";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import AuthInput from "./AuthInput";
import { changeStatus, registerUser } from "../../features/userSlice";
import Picture from "./Picture";
import { useState } from "react";
import axios from "axios";

const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);
  const [picture, setPicture] = useState();
  const [readablePicture, setReadablePicture] = useState("");

  const {
    register, //register input data to keep track of it
    handleSubmit,
    watch, //watch for the value of input
    formState: { errors },
  } = useForm({ resolver: yupResolver(signUpSchema) }); //react-hookform-resolver for "yup" to validation input

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));
    if (picture) {
      //upload to cloudinary and then register user
      await uploadImage().then(async (response) => {
        // After the image is uploaded, register the user with the image URL
        let res = await dispatch(
          registerUser({ ...data, picture: response.secure_url })
        );
        if (res?.payload?.user) {
          navigate("/");
        }
      });
    } else {
      let res = await dispatch(registerUser({ ...data, picture: "" }));
      if (res?.payload?.user) {
        navigate("/");
      }
    }
  };

  const uploadImage = async () => {
    let formData = new FormData();
    //upload_preset is a predefined Cloudinary setting that defines how the uploaded file should be handled.
    formData.append("upload_preset", cloud_secret);
    formData.append("file", picture);
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData//uploading image
    );
    return data;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/* Heading */}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Welcome</h2>
          <p className="mt-2 text-sm">Sign up</p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* input component */}
          <AuthInput
            name="name"
            type="text"
            placeholder="Full Name"
            register={register}
            error={errors?.name?.message}
          />
          <AuthInput
            name="email"
            type="text"
            placeholder="Email address"
            register={register}
            error={errors?.email?.message}
          />
          <AuthInput
            name="status"
            type="text"
            placeholder="Status (Optional)"
            register={register}
            error={errors?.status?.message}
          />
          <AuthInput
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            error={errors?.password?.message}
          />
          {/* Picture */}
          <Picture
            readablePicture={readablePicture}
            setReadablePicture={setReadablePicture}
            setPicture={setPicture}
          />
          {/* if we have an error */}
          {error ? <div className="text-red-400">{error}</div> : null}
          {/* Submit button */}
          <button
            type="submit"
            className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-green_2 shadow-lg cursor-pointer transition ease-in duration-300"
          >
            {status === "loading" ? (
              <PulseLoader color="#fff" size={16} /> //react-spinner
            ) : (
              "Sign up"
            )}
          </button>
          {/* Sign in Link */}
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
            <span>Already have an account ?</span>
            <Link
              to="/login"
              className=" hover:underline cursor-pointer transition ease-in duration-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
