function transform(input) {
  const LIST_LIMIT = 50;

  const visits =
    input?.ServiceDelivery?.StopMonitoringDelivery?.MonitoredStopVisit ?? [];

  const departures = visits
    .map((v) => v?.MonitoredVehicleJourney)
    .filter((j) => {
      const call = j?.MonitoredCall;
      // must have a line + destination, and some kind of time we can display
      return (
        j?.LineRef &&
        call?.DestinationDisplay &&
        (call?.ExpectedDepartureTime || call?.ExpectedArrivalTime)
      );
    })
    .map((j) => {
      const call = j.MonitoredCall;
      const time = call.ExpectedDepartureTime || call.ExpectedArrivalTime;
      return {
        dest: call.DestinationDisplay,
        line: j.LineRef,
        dir: j.DirectionRef || "",
        time, // keep as ISO string
      };
    })
    // sort by actual time (don’t assume API order)
    .sort((a, b) => new Date(a.time) - new Date(b.time))
    .slice(0, LIST_LIMIT);

  // return a smaller, Liquid-friendly payload
  return {
    departures,
  };
}
