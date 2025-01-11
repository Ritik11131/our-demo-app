"use client";
import { siteConfig } from "@/config/site";
import React from "react";
import { Image } from "@nextui-org/image";
import {Link} from "@nextui-org/link";
import { Divider } from "@nextui-org/divider";

const MainPage = () => {
  return (
    <section className=" body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <div className="space-y-1">
            <h1 className="text-4xl font-medium">{siteConfig.welcomeMsg}</h1>
            <p className="text-large text-transparent bg-clip-text bg-gradient-to-r to-indigo-600 from-violet-400">Ritik Gupta</p>
          </div>
          <Divider className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-small">
          <Link href="/main/dashboard">Dashboard</Link>
            <Divider orientation="vertical" />
            <div>Docs</div>
            <Divider orientation="vertical" />
            <div>Source</div>
          </div>
          {/* <p className="mb-8 leading-relaxed">
            Copper mug try-hard pitchfork pour-over freegan heirloom neutra air
            plant cold-pressed tacos poke beard tote bag. Heirloom echo park
            mlkshk tote bag selvage hot chicken authentic tumeric truffaut
            hexagon try-hard chambray.
          </p> */}
        
          <div className="flex justify-center">
            {/* <Button color="primary" endContent={<ArrowRight />}>
              Go to Dashboard
            </Button> */}
            {/* <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button> */}
            {/* <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button> */}
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          {/* <img
            className="object-cover object-center rounded"
            alt="hero"
            src="https://dummyimage.com/720x600"
          /> */}

          <Image
            alt="NextUI Image with fallback"
            isZoomed
            isBlurred
            width={400}
            height={500}
            src="https://app.requestly.io/delay/5000/https://nextui.org/images/hero-card-complete.jpeg"
          />
        </div>
      </div>
    </section>
  );
};

export default MainPage;
