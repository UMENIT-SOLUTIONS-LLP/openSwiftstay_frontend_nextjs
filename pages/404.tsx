import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export default function NotFoundPage() {
  return (
    <main>
      <section className="bg-white">
        <div className="layout flex min-h-screen flex-col items-center justify-center text-center text-black">
          <div
            className="relative w-2/3"
            style={{ height: "calc(100vh - 60vh)", maxHeight: "288px" }}
          >
            <Image
              className=""
              src="/images/icon/404_icon.png"
              alt="Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h1 className="my-6 text-2xl md:text-[32px] font-bold flex gap-3">
            ERROR{" "}
            <span className="text-base md:text-xl font-normal text-[#2a2a2a]">
              the requested page does not exist
            </span>
          </h1>
          {/* <Link className="mt-4 md:text-lg" href="/">
            <span>Back to Home</span>
          </Link> */}
        </div>
      </section>
    </main>
  );
}
