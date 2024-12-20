import React from "react";

function TermsOfService() {
  return (
    <div className="mx-auto max-w-[60%] bg-[#0c0e12] p-6 font-open leading-relaxed text-[#d0dbe3]">
      <h1 className="text-center text-2xl font-semibold text-[#d0dbe3]">
        Terms of Service
      </h1>
      <p className="mt-4">
        <strong>Effective Date:</strong> [Insert Date]
      </p>
      <p className="mt-2">
        Welcome to <strong>[Your App Name]</strong>! By using our application
        (&quot;the App&quot;), you agree to the following terms and conditions.
        Please read them carefully.
      </p>
      <h2 className="mt-6 text-xl font-medium text-[#57abff]">
        1. Acceptance of Terms
      </h2>
      <p className="mt-2">
        By accessing or using the App, you agree to be bound by these Terms of
        Service (&quot;Term&quot;). If you do not agree to these Terms, you may
        not use the App.
      </p>
      <h2 className="mt-6 text-xl font-medium text-[#57abff]">
        2. Use of the App
      </h2>
      <h3 className="mt-4 font-medium">2.1 Eligibility</h3>
      <p className="mt-2">
        You must be at least 18 years old to use the App. By using the App, you
        confirm that you meet this age requirement.
      </p>
      <h3 className="mt-4 font-medium">2.2 Account Responsibilities</h3>
      <ul className="mt-2 list-inside list-disc space-y-1">
        <li>
          You are responsible for maintaining the confidentiality of your
          account credentials.
        </li>
        <li>You agree not to share your login information with others.</li>
      </ul>
      <h3 className="mt-4 font-medium">2.3 Prohibited Activities</h3>
      <p className="mt-2">You agree not to:</p>
      <ul className="mt-2 list-inside list-disc space-y-1">
        <li>Use the App for any illegal or unauthorized purpose.</li>
        <li>Interfere with or disrupt the functionality of the App.</li>
        <li>Attempt to access data not intended for you.</li>
      </ul>
      <h2 className="mt-6 text-xl font-medium text-[#57abff]">
        3. Intellectual Property
      </h2>
      <p className="mt-2">
        All content within the App, including logos, text, and code, is owned by{" "}
        <strong>[Your Company Name]</strong> and is protected under copyright
        laws. You may not reproduce, distribute, or create derivative works
        without our prior written consent.
      </p>
      <h2 className="mt-6 text-xl font-medium text-[#57abff]">
        4. Limitation of Liability
      </h2>
      <p className="mt-2">
        The App is provided &quot;as is&quot; and &quot;as available&quot;. To
        the fullest extent permitted by law, we disclaim all warranties and will
        not be liable for any direct, indirect, incidental, or consequential
        damages resulting from your use of the App.
      </p>
      <h2 className="mt-6 text-xl font-medium text-[#57abff]">
        5. Termination
      </h2>
      <p className="mt-2">
        We reserve the right to suspend or terminate your access to the App at
        our discretion, with or without notice, if you violate these Terms or
        engage in prohibited activities.
      </p>
      <h2 className="mt-6 text-xl font-medium text-[#57abff]">
        6. Governing Law
      </h2>
      <p className="mt-2">
        These Terms are governed by the laws of <strong>Brazil</strong>. Any
        disputes arising from these Terms will be resolved in the courts of{" "}
        <strong>Itajaí, Brazil</strong>.
      </p>
      <h2 className="mt-6 text-xl font-medium text-[#57abff]">
        7. Changes to These Terms
      </h2>
      <p className="mt-2">
        We may modify these Terms from time to time. The updated version will be
        posted on this page with a new effective date. Continued use of the App
        constitutes acceptance of the modified Terms.
      </p>
      <h2 className="mt-6 text-xl font-medium text-[#57abff]">8. Contact Us</h2>
      <p className="mt-2">
        For questions or concerns regarding these Terms, please contact us at:
      </p>
      <address className="mt-2">
        <strong>team.novaspaces@gmail.com</strong>
      </address>
    </div>
  );
}

export default TermsOfService;
