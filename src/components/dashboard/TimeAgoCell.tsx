import React, { useState, useEffect, memo, useRef } from "react";

// Calculate time ago without creating a new function on each render
const calculateTimeAgo = (dateTime: string): string => {
  const date = new Date(dateTime + "Z"); // Ensure UTC time
  const now = new Date();
  const timeSpan = (now.getTime() - date.getTime()) / 1000; // Difference in seconds

  if (timeSpan < 60) return `${Math.floor(timeSpan)} seconds `;
  if (timeSpan < 3600) return `${Math.floor(timeSpan / 60)} minutes `;
  if (timeSpan < 86400) return `${Math.floor(timeSpan / 3600)} hours `;
  if (timeSpan < 604800) return `${Math.floor(timeSpan / 86400)} days `;
  if (timeSpan < 2592000) return `${Math.floor(timeSpan / 604800)} weeks `;
  if (timeSpan < 31536000) return `${Math.floor(timeSpan / 2592000)} months `;
  return `${Math.floor(timeSpan / 31536000)} years `;
};

// Custom hook to get and update time ago with performance optimizations
function useTimeAgo(dateTime: string) {
  const [timeAgo, setTimeAgo] = useState<string>(() =>
    calculateTimeAgo(dateTime)
  );
  const dateRef = useRef<string>(dateTime);
  const timestamp = useRef<number>(new Date(dateTime + "Z").getTime());

  useEffect(() => {
    // Only update the ref when dateTime actually changes
    if (dateTime !== dateRef.current) {
      dateRef.current = dateTime;
      timestamp.current = new Date(dateTime + "Z").getTime();
      setTimeAgo(calculateTimeAgo(dateTime));
    }
  }, [dateTime]);

  useEffect(() => {
    // Determine update frequency based on time difference
    const now = new Date().getTime();
    const diff = now - timestamp.current;

    // Adaptive update interval based on how old the timestamp is
    let updateInterval: number;

    if (diff < 60000) {
      // Less than a minute old
      updateInterval = 1000; // Update every second
    } else if (diff < 3600000) {
      // Less than an hour old
      updateInterval = 60000; // Update every minute
    } else if (diff < 86400000) {
      // Less than a day old
      updateInterval = 300000; // Update every 5 minutes
    } else {
      updateInterval = 3600000; // Update every hour for older timestamps
    }

    // Function to update time ago
    const updateTimeAgo = () => {
      setTimeAgo(calculateTimeAgo(dateRef.current));
    };

    // Set up interval with adaptive timing
    const intervalId = setInterval(updateTimeAgo, updateInterval);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [dateTime]);

  return timeAgo;
}

interface TimeAgoCellProps {
  dateTime: string;
}

// Memoized table cell component with custom comparison
const TimeAgoCell = memo(
  ({ dateTime }: TimeAgoCellProps) => {
    const timeAgo = useTimeAgo(dateTime);
    return <>{timeAgo}</>;
  },
  (prevProps, nextProps) => {
    // Only re-render if dateTime changes
    return prevProps.dateTime === nextProps.dateTime;
  }
);

// Add display name for better debugging
TimeAgoCell.displayName = "TimeAgoCell";

export default TimeAgoCell;
