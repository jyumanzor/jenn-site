import IOAuthGate from "@/components/IOAuthGate";

export default function IOLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <IOAuthGate>{children}</IOAuthGate>;
}
