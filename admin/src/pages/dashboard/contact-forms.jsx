import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { getContactForm } from "@/apiClient/contactForm";
import { useQuery } from "react-query";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export function ContactForms() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: contactData } = useQuery("messages", getContactForm);

  return (
    <div>
      <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm mt-8">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex justify-between p-6"
        >
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">
              View Contact Messages
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <CheckCircleIcon
                strokeWidth={3}
                className="h-4 w-4  text-green-700"
              />
              <strong>{contactData?.length ?? 0}</strong> Messages
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["name", "email", "phone", "message"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-6 text-left"
                  >
                    <Typography
                      variant="small"
                      className="font-medium uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contactData
                ?.slice(0, itemsPerPage)
                .map(({ name, email, country_code, phone, message }, key) => {
                  const className = `py-3 px-5 ${
                    key === contactData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="font-medium text-blue-gray-600 hover:underline"
                        >
                          <Link to={`mailto:${email}`}>{email}</Link>
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block font-medium text-blue-gray-600 hover:underline"
                          >
                            <Link to={`tel:+${country_code}${phone}`}>
                              +{country_code} {phone}
                            </Link>
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="font-medium text-blue-gray-600"
                        >
                          {message}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            {contactData?.length > itemsPerPage && (
              <button
                onClick={() => setItemsPerPage(itemsPerPage + 10)}
                className="mt-2 ml-5 text-blue-500 underline cursor-pointer"
              >
                Show More
              </button>
            )}
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
