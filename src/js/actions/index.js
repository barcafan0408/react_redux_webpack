export const addTransport = transport => ({
  type: "ADD_TRANSPORT",
  payload: transport
});

export const addTransportList = data => ({
  type: 'ADD_TRANSPORT_LIST',
  payload: data,
});