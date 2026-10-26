import AuthForm from "@/components/AuthForm";

type Props = { searchParams: Promise<{ registered?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { registered } = await searchParams;
  return <AuthForm mode="login" registered={registered === "1"} />;
}