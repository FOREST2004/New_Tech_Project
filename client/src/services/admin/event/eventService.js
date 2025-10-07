import api from "../../common/axios";


export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  
  params.append('page', filters.page || '1');
  params.append('limit', filters.limit || '10');
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && key !== 'page' && key !== 'limit') {
      params.append(key, filters[key]);
    }
  });
  
  const res = await api.get(`/admin/events/list?${params.toString()}`);  
  return res.data;
};

export const getEventById = async (id) => {
  const res = await api.get(`/admin/events/detail/${id}`);
  return res.data;
};


export const createEvent = async (event) => {
  const res = await api.post("/admin/events/create", event);
  return res.data;
};


export const updateEvent = async (id, updatedData) => {
  const res = await api.put(`/admin/events/edit/${id}`, updatedData);
  return res.data;
};


export const deleteEvent = async (id) => {
  const res = await api.delete(`/admin/events/delete/${id}`);
  return res.data;
};



