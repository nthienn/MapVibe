import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import mapvinagl from "mapvina-gl";
import ListingMapPopup from "./ListingMapPopup";

const DEFAULT_CENTER = {
  lat: 16.0544,
  lng: 108.2022,
};

const DEFAULT_ZOOM = 11;

const MARKER_GROUP_DISTANCE_METERS = 30;
const MARKER_OFFSET_RADIUS = 18;

const getMarkerOffset = (index, total, radius = MARKER_OFFSET_RADIUS) => {
  if (total <= 1) {
    return [0, 0];
  }

  const angle = (index / total) * Math.PI * 2;

  return [
    Math.round(Math.cos(angle) * radius),
    Math.round(Math.sin(angle) * radius),
  ];
};

const getDistanceInMeters = (lat1, lng1, lat2, lng2) => {
  const earthRadius = 6371000;

  const toRadians = (value) => (value * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const groupListingsByDistance = (listings) => {
  const groups = [];

  listings.forEach((listing) => {
    const lat = Number(listing.latitude);
    const lng = Number(listing.longitude);

    let group = groups.find((items) => {
      const firstListing = items[0];

      return (
        getDistanceInMeters(
          lat,
          lng,
          Number(firstListing.latitude),
          Number(firstListing.longitude),
        ) <= MARKER_GROUP_DISTANCE_METERS
      );
    });

    if (!group) {
      group = [];
      groups.push(group);
    }

    group.push(listing);
  });

  return groups;
};

const ListingsMap = ({ listings = [], hoveredListingId, onMarkerClick }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const popupRootsRef = useRef(new Map());

  // Giữ callback mới nhất mà không cần rebuild markers
  const onMarkerClickRef = useRef(onMarkerClick);

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  const validListings = listings.filter(
    (listing) =>
      listing.latitude !== null &&
      listing.latitude !== undefined &&
      listing.longitude !== null &&
      listing.longitude !== undefined &&
      !Number.isNaN(Number(listing.latitude)) &&
      !Number.isNaN(Number(listing.longitude)),
  );

  // Khởi tạo map một lần
  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    const map = new mapvinagl.Map({
      container: mapContainerRef.current,
      style: `https://maps.mapvina.com/styles/v2/streets.json?key=${
        import.meta.env.VITE_MAPVINA_KEY
      }`,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    mapRef.current = map;

    map.addControl(
      new mapvinagl.NavigationControl({
        showZoom: true,
        showCompass: false,
      }),
      "top-right",
    );

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      popupRootsRef.current.forEach((root) => root.unmount());
      popupRootsRef.current.clear();

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Cập nhật markers khi listings thay đổi
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    // Xóa marker cũ
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Không có listing có tọa độ
    if (validListings.length === 0) {
      mapRef.current.flyTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });

      return;
    }

    // Group những listing có tọa độ trùng hoặc cách nhau <= 30m
    const coordinateGroups = groupListingsByDistance(validListings);

    const bounds = [];

    // Tạo marker
    validListings.forEach((listing) => {
      const lat = Number(listing.latitude);
      const lng = Number(listing.longitude);

      const group = coordinateGroups.find((items) =>
        items.some((item) => item.id === listing.id),
      );

      const groupIndex = group.findIndex((item) => item.id === listing.id);

      const offset = getMarkerOffset(groupIndex, group.length);

      // Popup
      const popupContent = document.createElement("div");
      const popupRoot = createRoot(popupContent);

      popupRoot.render(<ListingMapPopup listing={listing} />);

      popupRootsRef.current.set(listing.id, popupRoot);

      const popup = new mapvinagl.Popup({
        closeButton: true,
        closeOnClick: true,
      }).setDOMContent(popupContent);

      // Marker
      const marker = new mapvinagl.Marker({
        offset,
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      // Click marker
      marker.getElement().addEventListener("click", () => {
        const popup = marker.getPopup();

        onMarkerClickRef.current?.(listing.id);

        // Đảm bảo popup luôn ở trạng thái mở sau khi click marker.
        requestAnimationFrame(() => {
          if (popup && !popup.isOpen()) {
            marker.togglePopup();
          }
        });
      });

      markersRef.current.set(listing.id, marker);

      bounds.push([lng, lat]);
    });

    // Chỉ một marker
    if (bounds.length === 1) {
      mapRef.current.flyTo({
        center: bounds[0],
        zoom: 15,
      });

      return;
    }

    // Nhiều marker → fit toàn bộ bounds
    const minLng = Math.min(...bounds.map(([lng]) => lng));

    const maxLng = Math.max(...bounds.map(([lng]) => lng));

    const minLat = Math.min(...bounds.map(([, lat]) => lat));

    const maxLat = Math.max(...bounds.map(([, lat]) => lat));

    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: 60,
        maxZoom: 15,
      },
    );
  }, [listings]);

  // Hover ListingCard → Marker
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    // Reset tất cả marker
    markersRef.current.forEach((marker) => {
      marker.getElement().classList.remove("is-hovered");

      const popup = marker.getPopup();

      if (popup?.isOpen()) {
        popup.remove();
      }
    });

    // Không có listing đang hover
    if (!hoveredListingId) {
      return;
    }

    const marker = markersRef.current.get(hoveredListingId);

    if (!marker) {
      return;
    }

    // Highlight marker
    marker.getElement().classList.add("is-hovered");

    // Fly tới marker
    mapRef.current.flyTo({
      center: marker.getLngLat(),
      zoom: 15,
      essential: true,
    });

    // Mở popup
    marker.togglePopup();
  }, [hoveredListingId]);

  return <div ref={mapContainerRef} className="listings-map" />;
};

export default ListingsMap;
