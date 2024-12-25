import * as React from "react";
import {
  Html,
  Body,
  Button,
  Container,
  Head,
  Heading,
  Text,
  Tailwind,
  Preview,
  Section,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  url: string;
}

export function ResetPasswordEmail({ url }: ResetPasswordEmailProps) {
  const previewText = "Reset your password to regain access to Nova";

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-8 max-w-[480px] rounded bg-white p-6 shadow-sm">
            <Heading className="text-[#006edb ] mb-4 text-center text-[24px] font-semibold">
              Reset Your Password
            </Heading>
            <Text className="mb-6 text-center text-[16px] leading-6 text-gray-700">
              We received a request to reset your password. If this was you, you
              can reset your password by clicking the button below.
            </Text>
            <Section className="text-center">
              <Button
                href={url}
                className="rounded-2xl bg-[#0c0e12] px-6 py-3 text-[16px] font-semibold text-white shadow-md"
              >
                Reset Password
              </Button>
            </Section>
            <Text className="mt-6 text-center text-[14px] leading-5 text-gray-600">
              If the button above doesn’t work, copy and paste the following URL
              into your browser:
            </Text>
            <Text className="text-[#006edb ] break-words text-center text-[14px] leading-5">
              {url}
            </Text>
            <Text className="mt-6 text-center text-[12px] leading-5 text-gray-500">
              If you didn’t request a password reset, you can safely ignore this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default ResetPasswordEmail;
