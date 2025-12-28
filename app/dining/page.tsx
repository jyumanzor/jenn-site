"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dining from "@/data/dining.json";

type Restaurant = typeof dining.restaurants[0];

export default function DiningPage() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("all");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [selectedPrice, setSelectedPrice] = useState<string>("all");
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = useMemo(() => {
    return dining.restaurants.filter((r: Restaurant) => {
      if (selectedNeighborhood !== "all" && r.neighborhood !== selectedNeighborhood) return false;
      if (selectedCuisine !== "all" && r.cuisine !== selectedCuisine) return false;
      if (selectedPrice !== "all" && r.price !== selectedPrice) return false;
      if (showVisitedOnly && !r.visited) return false;
      if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [selectedNeighborhood, selectedCuisine, selectedPrice, showVisitedOnly, searchQuery]);

  const priceOptions = ["$", "$$", "$$$", "$$$$"];

  // Get top neighborhoods by count
  const topNeighborhoods = useMemo(() => {
    const counts: Record<string, number> = {};
    dining.restaurants.forEach((r: Restaurant) => {
      if (r.neighborhood) counts[r.neighborhood] = (counts[r.neighborhood] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name]) => name);
  }, []);


  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="text-olive text-sm uppercase tracking-wider mb-4">Dining</p>
            <h1
              className="text-4xl md:text-5xl text-deep-forest mb-6"
              style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
            >
              Where to eat in DC
            </h1>
            <p className="text-lg text-deep-forest/70 leading-relaxed">
              {dining.restaurants.length} restaurants across the DMV. Ranked by preference.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Top Picks */}
      <section className="py-12">
        <div className="container-editorial">
          {/* Top Restaurants */}
          <div className="mb-10">
            <p className="light-bg-label mb-4">Top restaurants</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { id: "roses-luxury", name: "Rose's Luxury", neighborhood: "Barracks Row" },
                { id: "sushi-nakazawa", name: "Sushi Nakazawa", neighborhood: "Penn Quarter" },
                { id: "casamara", name: "Casamara", neighborhood: "Dupont Circle" },
                { id: "causa", name: "Causa", neighborhood: "Blagden Alley" },
                { id: "lapis", name: "Lapis", neighborhood: "Adams Morgan" },
                { id: "seven-reasons", name: "Seven Reasons", neighborhood: "Penn Quarter" },
                { id: "moon-rabbit", name: "Moon Rabbit", neighborhood: "Penn Quarter" },
                { id: "anju", name: "Anju", neighborhood: "Dupont Circle" },
                { id: "onggi", name: "Onggi", neighborhood: "Dupont Circle" },
                { id: "le-diplomate", name: "Le Diplomate", neighborhood: "14th Street" },
              ].map((restaurant, i) => (
                <button
                  key={restaurant.id}
                  onClick={() => setSearchQuery(restaurant.name)}
                  className="group panel-gradient-deep hover:scale-[1.02] transition-transform cursor-pointer text-left"
                >
                  <span className="dark-bg-label">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="dark-bg-header text-sm mt-1">{restaurant.name}</h3>
                  <p className="dark-bg-body text-xs mt-0.5 opacity-70">{restaurant.neighborhood}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Top Bars */}
          <div>
            <p className="light-bg-label mb-4">Top bars</p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { id: "reynolds", name: "Reynolds", neighborhood: "Dupont Circle" },
                { id: "death-and-co", name: "Death and Co", neighborhood: "Blagden Alley" },
                { id: "cana", name: "Cana", neighborhood: "Adams Morgan" },
                { id: "maison-bar-a-vins", name: "Maison Bar À Vins", neighborhood: "Adams Morgan" },
                { id: "bar-betsie", name: "Bar Betsie", neighborhood: "Union Market" },
                { id: "silver-lyan", name: "Silver Lyan", neighborhood: "Penn Quarter" },
              ].map((bar, i) => (
                <button
                  key={bar.id}
                  onClick={() => setSearchQuery(bar.name)}
                  className="group panel-gradient-olive hover:scale-[1.02] transition-transform cursor-pointer text-left"
                >
                  <span className="dark-bg-label">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="dark-bg-header text-sm mt-1">{bar.name}</h3>
                  <p className="dark-bg-body text-xs mt-0.5 opacity-70">{bar.neighborhood}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Filters */}
      <section className="py-6 bg-ivory/80 backdrop-blur-sm sticky top-16 z-40 border-b border-sage/20">
        <div className="container-editorial">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white rounded-lg text-sm text-deep-forest border border-sage/30 focus:outline-none focus:border-olive placeholder:text-deep-forest/40"
              />
            </div>

            {/* Neighborhood */}
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg text-sm text-deep-forest border border-sage/30 focus:outline-none focus:border-olive"
            >
              <option value="all">All Neighborhoods</option>
              {topNeighborhoods.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            {/* Cuisine */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg text-sm text-deep-forest border border-sage/30 focus:outline-none focus:border-olive"
            >
              <option value="all">All Cuisines</option>
              {dining.filters.cuisines.slice(0, 20).map((c: string) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Price */}
            <div className="flex gap-1">
              {priceOptions.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPrice(selectedPrice === p ? "all" : p)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedPrice === p
                      ? "bg-olive text-cream"
                      : "bg-white text-deep-forest border border-sage/30 hover:bg-sage/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Visited toggle */}
            <button
              onClick={() => setShowVisitedOnly(!showVisitedOnly)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                showVisitedOnly
                  ? "bg-olive text-cream"
                  : "bg-white text-deep-forest border border-sage/30 hover:bg-sage/10"
              }`}
            >
              Visited
            </button>
          </div>

          <p className="text-xs text-deep-forest/50 mt-3">
            {filteredRestaurants.length} of {dining.restaurants.length}
          </p>
        </div>
      </section>

      {/* Restaurant List */}
      <section className="py-12">
        <div className="container-editorial">
          <div className="space-y-4">
            {filteredRestaurants.map((restaurant: Restaurant, index: number) => {
              const isFavorite = restaurant.rating === 5;
              const hasMichelin = restaurant.accolades?.includes("Michelin");
              const michelinStars = restaurant.accolades?.match(/Michelin (⭐+)/)?.[1]?.length || 0;

              return (
                <div
                  key={restaurant.id}
                  className={`rounded-xl p-6 transition-all ${
                    isFavorite
                      ? "bg-ivory border-2 border-gold/30"
                      : "bg-white/80 border border-sand/50"
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        isFavorite ? "bg-gold text-deep-forest" : "bg-sage/20 text-deep-forest"
                      }`}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3
                            className="text-xl text-deep-forest"
                            style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                          >
                            {restaurant.name}
                          </h3>
                          <p className="text-sm text-deep-forest/60 mt-1">
                            {restaurant.neighborhood}
                          </p>
                        </div>
                        {restaurant.rating && (
                          <div className="text-right flex-shrink-0">
                            <p
                              className={`text-2xl ${isFavorite ? "text-gold" : "text-olive"}`}
                              style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                            >
                              {restaurant.rating}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: restaurant.cuisine?.includes('Korean') || restaurant.cuisine?.includes('Japanese') || restaurant.cuisine?.includes('Vietnamese')
                              ? 'rgba(212,237,57,0.25)'
                              : restaurant.cuisine?.includes('Italian') || restaurant.cuisine?.includes('French')
                              ? 'rgba(203,173,140,0.3)'
                              : restaurant.cuisine?.includes('Mexican') || restaurant.cuisine?.includes('Latin')
                              ? 'rgba(250,191,52,0.25)'
                              : 'rgba(151,169,124,0.3)',
                            color: '#2a3c24'
                          }}
                        >
                          {restaurant.cuisine}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            backgroundColor: restaurant.price === '$$$$' ? 'rgba(212,237,57,0.3)' : 'rgba(84,110,64,0.15)',
                            color: '#2a3c24'
                          }}
                        >
                          {restaurant.price}
                        </span>
                        {restaurant.visited && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(42,60,36,0.9)', color: '#d4ed39' }}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Visited
                          </span>
                        )}
                        {hasMichelin && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(250,191,52,0.3)', color: '#2a3c24' }}>
                            {"⭐".repeat(michelinStars || 1)} Michelin
                          </span>
                        )}
                      </div>

                      {restaurant.accolades && !hasMichelin && (
                        <p className="text-xs text-gold/80 mt-3">{restaurant.accolades}</p>
                      )}

                      {restaurant.accolades && hasMichelin && (
                        <p className="text-xs text-deep-forest/50 mt-3">
                          {restaurant.accolades.replace(/Michelin ⭐+ \([^)]+\) \| ?/, "")}
                        </p>
                      )}

                      {restaurant.notes && (
                        <p className="text-sm text-deep-forest/70 mt-3 leading-relaxed">
                          {restaurant.notes}
                        </p>
                      )}

                      {restaurant.vibe && (
                        <p className="text-xs text-deep-forest/50 mt-2">{restaurant.vibe}</p>
                      )}

                      {restaurant.menuLink && (
                        <a
                          href={restaurant.menuLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-olive hover:text-deep-forest text-sm mt-3 inline-block transition-colors"
                        >
                          View Menu →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="py-12">
        <div className="container-editorial">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="link-editorial text-sm">
              ← Back to home
            </Link>
            <Link
              href="/travel"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-colors"
              style={{ backgroundColor: '#546E40', color: '#FFF5EB' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFCB69';
                e.currentTarget.style.color = '#3B412D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#546E40';
                e.currentTarget.style.color = '#FFF5EB';
              }}
            >
              <span style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}>
                Favorite places
              </span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
