 // ❌ Remove "use client"
import {
  Html,
  Head,
  Preview,
  Tailwind,
  Body,
  Container,
  Heading,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps){
  return (
    <Html lang="en">
      <Head />
      <Preview>Your verification code is here 🔐</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="p-6 max-w-xl mx-auto border border-gray-300 rounded">
            <Heading className="text-xl font-bold mb-4">Hi {username},</Heading>

            <Text className="text-base text-gray-800">
              Thank you for signing up! Use the following OTP to verify your email address:
            </Text>

            <Text className="text-2xl font-bold text-center text-blue-600 my-4 tracking-widest">
              {otp}
            </Text>

            <Text className="text-sm text-gray-600">
              This OTP is valid for the next 10 minutes. If you didn’t request this, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
 