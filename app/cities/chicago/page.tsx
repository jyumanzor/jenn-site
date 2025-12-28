"use client";

import Link from "next/link";
import { useState } from "react";

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
    name: 'Art Institute of Chicago',
    desc: 'World-class collection, the lions',
    address: '111 S Michigan Ave',
    neighborhood: 'Loop',
    hours: 'Thu-Mon 11am-5pm, $25',
    note: 'Second largest art museum in the US. The Modern Wing has a beautiful bridge to Millennium Park. Free Thursday evenings for Illinois residents.',
    website: 'https://www.artic.edu'
  },
  {
    name: 'Museum of Contemporary Art',
    desc: 'Bold contemporary works',
    address: '220 E Chicago Ave',
    neighborhood: 'Streeterville',
    hours: 'Wed-Sun 10am-5pm, $15',
    note: 'Great rooftop terrace with views. The permanent collection rotates frequently. Tuesdays are free for Illinois residents.',
    website: 'https://mcachicago.org'
  },
  {
    name: 'Stony Island Arts Bank',
    desc: 'Theaster Gates cultural center',
    address: '6760 S Stony Island Ave',
    neighborhood: 'Greater Grand Crossing',
    hours: 'Check website for hours',
    note: 'Rehabilitated 1923 bank building now housing archives, library, and exhibition space. A cornerstone of South Side cultural revival.',
    website: 'https://rebuild-foundation.org/site/stony-island-arts-bank/'
  },
  {
    name: 'DuSable Museum',
    desc: 'African American history and culture',
    address: '740 E 56th Pl',
    neighborhood: 'Washington Park',
    hours: 'Wed-Sun 10am-4pm',
    note: 'First museum of its kind in the country, founded in 1961. Named after Jean Baptiste Point DuSable, Chicago\'s first permanent non-Indigenous settler.',
    website: 'https://www.dusablemuseum.org'
  },
  {
    name: 'Smart Museum of Art',
    desc: 'UChicago\'s free gem',
    address: '5550 S Greenwood Ave',
    neighborhood: 'Hyde Park',
    hours: 'Tue-Sun 10am-5pm, Free',
    note: 'Small but excellent. Rotating exhibitions and a strong permanent collection. The sculpture garden is peaceful.',
    website: 'https://smartmuseum.uchicago.edu'
  }
];

const cafes: Place[] = [
  {
    name: 'Hallowed Grounds',
    desc: 'Campus institution since 2009',
    address: '5765 S Woodlawn Ave',
    neighborhood: 'Hyde Park',
    hours: 'Daily 8am-10pm',
    note: 'The quintessential UChicago cafe. Late night study sessions, poetry readings, and the best chai in Hyde Park. Get the Turkish coffee.',
  },
  {
    name: 'Medici on 57th',
    desc: 'Carved-up tables, deep dish',
    address: '1327 E 57th St',
    neighborhood: 'Hyde Park',
    hours: 'Daily 7am-11pm',
    note: 'Students have been carving their names into the tables since 1962. The milkshakes are famous. More of a restaurant but the upstairs bakery is great for coffee.',
    website: 'https://medici57.com'
  },
  {
    name: 'Plein Air Cafe',
    desc: 'French bakery, garden seating',
    address: '5751 S Woodlawn Ave',
    neighborhood: 'Hyde Park',
    hours: 'Tue-Sun 8am-5pm',
    note: 'In the lobby of the Logan Center. Beautiful space, excellent pastries. The courtyard seating in summer is unmatched.',
    website: 'https://www.pleinaircafe.co'
  },
  {
    name: 'Bridgeport Coffee',
    desc: 'No-frills neighborhood spot',
    address: '3101 S Morgan St',
    neighborhood: 'Bridgeport',
    hours: 'Daily 7am-6pm',
    note: 'Serious coffee in a unpretentious setting. Cash-only. The neighborhood is worth exploring—lots of artist studios.',
  },
  {
    name: 'Intelligentsia',
    desc: 'Chicago coffee pioneer',
    address: '53 E Randolph St',
    neighborhood: 'Loop (Millennium Park)',
    hours: 'Daily 6am-8pm',
    note: 'The original third-wave coffee shop. The Millennium Park location is convenient. The mocha is legendary.',
    website: 'https://www.intelligentsia.com'
  }
];

const routes: Place[] = [
  {
    name: 'Lakefront Trail',
    desc: '18 miles of waterfront running',
    address: 'Multiple access points along Lake Michigan',
    note: 'The crown jewel of Chicago running. Start at Navy Pier and go south past Museum Campus, or go north to Montrose Harbor. Best at sunrise before the crowds.'
  },
  {
    name: 'The Midway',
    desc: 'UChicago\'s mile-long park',
    address: 'Midway Plaisance, 59th to 60th St',
    neighborhood: 'Hyde Park',
    note: 'Site of the 1893 World\'s Fair. One mile exactly from end to end. Perfect for tempo runs. The gothic buildings on either side are stunning.'
  },
  {
    name: 'Jackson Park Loop',
    desc: 'Wooded paths, lagoons',
    address: 'Jackson Park, 63rd St & Stony Island',
    neighborhood: 'Hyde Park',
    note: 'Another World\'s Fair site. Run around the lagoons and through the Japanese Garden. Connect to the lakefront for longer runs. Watch for geese.'
  },
  {
    name: '606 Trail',
    desc: 'Elevated rail trail',
    address: 'Access at multiple points, Wicker Park to Logan Square',
    neighborhood: 'Bucktown/Wicker Park',
    note: 'Chicago\'s version of the High Line. 2.7 miles on a former rail line. Great views of the neighborhoods. Can get crowded on weekends.'
  }
];

const neighborhoods: Place[] = [
  {
    name: 'Hyde Park',
    desc: 'UChicago, Obama\'s home',
    note: 'Intellectual enclave on the South Side. Frank Lloyd Wright\'s Robie House, Powell\'s Books, and incredible architecture. Walk 57th Street for the full experience.'
  },
  {
    name: 'Pilsen',
    desc: 'Murals, Mexican culture',
    address: '18th Street corridor',
    note: 'Vibrant murals on every corner. The National Museum of Mexican Art is free. Great taquerias and bakeries. The Pink Line stop has incredible tile work.'
  },
  {
    name: 'Wicker Park',
    desc: 'Indie shops, nightlife',
    address: 'North/Damen/Milwaukee intersection',
    note: 'Still has edge despite gentrification. Great vintage shopping, bookstores, and bars. The 606 trail runs through here.'
  },
  {
    name: 'Bronzeville',
    desc: 'Historic Black Metropolis',
    address: '35th-47th St, MLK Drive',
    note: 'Once home to Louis Armstrong, Ida B. Wells, and the Chicago Defender. Walk the Black Metropolis-Bronzeville District for historic buildings and public art.'
  }
];

export default function ChicagoPage() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const PlaceCard = ({ place, color }: { place: Place; color: string }) => (
    <button
      onClick={() => setSelectedPlace(place)}
      className="rounded-xl p-5 text-left transition-all hover:scale-[1.02] hover:shadow-lg w-full"
      style={{ backgroundColor: color }}
    >
      <h4
        className="text-base mb-1"
        style={{
          fontFamily: 'var(--font-instrument), Georgia, serif',
          color: '#2a3c24'
        }}
      >
        {place.name}
      </h4>
      <p className="text-sm" style={{ color: 'rgba(42,60,36,0.7)' }}>
        {place.desc}
      </p>
    </button>
  );

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 30% 70%, rgba(212,237,57,0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(151,169,124,0.3) 0%, transparent 50%)'
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
              Chicago
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              College, marathon, business school. Coming back in 2026.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* The Marathon */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #F7E5DA 0%, #EFE4D6 100%)' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Chicago 2026
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                Second World Major. Back where I went to college.
              </p>
            </div>
            <div className="md:col-span-8">
              <div
                className="rounded-2xl p-8"
                style={{ background: 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3
                    className="text-2xl md:text-3xl"
                    style={{
                      fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                      color: '#fff5eb'
                    }}
                  >
                    Chicago Marathon
                  </h3>
                  <span
                    className="text-xs uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#d4ed39', color: '#2a3c24' }}
                  >
                    Registered
                  </span>
                </div>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,245,235,0.7)' }}>
                  October 11, 2026 · Grant Park
                </p>
                <p className="leading-relaxed" style={{ color: 'rgba(255,245,235,0.85)' }}>
                  Flat course through 29 neighborhoods. Running it after Boston.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* UChicago */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                UChicago
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                Four years in Hyde Park. Returning for Booth in 2026.
              </p>
            </div>
            <div className="md:col-span-8">
              <div
                className="rounded-2xl p-8"
                style={{ background: 'linear-gradient(135deg, #97a97c 0%, #cbad8c 100%)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3
                    className="text-xl"
                    style={{
                      fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                      color: '#2a3c24'
                    }}
                  >
                    University of Chicago
                  </h3>
                  <a
                    href="https://www.questbridge.org/high-school-students/national-college-match"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
                    style={{ backgroundColor: '#2a3c24', color: '#d4ed39' }}
                    title="QuestBridge matches high-achieving, low-income students with full scholarships to top colleges"
                  >
                    <span>QuestBridge</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                </div>
                <p className="leading-relaxed mb-6" style={{ color: 'rgba(42,60,36,0.8)' }}>
                  Sociology and HIPS. Match Scholar for undergrad and MBA.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}
                  >
                    <p
                      className="text-2xl mb-1"
                      style={{
                        fontFamily: 'var(--font-instrument), Georgia, serif',
                        color: '#2a3c24'
                      }}
                    >
                      2021
                    </p>
                    <p className="text-xs uppercase tracking-wider" style={{ color: '#546e40' }}>Graduated</p>
                  </div>
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}
                  >
                    <p
                      className="text-2xl mb-1"
                      style={{
                        fontFamily: 'var(--font-instrument), Georgia, serif',
                        color: '#2a3c24'
                      }}
                    >
                      Booth
                    </p>
                    <p className="text-xs uppercase tracking-wider" style={{ color: '#546e40' }}>Sept 2026</p>
                  </div>
                  <button
                    onClick={() => setSelectedPlace(cafes[0])}
                    className="rounded-xl p-4 transition-all hover:scale-105"
                    style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}
                  >
                    <p
                      className="text-2xl mb-1"
                      style={{
                        fontFamily: 'var(--font-instrument), Georgia, serif',
                        color: '#2a3c24'
                      }}
                    >
                      Hallowed Grounds
                    </p>
                    <p className="text-xs uppercase tracking-wider" style={{ color: '#546e40' }}>Fav cafe ↗</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Museums */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #EFE4D6 0%, #F7E5DA 100%)' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-10">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Museums
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                From world-class to hidden gems.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {museums.map((museum) => (
              <PlaceCard key={museum.name} place={museum} color="#fff5eb" />
            ))}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Cafes */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-10">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Cafes
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                Hyde Park staples and city favorites.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {cafes.map((cafe) => (
              <PlaceCard key={cafe.name} place={cafe} color="#ffeac4" />
            ))}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Running Routes */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #F7E5DA 0%, #EFE4D6 100%)' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-10">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Running Routes
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                Lakefront miles and neighborhood loops.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {routes.map((route) => (
              <PlaceCard key={route.name} place={route} color="#d4ed39" />
            ))}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Neighborhoods */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-10">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Neighborhoods
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                Chicago is a city of neighborhoods.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {neighborhoods.map((hood) => (
              <PlaceCard key={hood.name} place={hood} color="#fff5eb" />
            ))}
          </div>
        </div>
      </section>

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
            {/* Header */}
            <div className="p-6 pb-4">
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-sage/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#546e40' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2
                className="text-2xl pr-8"
                style={{
                  fontFamily: 'var(--font-instrument), Georgia, serif',
                  color: '#2a3c24'
                }}
              >
                {selectedPlace.name}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(42,60,36,0.7)' }}>
                {selectedPlace.desc}
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 space-y-4">
              {/* Address & Neighborhood */}
              {(selectedPlace.address || selectedPlace.neighborhood) && (
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#546e40' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    {selectedPlace.address && (
                      <p className="text-sm" style={{ color: '#2a3c24' }}>{selectedPlace.address}</p>
                    )}
                    {selectedPlace.neighborhood && (
                      <p className="text-xs" style={{ color: 'rgba(42,60,36,0.6)' }}>{selectedPlace.neighborhood}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Hours */}
              {selectedPlace.hours && (
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#546e40' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm" style={{ color: '#2a3c24' }}>{selectedPlace.hours}</p>
                </div>
              )}

              {/* Note */}
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

              {/* Website */}
              {selectedPlace.website && (
                <a
                  href={selectedPlace.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-all hover:scale-105 mt-4"
                  style={{ backgroundColor: '#2a3c24', color: '#d4ed39' }}
                >
                  <span>Visit Website</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
