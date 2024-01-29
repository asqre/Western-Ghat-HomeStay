import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Option,
  Select,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  CardBody,
  IconButton,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { updateBookingSchema } from "@/schemas/updateBooking";
import { countriesData } from "@/data";
import { findCountryByCode } from "@/utils/findCountryByCode";
import { TrashIcon } from "@heroicons/react/24/solid";
import { updateBookingDetails, uploadImageToCloudinary } from "@/apiClient";
import { toast } from "sonner";
import { useMutation } from "react-query";
import { format } from "date-fns";
// import IndianDate from "@/utils/date";

export function UpdateBookingModal({
  open = false,
  handleOpen,
  defaultData,
  id,
}) {
  const [country, setCountry] = useState(0);

  const initialValues = {
    createdAt: "",
    checkIn: "",
    checkOut: "",
    bookedBy: "",
    numberOfKids: 0,
    numberOfAdults: 0,
    total_rent: 0,
    total_tax: 0,
    isCanceled: false,
    refundStatus: "",
    paymentStatus: "",
    guestInfo: [
      {
        title: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile_no: "",
        country_code: "91",
        doc_source: "",
      },
    ],
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: updateBookingSchema,
    onSubmit: async (values) => {
      try {
        const promise = () =>
          new Promise(async (resolve, reject) => {
            try {
              const response = await updateBookingMutation.mutateAsync({
                id,
                data: values,
              });
              handleOpen();
              resolve(response);
            } catch (error) {
              reject(error);
            }
          });
        toast.promise(promise, {
          loading: "Updating...",
          success: "Updated successfully",
          error: "Failed to update",
        });
      } catch (error) {
        console.error("Error occured", error);
      }
    },
  });

  useEffect(() => {
    if (defaultData) {
      formik.setValues({
        ...defaultData,
        checkIn: new IndianDate(defaultData?.checkIn),
        checkOut: new IndianDate(defaultData?.checkOut),
        isCanceled: defaultData.isCanceled.isCanceled,
      });
      // formik.setValues(defaultData);
    }
  }, [id]);

  const handleBookingFormChange = (e, key, value) => {
    if (!e) {
      formik.setFieldValue(key, value);
      return;
    }
    formik.handleChange(e);
  };
  const handleGuestInfoFormChange = (e, index, key, value) => {
    console.log({ e, index, key, value });
    if (!e) {
      const newGuest = [...formik.values.guestInfo];
      newGuest[index][key] = value;
      formik.setFieldValue("guestInfo", newGuest);
      return;
    }
    formik.handleChange(e);
  };

  const handleImageChange = async (e, handleData) => {
    try {
      const image = e.target.files[0];
      if (!image) return toast.error("Failed to select");

      const promise = () =>
        new Promise(async (resolve, reject) => {
          try {
            const image_url = await uploadImageToCloudinary(image);
            handleData(image_url);
            resolve(image_url);
          } catch (error) {
            reject(error);
          }
        });
      toast.promise(promise, {
        loading: "Loading...",
        success: "Image Uploaded successfully",
        error: "Failed to  upload",
      });
      return promise;
    } catch (error) {
      console.error(error);
    }
  };

  const updateBookingMutation = useMutation(updateBookingDetails);

  return (
    <Dialog open={open && defaultData && id} handler={handleOpen}>
      <DialogHeader className="text-center justify-center">
        Update Booking
      </DialogHeader>
      <DialogBody className="overflow-scroll h-[80vh]">
        <form
          className="mb-2 max-w-screen-xl m-auto"
          onSubmit={formik.handleSubmit}
        >
          <div className="items-end gap-6 grid grid-cols-2 px-6">
            <Input
              label="Check in"
              value={
                formik.values?.checkIn
                  ? format(formik.values?.checkIn, "PPP")
                  : ""
              }
              size={"md"}
            />
            <Input
              label="Check out"
              value={
                formik.values?.checkOut
                  ? format(formik.values?.checkOut, "PPP")
                  : ""
              }
              size={"md"}
            />
            <Input
              label="Date of booking"
              value={
                formik.values?.createdAt
                  ? format(new IndianDate(formik.values?.createdAt), "PPP")
                  : ""
              }
              size={"md"}
            />
            <Input
              size="lg"
              label="Booked By"
              name="bookedBy"
              value={formik.values.bookedBy}
              onChange={handleBookingFormChange}
              onBlur={formik.handleBlur}
              error={formik.touched.bookedBy && formik.errors.bookedBy}
            />
            <Input
              size="lg"
              label="Number of Adults"
              type="number"
              name="numberOfAdults"
              min={0}
              value={formik.values.numberOfAdults}
              onChange={handleBookingFormChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.numberOfAdults && formik.errors.numberOfAdults
              }
            />
            <Input
              size="lg"
              label="Number of Kids"
              type="number"
              name="numberOfKids"
              min={0}
              value={formik.values.numberOfKids}
              onChange={handleBookingFormChange}
              onBlur={formik.handleBlur}
              error={formik.touched.numberOfKids && formik.errors.numberOfKids}
            />
            <Input
              size="lg"
              label="Total Amount"
              type="number"
              name="total_rent"
              min={0}
              value={formik.values.total_rent}
              onChange={handleBookingFormChange}
              onBlur={formik.handleBlur}
              error={formik.touched.total_rent && formik.errors.total_rent}
            />
            <Input
              size="lg"
              label="Tax Amount"
              name="total_tax"
              type="number"
              min={0}
              value={formik.values.total_tax}
              onChange={handleBookingFormChange}
              onBlur={formik.handleBlur}
              error={formik.touched.total_tax && formik.errors.total_tax}
            />
            <Select
              label="Payment Status"
              value={formik.values.paymentStatus}
              name="paymentStatus"
              onChange={(val) =>
                handleBookingFormChange(null, "paymentStatus", val)
              }
              onBlur={formik.handleBlur}
              error={
                formik.touched.paymentStatus && formik.errors.paymentStatus
              }
            >
              <Option value="success">Success</Option>
              <Option value="failed">Failed</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
            <Select
              label="Cancelation Status"
              value={formik.values.isCanceled}
              name="isCanceled"
              onBlur={formik.handleBlur}
              error={formik.touched.isCanceled && formik.errors.isCanceled}
              onChange={(val) =>
                handleBookingFormChange(null, "isCanceled", val)
              }
            >
              <Option value={true}>Canceled</Option>
              <Option value={false}>Not Canceled</Option>
            </Select>
            {formik.values.isCanceled && (
              <div className="col-span-2">
                <Select
                  label="Refund Status"
                  value={formik.values.refundStatus}
                  name="refundStatus"
                  onChange={(val) =>
                    handleBookingFormChange(null, "refundStatus", val)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.refundStatus && formik.errors.refundStatus
                  }
                >
                  <Option value="processing">Processing</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="issued">Issued</Option>
                </Select>
              </div>
            )}{" "}
            <div className="col-span-2 mt-4">
              <Typography variant="h5">Guest Info</Typography>
            </div>
            <Card className="p-0 col-span-2 shadow-none grid gap-4">
              {formik.values?.guestInfo?.map((guest, index) => (
                <CardBody
                  className="grid grid-cols-2 gap-x-4 gap-y-5 bg-gray-50 shadow-md rounded-lg"
                  key={index}
                >
                  <Select
                    label="Title"
                    size="lg"
                    id={`guestInfo.${index}.title`}
                    name={`guestInfo.${index}.title`}
                    // value={formik.values.guestInfo[index]?.title}
                    value="Mr."
                    onChange={(val) =>
                      handleGuestInfoFormChange(null, index, "title", val)
                    }
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.guestInfo &&
                      formik.touched.guestInfo?.[index]?.title &&
                      formik.errors.guestInfo &&
                      formik.errors.guestInfo?.[index]?.title
                        ? true
                        : false
                    }
                  >
                    <Option value="Mr.">Mr.</Option>
                    <Option value="Mrs.">Mrs.</Option>
                    <Option value="Miss">Miss</Option>
                    <Option value="Ms.">Ms.</Option>
                  </Select>
                  <Input
                    size="lg"
                    label="First Name"
                    id={`guestInfo.${index}.first_name`}
                    name={`guestInfo.${index}.first_name`}
                    value={formik.values.guestInfo[index]?.first_name}
                    onChange={handleGuestInfoFormChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.guestInfo &&
                      formik.touched.guestInfo?.[index]?.first_name &&
                      formik.errors.guestInfo &&
                      formik.errors.guestInfo?.[index]?.first_name
                        ? true
                        : false
                    }
                  />
                  <Input
                    size="lg"
                    label="Last Name"
                    containerProps={{
                      className: "min-w-0 col-span-2",
                    }}
                    id={`guestInfo.${index}.last_name`}
                    name={`guestInfo.${index}.last_name`}
                    value={formik.values.guestInfo[index]?.last_name}
                    onChange={handleGuestInfoFormChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.guestInfo &&
                      formik.touched.guestInfo?.[index]?.last_name &&
                      formik.errors.guestInfo &&
                      formik.errors.guestInfo?.[index]?.last_name
                        ? true
                        : false
                    }
                  />
                  <Input
                    size="lg"
                    label="Email"
                    id={`guestInfo.${index}.email`}
                    name={`guestInfo.${index}.email`}
                    containerProps={{
                      className: "min-w-0 col-span-2",
                    }}
                    value={formik.values.guestInfo[index]?.email}
                    onChange={handleGuestInfoFormChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.guestInfo &&
                      formik.touched.guestInfo?.[index]?.email &&
                      formik.errors.guestInfo &&
                      formik.errors.guestInfo?.[index]?.email
                        ? true
                        : false
                    }
                  />
                  <div className="relative flex w-full col-span-2">
                    <Menu placement="bottom-start">
                      <MenuHandler size="lg">
                        <Button
                          size="lg"
                          ripple={false}
                          variant="text"
                          color="blue-gray"
                          className="flex h-11 gap-2 items-center rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 "
                        >
                          <span>
                            {
                              findCountryByCode(
                                formik.values.guestInfo[index]?.country_code
                              )?.flag
                            }
                          </span>
                          <span>
                            +{formik.values.guestInfo[index]?.country_code}
                          </span>
                        </Button>
                      </MenuHandler>
                      <MenuList className="max-h-[20rem] max-w-[18rem] z-[50000]">
                        {countriesData?.map((country) => {
                          return (
                            <MenuItem
                              key={country.name}
                              value={country.name}
                              className="flex items-center gap-2"
                              onClick={() =>
                                handleGuestInfoFormChange(
                                  null,
                                  index,
                                  "country_code",
                                  country.code
                                )
                              }
                            >
                              {country.flag} {country.name}{" "}
                              <span className="ml-auto">+ {country.code}</span>
                            </MenuItem>
                          );
                        })}
                      </MenuList>
                    </Menu>
                    <Input
                      type="tel"
                      size="lg"
                      placeholder="Mobile Number"
                      className="rounded-l-none"
                      labelProps={{
                        className:
                          "before:content-none after:content-none col-span-2",
                      }}
                      containerProps={{
                        className: "min-w-0",
                      }}
                      id={`guestInfo.${index}.mobile_no`}
                      name={`guestInfo.${index}.mobile_no`}
                      value={formik.values.guestInfo[index]?.mobile_no}
                      onChange={handleBookingFormChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.guestInfo?.[index]?.mobile_no &&
                        formik.errors.guestInfo?.[index]?.mobile_no
                      }
                    />
                  </div>
                  {formik.values.guestInfo[index]?.doc_source ? (
                    <div className="col-span-2 h-44 group relative">
                      <img
                        src={formik.values.guestInfo[index]?.doc_source}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div className="absolute right-4 bottom-4 shadow-lg">
                        <IconButton
                          className="hidden group-hover:block transition-all"
                          onClick={() =>
                            handleGuestInfoFormChange(
                              null,
                              index,
                              "doc_source",
                              ""
                            )
                          }
                        >
                          <TrashIcon className="text-lg text-white w-6" />
                        </IconButton>
                      </div>
                    </div>
                  ) : (
                    <Input
                      type="file"
                      size="lg"
                      placeholder="Selecet Card"
                      containerProps={{
                        className: "min-w-0 col-span-2",
                      }}
                      onChange={async (e) => {
                        await handleImageChange(e, (res) =>
                          handleGuestInfoFormChange(
                            null,
                            index,
                            "doc_source",
                            res
                          )
                        );
                        // console.log({ res: JSON.stringify(res) });
                      }}
                    />
                  )}
                </CardBody>
              ))}
              <Button
                className="block ml-auto"
                onClick={() =>
                  formik.setFieldValue("guestInfo", [
                    ...formik.values.guestInfo,
                    initialValues.guestInfo[0],
                  ])
                }
              >
                Add Guest
              </Button>
            </Card>
          </div>
          <Button type="submit" className="my-6" fullWidth>
            Update
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
}
