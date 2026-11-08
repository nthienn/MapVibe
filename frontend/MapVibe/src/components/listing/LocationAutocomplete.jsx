import { useEffect, useRef, useState } from "react";
import locationService from "../../services/locationService";

const LocationAutocomplete = ({ value = "", onChange, onSelect, onSearch }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef(null);
  const requestIdRef = useRef(0);
  const inputFocusedRef = useRef(false);

  // Prevent suggestion search/reopen immediately after selecting a location.
  const justSelectedRef = useRef(false);

  useEffect(() => {
    const trimmedValue = value.trim();

    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    if (trimmedValue.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const result = await locationService.getLocationSuggestions(
          trimmedValue,
          8,
        );

        if (requestId !== requestIdRef.current) {
          return;
        }

        setSuggestions(result || []);

        // Only open when the user is currently interacting with the autocomplete input.
        if (inputFocusedRef.current) {
          setIsOpen(true);
        }
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        console.error("Location suggestions failed:", error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (event) => {
    // User is typing manually again.
    justSelectedRef.current = false;

    onChange?.(event.target.value);
  };

  const handleSelect = (suggestion) => {
    // Cancel any pending suggestion request.
    requestIdRef.current++;

    // Mark this value as coming from a suggestion selection.
    justSelectedRef.current = true;

    // Parent is responsible for updating the input value and storing the selected location.
    onSelect?.(suggestion);

    setSuggestions([]);
    setIsOpen(false);
    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    setIsOpen(false);

    onSearch?.();
  };

  return (
    <div ref={wrapperRef} className="location-autocomplete">
      <input
        id="autocomplete-input"
        type="text"
        placeholder="Search for a place or keyword"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          inputFocusedRef.current = true;

          if (suggestions.length > 0) {
            setIsOpen(true);
          }
        }}
        onBlur={() => {
          inputFocusedRef.current = false;
        }}
      />

      {isOpen && (
        <div className="location-autocomplete-results">
          {loading && (
            <div className="location-autocomplete-loading">Searching...</div>
          )}

          {!loading && suggestions.length === 0 && (
            <div className="location-autocomplete-empty">
              No locations found.
            </div>
          )}

          {!loading &&
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="location-autocomplete-item"
                onClick={() => handleSelect(suggestion)}
              >
                <div className="location-autocomplete-item-name">
                  {suggestion.name}
                </div>

                <div className="location-autocomplete-item-address">
                  {[
                    suggestion.address,
                    suggestion.ward?.name,
                    suggestion.province?.name,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
