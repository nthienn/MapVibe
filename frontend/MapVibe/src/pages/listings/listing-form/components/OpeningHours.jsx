import { forwardRef, useImperativeHandle, useState } from "react";
import {
  createDefaultOpeningHours,
  DAYS_OF_WEEK,
} from "../../../../utils/openingHours";
import TimeSelect from "../../../../components/select/TimeSelect";

const OpeningHours = forwardRef(
  ({ value = [], onChange, readOnly = false }, ref) => {
    const [errors, setErrors] = useState({});

    const enabled = value.length > 0;

    const openingHours = enabled
      ? DAYS_OF_WEEK.map(({ dayOfWeek }) => {
          const existingDay = value.find(
            (item) => item.dayOfWeek === dayOfWeek,
          );

          return (
            existingDay || {
              dayOfWeek,
              openTime: null,
              closeTime: null,
              isClosed: false,
            }
          );
        })
      : [];

    const handleToggle = (enabled) => {
      if (enabled) {
        onChange(createDefaultOpeningHours());
      } else {
        onChange([]);
      }

      setErrors({});
    };

    const handleChange = (dayOfWeek, field, newValue) => {
      const updatedHours = openingHours.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) {
          return day;
        }

        if (field === "openTime") {
          return {
            ...day,
            openTime: newValue,
            isClosed: false,
          };
        }

        return {
          ...day,
          [field]: newValue,
        };
      });

      if (field === "openTime" && newValue === "closed") {
        const updatedHours = openingHours.map((day) => {
          if (day.dayOfWeek !== dayOfWeek) {
            return day;
          }

          return {
            ...day,
            openTime: null,
            closeTime: null,
            isClosed: true,
          };
        });

        onChange(updatedHours);

        setErrors((prev) => {
          const nextErrors = { ...prev };
          delete nextErrors[dayOfWeek];
          return nextErrors;
        });

        return;
      }

      onChange(updatedHours);

      setErrors((prev) => {
        const dayErrors = prev[dayOfWeek];

        if (!dayErrors?.[field]) {
          return prev;
        }

        const nextDayErrors = { ...dayErrors };
        delete nextDayErrors[field];

        const nextErrors = { ...prev };

        if (Object.keys(nextDayErrors).length === 0) {
          delete nextErrors[dayOfWeek];
        } else {
          nextErrors[dayOfWeek] = nextDayErrors;
        }

        return nextErrors;
      });
    };

    const validate = () => {
      if (!enabled) {
        setErrors({});
        return true;
      }

      const newErrors = {};

      openingHours.forEach((day) => {
        if (day.isClosed) {
          return;
        }

        const dayErrors = {};

        if (!day.openTime) {
          dayErrors.openTime = "Please select opening time.";
        }

        if (!day.closeTime) {
          dayErrors.closeTime = "Please select closing time.";
        }

        if (day.openTime && day.closeTime && day.openTime === day.closeTime) {
          dayErrors.closeTime =
            "Closing time must be different from opening time.";
        }

        if (Object.keys(dayErrors).length > 0) {
          newErrors[day.dayOfWeek] = dayErrors;
        }
      });

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
      validate,
    }));

    return (
      <div
        className={`add-listing-section margin-top-45 ${enabled ? "switcher-on" : ""}`}
      >
        <div className="add-listing-headline">
          <h3>
            <i className="sl sl-icon-clock"></i> Opening Hours
          </h3>

          <label className="switch">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggle(e.target.checked)}
              disabled={readOnly}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {enabled && (
          <div className="switcher-content">
            {openingHours.map((day) => (
              <div className="row opening-day" key={day.dayOfWeek}>
                <div className="col-md-2">
                  <h5>
                    {
                      DAYS_OF_WEEK.find(
                        (item) => item.dayOfWeek === day.dayOfWeek,
                      )?.name
                    }
                  </h5>
                </div>

                <div className="col-md-5">
                  <TimeSelect
                    value={day.isClosed ? "closed" : day.openTime || ""}
                    onChange={(value) =>
                      handleChange(day.dayOfWeek, "openTime", value)
                    }
                    placeholder="Opening Time"
                    allowClosed
                    hasError={!!errors[day.dayOfWeek]?.openTime}
                    disabled={readOnly}
                  />

                  {errors[day.dayOfWeek]?.openTime && (
                    <div className="error-wrapper">
                      <span className="field-error">
                        {errors[day.dayOfWeek].openTime}
                      </span>
                    </div>
                  )}
                </div>

                <div className="col-md-5">
                  <TimeSelect
                    value={day.closeTime || ""}
                    onChange={(value) =>
                      handleChange(day.dayOfWeek, "closeTime", value)
                    }
                    placeholder="Closing Time"
                    hasError={!!errors[day.dayOfWeek]?.closeTime}
                    disabled={readOnly || day.isClosed}
                  />

                  {errors[day.dayOfWeek]?.closeTime && (
                    <div className="error-wrapper">
                      <span className="field-error">
                        {errors[day.dayOfWeek].closeTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

export default OpeningHours;
