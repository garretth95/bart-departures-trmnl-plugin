function transform(input) {
  const LIST_LIMIT = 25;

  const delivery = input?.ServiceDelivery?.StopMonitoringDelivery;
  if (!delivery) return input;

  const d = Array.isArray(delivery) ? delivery[0] : delivery;

  let visits = d?.MonitoredStopVisit || [];
  if (!Array.isArray(visits)) visits = [visits];

  const pickIso = (call) => call?.ExpectedDepartureTime || call?.ExpectedArrivalTime || null;

  const departures = visits
    .map(v => v?.MonitoredVehicleJourney)
    .filter(j => j && j.LineRef && j.MonitoredCall?.DestinationDisplay)
    .map(j => {
      const call = j.MonitoredCall;
      return {
        dest: call.DestinationDisplay,
        line: j.LineRef,
        dir: j.DirectionRef || "",
        time: pickIso(call), // ISO string
      };
    })
    .filter(x => x.time) // must have a time
    .sort((a, b) => Date.parse(a.time) - Date.parse(b.time))
    .slice(0, LIST_LIMIT);

  // return just what Liquid needs
  return {
    departures,
  };
}
