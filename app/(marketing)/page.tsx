import Footer from "./_components/footer";
import Heading from "./_components/heading";
import Heroes from "./_components/heroes";

export default function MarketingPage() {
  return (
    <div className="w-full min-h-full flex flex-col dark:bg-[#1f1f1f]">
      <div className="w-full flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  );
}
