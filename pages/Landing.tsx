import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Star, Shield, Users, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
              Announcing our new mobile app coming soon. <a href="#" className="font-semibold text-brand-400"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Review Movies, <br/><span className="text-brand-accent">Share Passion.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Join the largest community of film enthusiasts. Rate your favorite movies, write detailed reviews, and discuss the latest blockbusters with friends.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/register" className="rounded-md bg-brand-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 transition-all">
              Get started
            </Link>
            <Link to="/movies" className="text-sm font-semibold leading-6 text-white flex items-center gap-1 hover:text-brand-400 transition-colors">
              Browse Movies <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-brand-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-brand-400">Deploy faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to love movies</p>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              CineRate provides a comprehensive platform for tracking your movie watching journey and discovering hidden gems.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500">
                    <Star className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Reliable Ratings
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-400">Our rating system is community-driven and verified to ensure you get the most accurate consensus on film quality.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500">
                    <Users className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Community Discussions
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-400">Engage in deep discussions in the comment sections. Reply to reviews and debate the nuances of cinema.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500">
                    <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Secure Account
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-400">Your data is safe with us. We use industry-standard security and email verification to protect your account.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500">
                    <Film className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Vast Library
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-400">Access thousands of movie titles, cast information, and genre categorizations all in one place.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};