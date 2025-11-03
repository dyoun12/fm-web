"use client";
import React from "react";
import { cn } from "@/lib/classnames";

export type LocationProps = {
  address: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: number; // px
  className?: string;
  interactive?: boolean; // true면 즉시 상호작용 허용
  label?: string; // 지도 좌상단 커스텀 라벨(임베드 UI 대체 표시)
  /**
   * 길찾기/검색 패널에 노출될 쿼리 텍스트를 강제 지정.
   * 좌표(lat/lng)를 함께 제공하면서도 패널에는 주소 문자열을 보이게 할 때 사용.
   */
  queryText?: string;

  // Google Maps Embed API v1 지원 옵션(키가 있을 때 사용됨)
  apiKey?: string; // 절대 커밋 금지 — 보안 저장소/런타임 주입
  embedMode?: "search" | "place" | "view" | "directions" | "streetview"; // 모드 지정(키 제공 시)
  // 공통 옵션
  mapType?: "roadmap" | "satellite"; // v1 공통 maptype
  language?: string; // ISO 코드, 예: 'ko'
  region?: string; // ISO 3166-1 알파-2, 예: 'KR'
  // search 모드
  searchQuery?: string; // 검색 문자열(미지정 시 queryText/address/좌표 순)
  // place 모드
  placeId?: string; // place_id:xxxxx 형태로 q에 사용됨
  // view 모드
  centerLat?: number; // 중심 좌표(기본: lat)
  centerLng?: number; // 중심 좌표(기본: lng)
  // directions 모드
  origin?: string; // 출발지 텍스트
  originLat?: number;
  originLng?: number;
  destination?: string; // 도착지 텍스트
  destinationLat?: number;
  destinationLng?: number;
  waypoints?: string; // 'optimize:true|via:place_id:xxx|lat,lng|...'
  travelMode?: "driving" | "walking" | "bicycling" | "transit";
  avoid?: Array<"tolls" | "highways" | "ferries" | "indoor">; // 다중 값 허용
  units?: "metric" | "imperial";
  // streetview 모드
  pano?: string; // 파노라마 ID
  heading?: number;
  pitch?: number;
  fov?: number; // 10–100
};

function buildEmbedSrcLegacy({ address, lat, lng, zoom, queryText }: { address: string; lat?: number; lng?: number; zoom?: number; queryText?: string }) {
  const params = new URLSearchParams({ output: "embed" });
  const hasCoords = typeof lat === "number" && typeof lng === "number";
  // q: 패널에 보일 텍스트. queryText 우선 → 없으면 좌표 또는 주소
  if (queryText) {
    params.set("q", queryText);
  } else if (hasCoords) {
    params.set("q", `${lat},${lng}`);
  } else {
    params.set("q", address);
  }
  // ll: 지도의 중심(좌표가 있으면 함께 지정하여 시각적 일치도 향상)
  if (hasCoords) params.set("ll", `${lat},${lng}`);
  if (zoom) params.set("z", String(zoom));
  return `https://www.google.com/maps?${params.toString()}`;
}

function latLngToString(lat?: number, lng?: number) {
  if (typeof lat === "number" && typeof lng === "number") return `${lat},${lng}`;
  return undefined;
}

function buildEmbedSrcV1(
  opts: LocationProps
): string {
  // 모드별 엔드포인트
  const mode = opts.embedMode ?? "search";
  let endpoint: string;
  switch (mode) {
    case "place":
      endpoint = "place";
      break;
    case "view":
      endpoint = "view";
      break;
    case "directions":
      endpoint = "directions";
      break;
    case "streetview":
      endpoint = "streetview";
      break;
    case "search":
    default:
      endpoint = "search";
  }

  const params = new URLSearchParams();
  if (opts.apiKey) params.set("key", opts.apiKey);
  if (typeof opts.zoom === "number") params.set("zoom", String(opts.zoom));
  if (opts.mapType) params.set("maptype", opts.mapType);
  if (opts.language) params.set("language", opts.language);
  if (opts.region) params.set("region", opts.region);

  // 모드별 파라미터 구성
  if (endpoint === "search") {
    const q = opts.searchQuery ?? opts.queryText ?? opts.address ?? latLngToString(opts.lat, opts.lng) ?? "";
    params.set("q", q);
  } else if (endpoint === "place") {
    if (opts.placeId) {
      params.set("q", `place_id:${opts.placeId}`);
    } else {
      const q = opts.queryText ?? opts.address ?? "";
      params.set("q", q);
    }
  } else if (endpoint === "view") {
    const center = latLngToString(opts.centerLat ?? opts.lat, opts.centerLng ?? opts.lng);
    if (center) params.set("center", center);
  } else if (endpoint === "directions") {
    // origin/destination은 텍스트 또는 좌표 우선순위로 설정
    const origin = ((): string | undefined => {
      const c = latLngToString(opts.originLat, opts.originLng);
      return opts.origin ?? c;
    })();
    const destination = ((): string | undefined => {
      const c = latLngToString(opts.destinationLat, opts.destinationLng);
      return opts.destination ?? c;
    })();
    if (origin) params.set("origin", origin);
    if (destination) params.set("destination", destination);
    if (opts.waypoints) params.set("waypoints", opts.waypoints);
    if (opts.travelMode) params.set("mode", opts.travelMode);
    if (opts.units) params.set("units", opts.units);
    if (opts.avoid && opts.avoid.length) params.set("avoid", opts.avoid.join("|"));
  } else if (endpoint === "streetview") {
    if (opts.pano) params.set("pano", opts.pano);
    else {
      // pano가 없다면 위치 텍스트 또는 좌표
      const location = opts.queryText ?? latLngToString(opts.lat, opts.lng) ?? opts.address;
      if (location) params.set("location", location);
    }
    if (typeof opts.heading === "number") params.set("heading", String(opts.heading));
    if (typeof opts.pitch === "number") params.set("pitch", String(opts.pitch));
    if (typeof opts.fov === "number") params.set("fov", String(opts.fov));
  }

  return `https://www.google.com/maps/embed/v1/${endpoint}?${params.toString()}`;
}

export function Location({
  address,
  lat,
  lng,
  zoom = 16,
  height = 360,
  className,
  interactive = false,
  label,
  queryText,
  apiKey,
  embedMode,
  mapType,
  language,
  region,
  searchQuery,
  placeId,
  centerLat,
  centerLng,
  origin,
  originLat,
  originLng,
  destination,
  destinationLat,
  destinationLng,
  waypoints,
  travelMode,
  avoid,
  units,
  pano,
  heading,
  pitch,
  fov,
}: LocationProps) {
  const [enabled, setEnabled] = React.useState(interactive);
  const title = `지도: ${address}`;
  const src = apiKey
    ? buildEmbedSrcV1({
        address,
        lat,
        lng,
        zoom,
        queryText,
        apiKey,
        embedMode,
        mapType,
        language,
        region,
        searchQuery,
        placeId,
        centerLat,
        centerLng,
        origin,
        originLat,
        originLng,
        destination,
        destinationLat,
        destinationLng,
        waypoints,
        travelMode,
        avoid,
        units,
        pano,
        heading,
        pitch,
        fov,
        height,
        className,
        interactive,
        label,
      })
    : buildEmbedSrcLegacy({ address, lat, lng, zoom, queryText });

  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl border border-zinc-200", className)}>
      {label ? (
        <div className="pointer-events-auto absolute left-3 top-3 z-20 rounded-md bg-white/90 px-3 py-2 text-xs font-medium text-zinc-800 shadow ring-1 ring-zinc-200">
          {label}
        </div>
      ) : null}
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full"
        style={{ height }}
        aria-label={title}
      />

      {/* 기본은 스크롤/휠 등 상호작용을 차단하고, 버튼으로 해제 */}
      {!enabled && (
        <div
          className="absolute inset-0 z-10 flex items-end justify-end bg-transparent"
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        >
          <div className="p-3" style={{ pointerEvents: "auto" }}>
            <button
              type="button"
              onClick={() => setEnabled(true)}
              className={
                "rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-800 shadow ring-1 ring-zinc-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              }
              aria-label="지도 상호작용 활성화"
            >
              지도 상호작용 활성화
            </button>
          </div>
        </div>
      )}

      {/* enabled=false일 때 실제 상호작용을 막기 위한 투명 레이어 */}
      {!enabled && (
        <div
          className="absolute inset-0 z-0"
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        />
      )}
    </div>
  );
}
