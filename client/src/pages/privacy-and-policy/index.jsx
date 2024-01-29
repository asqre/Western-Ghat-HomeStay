import MainLayout from "@/layouts/Main";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <div className="container m-auto md: w-2/3 py-5">
        <h1 className="font-semibold text-3xl pb-5 mb-10 border-b-2 border-b-gray-300">
          Privacy Policy
        </h1>
        <p className="text-md leading-loose mb-12">
          Privacy Policy At Western Ghat HomeStay, ensuring the privacy and
          security of our guests&apos; personal information is of utmost
          importance to us. This Privacy Policy outlines how we collect, use,
          disclose, and protect the information gathered through our online
          booking services and during your stay with us.
        </p>
        <b className="block text-xl font-bold mb-3">Information We Collect:</b>
        <b className="block text-xl font-semibold underline mb-2">
          Personal information:
        </b>
        <p className="text-md leading-loose mb-8">
          This may include your name, email address, phone number, address,
          payment information, passport or ID details, and any other information
          you voluntarily provide to us.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Booking information:
        </b>
        <p className="text-md leading-loose mb-8">
          This may include your arrival and departure dates, number of guests,
          room type, and any special requests you have.{" "}
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Usage data:
        </b>
        <p className="text-md leading-loose mb-8">
          This may include information about your use of our website, such as
          the pages you visit, the links you click, and the device you use.
          Security data: This may include information about your device, such as
          your IP address, browser type, and operating system.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          How We Use Your Information:
        </b>
        <p className="text-md leading-loose mb-8">
          To process your booking and provide you with our services. To
          communicate with you about your booking, including sending you
          confirmation emails and updates. To personalize your experience on our
          website. To analyze and improve our website and services. To comply
          with applicable laws and regulations. To protect the security and
          integrity of our website and services. How We Share Your Information:
          With service providers who help us operate our website and services,
          such as payment processors, booking platforms, and email marketing
          providers. With government agencies or law enforcement officials when
          required by law. With other third parties with your consent. Data
          Retention: We will retain your personal information for as long as
          necessary to fulfill the purposes described in this Privacy Policy,
          unless a longer retention period is required or permitted by law. Your
          Rights: You have the right to access, correct, delete, or restrict the
          processing of your personal information. You also have the right to
          object to the processing of your personal information and to data
          portability.
        </p>
        <b className="block text-xl font-semibold underline mb-2">Security:</b>
        <p className="text-md leading-loose mb-8">
          We take reasonable measures to protect your personal information from
          unauthorized access, use, disclosure, alteration, or destruction.
          However, no website or internet transmission is completely secure.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Children&apos;s Privacy:
        </b>
        <p className="text-md leading-loose mb-8">
          Our website is not directed at children under the age of 18. We do not
          knowingly collect personal information from children under 18. If you
          are a parent or guardian and you believe that your child has provided
          us with personal information, please contact us immediately.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Changes to This Privacy Policy:
        </b>
        <p className="text-md leading-loose mb-8">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on our website.
          You are advised to review this Privacy Policy regularly for any
          changes.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Contact Us:
        </b>
        <p className="text-md leading-loose mb-8">
          If you have any questions about this Privacy Policy, please contact us
          at: Western Ghat Homestay{" "}
          <a
            className="text-blue-500 hover:underline"
            href="mailto:wghomestay@gmail.com"
          >
            wghomestay@gmail.com
          </a>
        </p>
      </div>
    </MainLayout>
  );
}
