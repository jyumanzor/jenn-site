"use client";

import { useState } from "react";
import Link from "next/link";

interface Place {
  name: string;
  desc: string;
  address?: string;
  neighborhood?: string;
  hours?: string;
  note?: string;
  website?: string;
}

const museums: Place[] = [
  {
    name: 'Hirshhorn',
    desc: 'Modern art, the sculpture garden',
    address: '700 Independence Ave SW',
    neighborhood: 'National Mall',
    hours: 'Daily 10am-5:30pm, Free',
    note: 'The sculpture garden is best at sunset. Don\'t miss the Yayoi Kusama Infinity Room when it\'s open.',
    website: 'https://hirshhorn.si.edu'
  },
  {
    name: 'National Gallery East Wing',
    desc: 'The I.M. Pei building alone',
    address: '4th St & Constitution Ave NW',
    neighborhood: 'National Mall',
    hours: 'Daily 10am-5pm, Free',
    note: 'The architecture is the art. Look up at the Calder mobile. The underground tunnel to the West Wing has a moving walkway with light art.',
    website: 'https://www.nga.gov'
  },
  {
    name: 'The Renwick',
    desc: 'Craft and decorative arts',
    address: '1661 Pennsylvania Ave NW',
    neighborhood: 'White House',
    hours: 'Daily 10am-5:30pm, Free',
    note: 'Grand Salon upstairs. Small but the rotating installations are always worth it.',
    website: 'https://americanart.si.edu/visit/renwick'
  },
  {
    name: 'Phillips Collection',
    desc: 'Intimate, personal, Rothko room',
    address: '1600 21st St NW',
    neighborhood: 'Dupont Circle',
    hours: 'Tue-Sat 10am-5pm, Thu until 8pm',
    note: 'The Rothko Room is transcendent. Small museum, feels like someone\'s home. $16 weekends, free weekdays.',
    website: 'https://www.phillipscollection.org'
  },
  {
    name: 'Hillwood Estate',
    desc: 'Hidden gem, beautiful gardens',
    address: '4155 Linnean Ave NW',
    neighborhood: 'Forest Hills',
    hours: 'Tue-Sun 10am-5pm',
    note: 'Marjorie Merriweather Post\'s mansion. Fabergé eggs, Russian art. The Japanese garden is perfect in spring.',
    website: 'https://www.hillwoodmuseum.org'
  },
  {
    name: 'Botanic Garden',
    desc: 'Free, peaceful, always blooming',
    address: '100 Maryland Ave SW',
    neighborhood: 'Capitol Hill',
    hours: 'Daily 10am-5pm, Free',
    note: 'The orchid room. Perfect escape in winter or summer heat. The outdoor gardens wrap around.',
    website: 'https://www.usbg.gov'
  },
];

const hangouts: Place[] = [
  {
    name: 'Malcolm X Park',
    desc: 'Sunday drums, city views',
    address: '16th St & Euclid St NW',
    neighborhood: 'Columbia Heights / Mt. Pleasant',
    hours: 'Dawn to dusk',
    note: 'Sunday drum circles start around 3pm and go until sunset. Bring a blanket. The cascading fountains and city views are best at golden hour.'
  },
  {
    name: 'Dupont Farmers Market',
    desc: 'Sunday morning ritual',
    address: '1500 20th St NW',
    neighborhood: 'Dupont Circle',
    hours: 'Sundays 8:30am-1:30pm, year-round',
    note: 'The best farmers market in the city. Arrive early for the bread. The mushroom guy, the pickle stand, fresh flowers.',
    website: 'https://www.freshfarm.org/dupont-circle'
  },
  {
    name: 'Georgetown Waterfront',
    desc: 'Walking, sitting, watching boats',
    address: 'Water St NW & 31st St',
    neighborhood: 'Georgetown',
    hours: 'Always open',
    note: 'Best on a weekday evening. The park stretches along the Potomac. Good for running, people-watching, or just sitting.'
  },
  {
    name: 'National Cathedral',
    desc: 'The grounds, the quiet',
    address: '3101 Wisconsin Ave NW',
    neighborhood: 'Cleveland Park',
    hours: 'Mon-Sat 10am-5pm, Sun 8am-4pm',
    note: 'Walk the Bishop\'s Garden. The gargoyles include Darth Vader. Evensong on Sundays is free.',
    website: 'https://cathedral.org'
  },
  {
    name: 'Crumbs & Whiskers',
    desc: 'Cat cafe in Georgetown',
    address: '3210 O St NW',
    neighborhood: 'Georgetown',
    hours: 'Daily, reservations required',
    note: 'Book ahead. 70-minute sessions with adoptable cats. Surprisingly therapeutic.',
    website: 'https://crumbsandwhiskers.com'
  },
  {
    name: 'All Fired Up',
    desc: 'Paint your own pottery',
    address: '3413 Connecticut Ave NW',
    neighborhood: 'Cleveland Park',
    hours: 'Daily 10am-9pm',
    note: 'Drop in, pick a piece, paint. They fire it and you pick it up in a week. BYOB-friendly.',
    website: 'https://allfiredupdc.com'
  },
  {
    name: 'Water Taxi to Alexandria',
    desc: 'Best way to get there',
    address: 'Georgetown Waterfront',
    neighborhood: 'Georgetown to Old Town Alexandria',
    hours: 'Seasonal, check schedule',
    note: 'Skip the Metro. 30-minute ride down the Potomac. $20 round trip. Old Town is walkable from the dock.',
    website: 'https://www.potomacriverboatco.com'
  },
];

const routes: Place[] = [
  {
    name: 'Connecticut Ave',
    desc: 'Straight shot north, perfect for tempo days',
    address: 'From Dupont to Chevy Chase',
    note: 'Relatively flat, wide sidewalks. Can extend all the way to Bethesda. Good for consistent pace work.'
  },
  {
    name: 'Down to the Mall',
    desc: 'Monuments, tourists, wide open space',
    address: 'Any route to the National Mall',
    note: 'Best before 7am or after sunset. The loop around the monuments is about 4 miles. Lincoln Memorial at sunrise.'
  },
  {
    name: 'Mt Vernon Trail',
    desc: 'Along the Potomac to Alexandria',
    address: 'Roosevelt Island to Mount Vernon',
    note: '18 miles total. Can start at Key Bridge. Flat, paved, beautiful river views. Old Town Alexandria is a good turnaround point.'
  },
  {
    name: 'C&O to Capital Crescent',
    desc: 'Canal path, shaded, long run territory',
    address: 'Georgetown to Bethesda',
    note: 'Crushed gravel towpath. Connects to paved Capital Crescent Trail in Georgetown. About 7 miles to Bethesda. Shaded in summer.'
  }
];

export default function DCPage() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-8 pb-16 md:pt-16 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 70% 30%, rgba(212,237,57,0.2) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(151,169,124,0.3) 0%, transparent 50%)'
          }}
        />
        <div className="container-editorial relative">
          <div className="max-w-2xl">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#546e40' }}
            >
              City Guide
            </p>
            <h1
              className="text-5xl md:text-6xl mb-6 tracking-tight"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Washington, DC
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              My first city. Six years of discovering corners, routines, and places that feel like mine.
            </p>
            <p className="text-xs mt-4 italic" style={{ color: 'rgba(42,60,36,0.5)' }}>
              Click any card for details.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Running Routes */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #F7E5DA 0%, #EFE4D6 100%)' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Running
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                The routes I actually run. Nothing fancy, just reliable miles.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="grid md:grid-cols-2 gap-4">
                {routes.map((route, index) => {
                  const gradients = [
                    'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)',
                    'linear-gradient(135deg, #4e6041 0%, #677955 100%)',
                    'linear-gradient(135deg, #677955 0%, #97a97c 100%)',
                    'linear-gradient(135deg, #97a97c 0%, #cbad8c 100%)'
                  ];
                  const isLight = index === 3;
                  return (
                    <button
                      key={route.name}
                      onClick={() => setSelectedPlace(route)}
                      className="rounded-xl p-5 text-left transition-all hover:scale-[1.02] cursor-pointer"
                      style={{ background: gradients[index] }}
                    >
                      <h3
                        className="text-lg mb-2"
                        style={{
                          fontFamily: 'var(--font-instrument), Georgia, serif',
                          color: isLight ? '#2a3c24' : '#fff5eb'
                        }}
                      >
                        {route.name}
                      </h3>
                      <p className="text-sm" style={{ color: isLight ? 'rgba(42,60,36,0.7)' : 'rgba(255,245,235,0.7)' }}>
                        {route.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Museums & Galleries */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Museums & Galleries
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                The art and culture that keeps me coming back.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {museums.map((spot, idx) => {
              const colors = ['#2a3c24', '#36482e', '#425438', '#4e6041', '#5a6c4b', '#677955'];
              return (
                <button
                  key={spot.name}
                  onClick={() => setSelectedPlace(spot)}
                  className="rounded-xl p-5 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${colors[idx]} 0%, ${idx % 2 === 0 ? '#4e6041' : '#677955'} 100%)` }}
                >
                  <h3
                    className="text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-instrument), Georgia, serif',
                      color: '#fff5eb'
                    }}
                  >
                    {spot.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'rgba(255,245,235,0.7)' }}>
                    {spot.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Hangouts & Rituals */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #EFE4D6 0%, #F7E5DA 100%)' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Hangouts & Rituals
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                The routines and spots that make DC feel like home.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {hangouts.map((spot) => {
              const bgColors: Record<string, string> = {
                'Malcolm X Park': '#ffcb69',
                'Dupont Farmers Market': '#ffeac4',
                'Georgetown Waterfront': '#d4ed39',
                'National Cathedral': '#cbad8c',
                'Crumbs & Whiskers': '#ffd475',
                'All Fired Up': '#ffe5b0',
                'Water Taxi to Alexandria': '#8b9d72',
              };
              const bg = bgColors[spot.name] || '#97a97c';
              const isDark = ['#8b9d72'].includes(bg);
              return (
                <button
                  key={spot.name}
                  onClick={() => setSelectedPlace(spot)}
                  className="rounded-xl p-5 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  style={{ backgroundColor: bg }}
                >
                  <h3
                    className="text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-instrument), Georgia, serif',
                      color: isDark ? '#fff5eb' : '#2a3c24'
                    }}
                  >
                    {spot.name}
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? 'rgba(255,245,235,0.7)' : 'rgba(42,60,36,0.7)' }}>
                    {spot.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedPlace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPlace(null)}
        >
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
          <div
            className="relative bg-cream rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2
                    className="text-2xl md:text-3xl mb-1"
                    style={{
                      fontFamily: 'var(--font-instrument), Georgia, serif',
                      color: '#2a3c24'
                    }}
                  >
                    {selectedPlace.name}
                  </h2>
                  {selectedPlace.neighborhood && (
                    <p className="text-sm" style={{ color: '#546e40' }}>
                      {selectedPlace.neighborhood}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="#2a3c24" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {selectedPlace.address && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="#546e40" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm" style={{ color: 'rgba(42,60,36,0.8)' }}>
                      {selectedPlace.address}
                    </p>
                  </div>
                )}

                {selectedPlace.hours && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="#546e40" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm" style={{ color: 'rgba(42,60,36,0.8)' }}>
                      {selectedPlace.hours}
                    </p>
                  </div>
                )}

                {selectedPlace.note && (
                  <div
                    className="rounded-xl p-4 mt-4"
                    style={{ backgroundColor: 'rgba(212,237,57,0.2)' }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: '#2a3c24' }}>
                      {selectedPlace.note}
                    </p>
                  </div>
                )}

                {selectedPlace.website && (
                  <a
                    href={selectedPlace.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm transition-all hover:scale-105"
                    style={{ backgroundColor: '#2a3c24', color: '#fff5eb' }}
                  >
                    <span>Visit website</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Link */}
      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: '#546e40' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
