import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <SignUp />
    </div>
  );
}
