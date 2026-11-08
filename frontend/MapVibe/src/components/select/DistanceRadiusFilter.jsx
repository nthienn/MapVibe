import { useEffect, useState } from "react";

const DistanceRadiusFilter = ({
  radius,
  selectedLocation,
  onApply,
  onDisable,
  onClose,
}) => {
  const [draftRadius, setDraftRadius] = useState(radius ?? 50);

  const hasLocation = !!selectedLocation;

  useEffect(() => {
    setDraftRadius(radius ?? 50);
  }, [radius]);

  const handleDisable = () => {
    onDisable?.();
    onClose?.();
  };

  const handleApply = () => {
    onApply?.(draftRadius);
    onClose?.();
  };

  return (
    <div className="distance-radius-filter">
      <div className="range-output">{draftRadius}</div>

      <i className="data-radius-title">Radius around selected destination</i>

      <div className="distance-radius-range">
        <div className="rangeslider rangeslider--horizontal">
          <div
            className="rangeslider__fill"
            style={{
              width: `${draftRadius}%`,
            }}
          ></div>

          <div
            className="rangeslider__handle"
            style={{
              left: `calc(${draftRadius}% - 10px)`,
            }}
          ></div>
        </div>

        <input
          className="distance-radius"
          type="range"
          min="1"
          max="100"
          step="1"
          value={draftRadius}
          onChange={(event) => setDraftRadius(Number(event.target.value))}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            zIndex: 5,
          }}
        />
      </div>

      {!hasLocation ? (
        <div className="location-radius-hint">Select a location first.</div>
      ) : (
        <div className="panel-buttons">
          <button className="panel-cancel" onClick={handleDisable}>
            Disable
          </button>

          <button className="panel-apply" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DistanceRadiusFilter;
