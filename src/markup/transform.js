function transform(input) {
  const LIST_LIMIT = 8;
  input.ServiceDelivery.StopMonitoringDelivery.MonitoredStopVisit = input.ServiceDelivery.StopMonitoringDelivery.MonitoredStopVisit.slice(0, LIST_LIMIT);
  return input;
}
