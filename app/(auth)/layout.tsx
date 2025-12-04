import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen justify-center items-center w-full">
      {children}
    </div>
  );
}
