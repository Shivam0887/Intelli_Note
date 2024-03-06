import Image from "next/image";
import React from "react";

const Heroes = () => {
  return (
    <div className="flex items-center gap-x-4 justify-center max-w-3xl ml-5">
      <div className="relative w-[300px] aspect-square sm:w-[350px] md:w-[400px]">
        <Image
          src="/documents.png"
          fill
          alt="Documents-light"
          className="object-contain dark:hidden"
        />
        <Image
          src="/documents-dark.png"
          fill
          className="object-contain hidden dark:block"
          alt="Documents-dark"
        />
      </div>
      <div className="relative w-[400px] aspect-square hidden md:block">
        <Image
          src="/reading.png"
          fill
          alt="Reading-light"
          className="object-contain dark:hidden"
        />
        <Image
          src="/reading-dark.png"
          fill
          className="object-contain hidden dark:block"
          alt="Reading-dark"
        />
      </div>
    </div>
  );
};

export default Heroes;
