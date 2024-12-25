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

interface VerifyEmailProps {
  url: string;
}

export function VerifyEmail({ url }: VerifyEmailProps) {
  const previewText = "Verify your email to start using Nova";

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-8 max-w-[480px] rounded bg-white p-6 shadow-sm">
            <Heading className="mb-4 text-center text-[24px] font-semibold text-[#006edb]">
              Welcome to Nova!
            </Heading>
            <Text className="mb-6 text-center text-[16px] leading-6 text-gray-700">
              We&apos;re excited to have you on board. To get started, please
              verify your email address by clicking the button below.
            </Text>
            <Section className="text-center">
              <Button
                href={url}
                className="rounded-2xl bg-[#0c0e12] px-6 py-3 text-[16px] font-semibold text-white shadow-md"
              >
                Verify Your Email
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
              If you didn’t create an account with Nova, you can safely ignore
              this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default VerifyEmail;
