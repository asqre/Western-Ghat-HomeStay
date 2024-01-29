import {
  getAdminProfile,
  updateAdminPassword,
  updateAdminProfile,
} from "@/apiClient/profile";
import { useState } from "react";
import { Card, Typography, Button, Input } from "@material-tailwind/react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

export function Profile() {
  const [profile, setProfile] = useState({});
  const [password, setPassword] = useState({});
  const { data: adminProfile } = useQuery("admin-profile", getAdminProfile);

  const updateFields = ({ target }) => {
    const { name, value } = target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };
  const updateSocialMedia = ({ target }) => {
    const { name, value } = target;
    setProfile({
      ...profile,
      social_media: {
        ...adminProfile.social_media,
        [name]: value,
      },
    });
  };
  const updatePassword = ({ target }) => {
    const { name, value } = target;
    setPassword({
      ...password,
      [name]: value,
    });
  };

  const updateAdminProfileMutation = useMutation(updateAdminProfile);
  const updateAdminPasswordMutation = useMutation(updateAdminPassword);

  const updateProfileHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await updateAdminProfileMutation.mutateAsync(profile);
      toast.success(res.message);
    } catch (error) {
      console.error("Error occured");
    }
  };

  const updatePasswordHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await updateAdminPasswordMutation.mutateAsync(password);
      if (res.success) return toast.success(res.message);
      toast.error(res?.message ?? "Failed to update");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message ?? "Error occured");
    }
  };

  return (
    <div>
      <Card
        color="transparent"
        shadow={false}
        className="w-full mt-12 p-10 shadow-md"
      >
        <Typography variant="h4" color="blue-gray">
          Profile
        </Typography>
        <form className="mt-8 mb-2 w-full" onSubmit={updateProfileHandler}>
          <div className="mb-1 grid gap-6 grid-cols-2">
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                type="email"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                defaultValue={adminProfile?.admin_email}
                onChange={({ target }) =>
                  setProfile({ ...profile, admin_email: target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Instagram
              </Typography>
              <Input
                type="text"
                size="lg"
                placeholder="https://instagram.com/*"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                defaultValue={adminProfile?.social_media?.instagram}
                name="instagram"
                onChange={updateSocialMedia}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Facebook
              </Typography>
              <Input
                type="text"
                size="lg"
                placeholder="https://facebook.com/*"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                defaultValue={adminProfile?.social_media?.facebook}
                name="facebook"
                onChange={updateSocialMedia}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Twitter
              </Typography>
              <Input
                type="text"
                size="lg"
                placeholder="https://twitter.com/*"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="twitter"
                onChange={updateSocialMedia}
                defaultValue={adminProfile?.social_media?.twitter}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                LinkedIn
              </Typography>
              <Input
                type="text"
                size="lg"
                placeholder="https://linkedin.com/*"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="linkedin"
                onChange={updateSocialMedia}
                defaultValue={adminProfile?.social_media?.linkedin}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                YouTube
              </Typography>
              <Input
                type="text"
                size="lg"
                placeholder="https://youtube.com/*"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="youtube"
                onChange={updateSocialMedia}
                defaultValue={adminProfile?.social_media?.youtube}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Per Night Charge
              </Typography>
              <Input
                type="number"
                min={0}
                size="lg"
                placeholder="Ex. 5000"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="per_night_charge"
                onChange={updateFields}
                defaultValue={adminProfile?.per_night_charge}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Adults Charge
              </Typography>
              <Input
                type="number"
                min={0}
                size="lg"
                placeholder="Ex. 1000"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="adults_charge"
                onChange={updateFields}
                defaultValue={adminProfile?.adults_charge}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Kids Charge
              </Typography>
              <Input
                type="number"
                min={0}
                size="lg"
                placeholder="Ex. 500"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="kids_charge"
                onChange={updateFields}
                defaultValue={adminProfile?.kids_charge}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Min Tax amount
              </Typography>
              <Input
                type="number"
                min={0}
                size="lg"
                placeholder="Ex. 500"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="min_tax_amount"
                onChange={updateFields}
                defaultValue={adminProfile?.min_tax_amount}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Min Tax percentage (%)
              </Typography>
              <Input
                type="number"
                min={0}
                size="lg"
                placeholder="Ex. 500"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="min_tax_percentage"
                onChange={updateFields}
                defaultValue={adminProfile?.min_tax_percentage}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Max Tax percentage (%)
              </Typography>
              <Input
                type="number"
                min={0}
                size="lg"
                placeholder="Ex. 500"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="max_tax_percentage"
                onChange={updateFields}
                defaultValue={adminProfile?.max_tax_percentage}
                autoComplete="off"
              />
            </div>
          </div>

          <Button className="mt-6" fullWidth type="submit">
            Update
          </Button>
        </form>
      </Card>
      <Card
        color="transparent"
        shadow={false}
        className="w-full mt-12 p-10 shadow-md"
      >
        <Typography variant="h4" color="blue-gray">
          Password
        </Typography>
        {/* <Typography color="gray" className="mt-1 font-normal">
        Nice to meet you! Enter your details to register.
      </Typography> */}
        <form className="mt-8 mb-2 w-full" onSubmit={updatePasswordHandler}>
          <div className="mb-1 grid gap-6 grid-cols-2">
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Current Password
              </Typography>
              <Input
                size="lg"
                placeholder="Current Password"
                type="password"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="admin_password_current"
                onChange={updatePassword}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                New Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="New Password"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="admin_password_new"
                onChange={updatePassword}
              />
            </div>
          </div>

          <Button
            className="mt-6"
            fullWidth
            type="submit"
            disabled={
              !password.admin_password_current || !password.admin_password_new
            }
          >
            change password
          </Button>
        </form>
      </Card>
    </div>
  );
}
