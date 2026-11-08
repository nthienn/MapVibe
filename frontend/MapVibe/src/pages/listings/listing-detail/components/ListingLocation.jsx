import MapView from "../../../../components/map/MapView";

const ListingLocation = ({ location }) => {
  return (
    <div id="listing-location" className="listing-section">
      <h3 className="listing-desc-headline margin-top-70 margin-bottom-30">
        Location
      </h3>

      <div id="singleListingMap-container">
        <MapView latitude={location.latitude} longitude={location.longitude} />
      </div>
    </div>
  );
};

export default ListingLocation;
