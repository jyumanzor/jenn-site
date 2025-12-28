import travel from "@/data/travel.json";

export default function TravelMap() {
  // Convert lat/lng to SVG coordinates
  const toSvgCoords = (lat: number, lng: number) => {
    // Map area with generous margins matching reference
    const marginX = 100;
    const marginY = 80;
    const mapWidth = 800;
    const mapHeight = 340;

    const x = marginX + ((lng + 180) / 360) * mapWidth;
    const y = marginY + ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

  // Warm, muted continent colors matching reference image exactly
  const continentColors = {
    northAmerica: "#D4B196",   // peachy tan (matching reference)
    southAmerica: "#8B7560",   // warm brown/taupe (matching reference)
    europe: "#C9A9A0",         // dusty rose/mauve (matching reference)
    africa: "#A5AE9A",         // muted sage/gray-green (matching reference)
    asia: "#CBACA2",           // dusty peach/pink (matching reference)
    australia: "#918C88",      // warm gray/taupe (matching reference)
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-full"
      style={{ backgroundColor: '#F5EDE5' }}
    >
      {/* Inner padding for white border effect like reference */}
      <div className="p-4 md:p-6 h-full" style={{ backgroundColor: '#FDFBF9' }}>
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="Decorative world map showing travel destinations"
        >
          {/* Warm cream background matching reference */}
          <rect width="1000" height="500" fill="#F5EDE5" />

          {/* Continent shapes - smooth organic blobs matching reference style */}
          <g>
            {/* NORTH AMERICA - large peachy tan blob */}
            <path
              d="M120,120
                 C150,85 220,75 280,80
                 C340,85 380,110 385,150
                 C388,190 370,230 330,260
                 C290,285 240,295 190,290
                 C140,285 105,260 90,220
                 C75,180 90,140 120,120 Z"
              fill={continentColors.northAmerica}
            />
            {/* Greenland */}
            <path
              d="M365,65 C390,55 420,60 435,80 C445,100 435,125 410,130 C385,132 365,115 365,90 C365,75 365,65 365,65 Z"
              fill={continentColors.northAmerica}
            />
            {/* Central America bridge */}
            <path
              d="M235,290 C255,285 275,295 280,320 C285,345 270,365 250,368 C230,370 215,355 215,330 C215,305 225,295 235,290 Z"
              fill={continentColors.northAmerica}
            />

            {/* SOUTH AMERICA - darker brown elongated blob */}
            <path
              d="M270,375
                 C310,360 345,380 360,420
                 C375,460 365,500 335,530
                 C305,555 265,560 235,545
                 C205,530 190,495 195,455
                 C200,415 240,385 270,375 Z"
              fill={continentColors.southAmerica}
            />

            {/* EUROPE - dusty rose small blob */}
            <path
              d="M480,100
                 C520,85 560,95 580,120
                 C600,145 595,180 570,200
                 C545,215 505,215 480,195
                 C455,175 455,140 470,115
                 C475,105 480,100 480,100 Z"
              fill={continentColors.europe}
            />
            {/* British Isles */}
            <path
              d="M445,105 C460,95 475,100 478,115 C480,130 470,145 455,145 C440,145 432,130 438,115 C442,105 445,105 445,105 Z"
              fill={continentColors.europe}
            />

            {/* AFRICA - sage/gray-green large blob */}
            <path
              d="M500,215
                 C545,200 590,220 615,265
                 C640,310 640,365 620,410
                 C600,455 555,480 505,480
                 C455,480 420,455 410,410
                 C400,365 415,310 445,265
                 C465,235 485,220 500,215 Z"
              fill={continentColors.africa}
            />

            {/* ASIA - large dusty peach mass */}
            <path
              d="M600,80
                 C680,60 770,70 840,100
                 C910,130 950,180 940,235
                 C930,290 880,330 810,345
                 C740,360 665,350 610,315
                 C555,280 540,230 555,175
                 C570,120 580,90 600,80 Z"
              fill={continentColors.asia}
            />
            {/* India subcontinent */}
            <path
              d="M700,280 C735,265 765,285 775,320 C785,355 770,395 740,410 C710,420 680,400 675,365 C670,330 680,295 700,280 Z"
              fill={continentColors.asia}
            />
            {/* Southeast Asia */}
            <path
              d="M785,320 C815,305 845,325 855,360 C865,395 850,430 820,440 C790,450 765,430 760,395 C755,360 770,330 785,320 Z"
              fill={continentColors.asia}
            />

            {/* AUSTRALIA - warm gray blob */}
            <path
              d="M830,400
                 C880,385 925,405 950,445
                 C975,485 965,530 930,555
                 C895,575 845,575 810,550
                 C775,525 765,480 780,440
                 C795,410 815,395 830,400 Z"
              fill={continentColors.australia}
            />
          </g>

          {/* Location markers - very subtle, quiet annotations */}
          {travel.locations.map((location) => {
            const coords = toSvgCoords(
              location.coordinates.lat,
              location.coordinates.lng
            );

            // Muted olive green for all markers - quiet annotations
            const color = "#546E40";
            const size = 2;

            return (
              <g key={location.id}>
                {/* Soft outer glow */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={size + 1.5}
                  fill={color}
                  opacity="0.12"
                />
                {/* Core dot */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={size}
                  fill={color}
                  opacity="0.45"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
