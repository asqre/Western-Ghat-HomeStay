import MainLayout from "@/layouts/Main";
import React from "react";

export default function TnC() {
  return (
    <MainLayout>
      <div className="container m-auto md: w-2/3 py-5">
        <h1 className="font-semibold text-3xl pb-5 mb-10 border-b-2 border-b-gray-300">
          Terms & Conditions
        </h1>
        <b className="block text-xl font-semibold underline mb-2">
          Acceptance of Terms:
        </b>
        <b className="block text-xl font-semibold underline mb-2"></b>
        <p className="text-md leading-loose mb-8">
          By accessing or using our Site or booking a room at our Homestay, you
          agree to be bound by these Terms. If you do not agree to these Terms,
          please do not use our Site or book a room at our Homestay.
        </p>

        <b className="block text-xl font-semibold underline mb-2">
          Booking and Payment:
        </b>
        <p className="text-md leading-loose mb-8">
          All bookings must be made through our website or by contacting us
          directly. Full payment is required at the time of booking. We accept
          payment through various online payment gateways. We reserve the right
          to cancel any booking for any reason, including but not limited to,
          non-payment, fraudulent activity, or violation of these Terms. We are
          not responsible for any errors or omissions in our online booking
          system.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Rates and Availability:
        </b>
        <p className="text-md leading-loose mb-8">
          Rates are subject to change without notice. Rates are based on single
          or double occupancy. Additional guests may be subject to additional
          charges. We reserve the right to refuse any booking at our discretion.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Check-in and Check-out:
        </b>
        <p className="text-md leading-loose mb-8">
          Check-in time is after 2:00 PM. Check-out time is before 11:00 AM.
          Late check-out may be available upon request for an additional fee. We
          reserve the right to refuse entry to anyone who arrives before
          check-in time or who does not comply with our check-in procedures.
        </p>

        <b className="block text-xl font-semibold underline mb-2">
          Food and Drinks:
        </b>
        <p className="text-md leading-loose mb-8">
          No complimentary food or drinks: Our rates do not include meals or
          beverages.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Guest options:
        </b>
        <p className="text-md leading-loose mb-8">
          Guests are welcome to bring their own food and drinks or order from
          nearby restaurants.
        </p>

        <b className="block text-xl font-semibold underline mb-2">
          Guest Conduct:
        </b>
        <p className="text-md leading-loose mb-8">
          Guests are responsible for their own behavior and the behavior of
          their guests. Guests must respect the property and the privacy of
          other guests. Noise must be kept to a minimum after 10:00 PM.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Smoking allowed in designated areas:
        </b>
        <p className="text-md leading-loose mb-8">
          Smoking is only permitted in designated outdoor areas. Guests are
          responsible for any damages they cause to the property. We reserve the
          right to evict any guest who violates these Terms or who engages in
          disruptive or illegal behavior.
        </p>

        <b className="block text-xl font-semibold underline mb-2">
          Pets allowed:{" "}
        </b>
        <p className="text-md leading-loose mb-8">
          We welcome well-behaved pets with prior approval.{" "}
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Guest responsibility:{" "}
        </b>
        <p className="text-md leading-loose mb-8">
          Guests are responsible for cleaning up after their pets and ensuring
          they do not disturb other guests.{" "}
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Cancellation Policy:{" "}
        </b>
        <p className="text-md leading-loose mb-8">
          No Refunds: After booking, we do not offer refunds for cancellations.{" "}
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Special cases:{" "}
        </b>
        <p className="text-md leading-loose mb-8">
          We may consider partial refunds or alternative arrangements for
          cancellations on a case-by-case basis. Please contact us to discuss
          your specific situation. We reserve the right to modify our
          cancellation policy at any time.
        </p>
        <b className="block text-xl font-semibold underline mb-2">Liability:</b>
        <p className="text-md leading-loose mb-8">
          We are not liable for any loss, damage, or injury arising out of or in
          connection with your use of our Site or your stay at our Homestay. You
          agree to release us from all claims and liabilities arising out of or
          in connection with your use of our Site or your stay at our Homestay.
        </p>

        <b className="block text-xl font-semibold underline mb-2">
          Governing Law:
        </b>
        <p className="text-md leading-loose mb-8">
          These Terms shall be governed by and construed in accordance with the
          laws of India. Dispute Resolution: Any dispute arising out of or in
          connection with these Terms shall be subject to the exclusive
          jurisdiction of the courts of Gokarna, Karnataka, India.
        </p>

        <b className="block text-xl font-semibold underline mb-2">
          Severability:
        </b>
        <p className="text-md leading-loose mb-8">
          If any provision of these Terms is held to be invalid or
          unenforceable, such provision shall be struck and the remaining
          provisions shall remain in full force and effect.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Entire Agreement:
        </b>
        <p className="text-md leading-loose mb-8">
          These Terms constitute the entire agreement between you and us with
          respect to your use of our Site and your stay at our Homestay.
        </p>
        <b className="block text-xl font-semibold underline mb-2">
          Contact Us:
        </b>
        <p className="text-md leading-loose mb-8">
          If you have any questions about these Terms, please contact us at:
          Western Ghat Homestay{" "}
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
