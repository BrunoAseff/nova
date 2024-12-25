import ResetPassword from "@/components/resetPassword";

type Params = Promise<{ token: string }>;

export default async function Page({ params }: { params: Params }) {
  const { token } = await params;
  return <ResetPassword token={token} />;
}
