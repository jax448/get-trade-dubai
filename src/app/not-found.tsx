import React from "react";
import Link from "next/link";
import { HomeIcon, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-white p-4">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* 404 Header with Gradient */}
        <div className="space-y-6">
          <h1 className="homeTitleText GradiantText animate-pulse">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold GradiantText">
            Oops! Page Not Found
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-balance text-gray-400">
            The page you&apos;re looking for seems to have vanished into the
            digital void.
          </p>
          <p className="text-sm md:text-base text-balance text-gray-500">
            It might have been moved, deleted, or never existed in the first
            place.
          </p>
        </div>

        {/* Action Buttons using FancyButton style */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
          <Link href="/" className="FancyButton flex items-center gap-2">
            <HomeIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span>Return Home</span>
          </Link>

          <Link
            href="javascript:history.back()"
            className="FancyButton flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Go Back</span>
          </Link>
        </div>

        {/* Decorative Element */}
        <div className="relative mt-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-bodybackground px-4 text-sm text-gray-500">
              Lost in the digital space
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
