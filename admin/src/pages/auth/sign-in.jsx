import { adminLogin } from "@/apiClient/auth";
import { singInSchema } from "@/schemas";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "@/context";

export function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const adminLoginMutation = useMutation(adminLogin);
  const initialValues = { email: "", password: "" };
  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: singInSchema,
    onSubmit: async ({ email, password }) => {
      try {
        const res = await adminLoginMutation.mutateAsync({
          admin_email: email,
          admin_password: password,
        });
        if (res.success) {
          await toast.success(res?.message);
          await window.localStorage.setItem("admin", JSON.stringify(res.admin));
          await window.localStorage.setItem("token", res.token);
          await Cookies.set("token", res.token, { expires: 7 });
          await login(res.token);
          await navigate("/dashboard/profile");
          return;
        }
        toast.error(res?.message);
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.error("Error occured", error);
      }
    },
  });

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mx-auto mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Log In
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Welcome to WesternGhat admin
          </Typography>
        </div>
        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your email
            </Typography>
            <div>
              <Input
                size="lg"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="email"
                type="email"
                autoComplete="off"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && (
                <span className="font-medium tracking-wide text-red-400 text-xs mt-1 ml-1 inline-block h-3.5">
                  {errors.email}
                </span>
              )}
            </div>
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Password
            </Typography>
            <div>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                autoComplete="off"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && (
                <span className="font-medium tracking-wide text-red-400 text-xs mt-1 ml-1 inline-block h-3.5">
                  {errors.password}
                </span>
              )}
            </div>
          </div>
          <Button className="mt-6" fullWidth type="submit">
            Log In
          </Button>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
