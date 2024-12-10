const convertUtcDateTimeToLocalDateTime = (utcDateTime: string | Date): string => {
    const date = typeof utcDateTime === "string" ? new Date(utcDateTime) : utcDateTime;
  
    return date.toLocaleString(undefined, {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateStyle: "short",
      timeStyle: "short",
    });
  };
  
  export default convertUtcDateTimeToLocalDateTime;
  