export const addTransport = transport => ({
  type: "ADD_TRANSPORT",
  payload: transport
});

export const addTransportList = data => ({
  type: 'ADD_TRANSPORT_LIST',
  payload: data,
});

export const removeTransport = id => ({
  type: "REMOVE_TRANSPORT",
  payload: id
});

export const addStorage = storage => ({
  type: "ADD_STORAGE",
  payload: storage
});

export const addStoragesList = data => ({
  type: "ADD_STORAGES_LIST",
  payload: data
});

export const removeStorage = id => ({
  type: "REMOVE_STORAGE",
  payload: id
});

export const addTariff = tariff => ({
  type: "ADD_TARIFF",
  payload: tariff
});

export const addTariffsList = data => ({
  type: "ADD_TARIFFS_LIST",
  payload: data
});

export const removeTariff = id => ({
  type: "REMOVE_TARIFF",
  payload: id
});

export const addRouteList = routeList => ({
  type: "ADD_ROUTE_LIST",
  payload: routeList
});

export const addRoutesList = data => ({
  type: "ADD_ROUTES_LIST",
  payload: data
});

export const removeRouteList = id => ({
  type: "REMOVE_ROUTE_LIST",
  payload: id
});