import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SignUp />
    </div>
  );
}
