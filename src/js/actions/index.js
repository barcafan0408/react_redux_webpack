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