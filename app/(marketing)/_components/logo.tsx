import { Poppins } from "next/font/google";
import { SiNotion } from "react-icons/si";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className="flex items-center gap-x-2">
      <SiNotion className={cn("w-5 h-5", className)} />
      <p className={cn("font-semibold", font.className)}>Intelli-Note</p>
    </div>
  );
};

export default Logo;
