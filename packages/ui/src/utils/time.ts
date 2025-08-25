/**
 * Calculate local time for a city based on UTC timezone offset
 * @param timezoneOffsetSeconds - Timezone offset from UTC in seconds (from OpenWeatherMap API)
 * @returns Formatted local time string (HH:MM)
 */
export function calculateLocalTime(timezoneOffsetSeconds?: number): string {
  if (!timezoneOffsetSeconds) {
    // Fallback to browser's local time if no timezone data
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Get current UTC time
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  
  // Add the city's timezone offset to get the city's local time
  const cityTime = new Date(utcTime + (timezoneOffsetSeconds * 1000));
  
  return cityTime.toLocaleTimeString([], {
    hour: "2-digit", 
    minute: "2-digit",
  });
}

/**
 * Get timezone name/description from offset seconds
 * @param timezoneOffsetSeconds - Timezone offset from UTC in seconds
 * @returns Human readable timezone description
 */
export function getTimezoneDescription(timezoneOffsetSeconds?: number): string {
  if (!timezoneOffsetSeconds) return "Local time";
  
  const hours = timezoneOffsetSeconds / 3600;
  const sign = hours >= 0 ? "+" : "-";
  const absHours = Math.abs(hours);
  const wholeHours = Math.floor(absHours);
  const minutes = Math.round((absHours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `UTC${sign}${wholeHours}`;
  } else {
    return `UTC${sign}${wholeHours}:${minutes.toString().padStart(2, '0')}`;
  }
}

/**
 * Format time in city's local timezone
 * @param dateString - UTC date string from forecast API
 * @param timezoneOffsetSeconds - City's timezone offset from UTC in seconds
 * @returns Formatted local time string (HH:MM)
 */
export function formatTimeInTimezone(dateString?: string, timezoneOffsetSeconds?: number): string {
  if (!dateString) return "";
  
  try {
    if (!timezoneOffsetSeconds) {
      // Fallback to browser's local time parsing
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    // Parse UTC time from the forecast API
    const utcDate = new Date(dateString);
    
    // Add city's timezone offset to get city's local time
    const cityTime = new Date(utcDate.getTime() + (timezoneOffsetSeconds * 1000));
    
    return cityTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate time until a future time in city's timezone
 * @param dateString - UTC date string from forecast API
 * @param timezoneOffsetSeconds - City's timezone offset from UTC in seconds
 * @returns Time until string (e.g., "in 3h", "Now", etc.)
 */
export function getTimeUntilInTimezone(dateString?: string, timezoneOffsetSeconds?: number): string {
  if (!dateString) return "";
  
  try {
    if (!timezoneOffsetSeconds) {
      // Fallback to browser's timezone behavior
      const targetTime = new Date(dateString);
      const now = new Date();
      const diffMs = targetTime.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (diffHours <= 0 && diffMins <= 0) return "Now";
      if (diffHours <= 0) return `in ${diffMins}m`;
      if (diffHours < 24) return `in ${diffHours}h ${diffMins}m`;
      return "Later today";
    }

    // Parse UTC time and convert to city time
    const utcTargetTime = new Date(dateString);
    const cityTargetTime = new Date(utcTargetTime.getTime() + (timezoneOffsetSeconds * 1000));
    
    // Get current time in city timezone
    const utcNow = new Date();
    const cityNow = new Date(utcNow.getTime() + (timezoneOffsetSeconds * 1000));
    
    const diffMs = cityTargetTime.getTime() - cityNow.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours <= 0 && diffMins <= 0) return "Now";
    if (diffHours <= 0) return `in ${diffMins}m`;
    if (diffHours < 24) return `in ${diffHours}h ${diffMins}m`;
    return "Later today";
  } catch {
    return "";
  }
}