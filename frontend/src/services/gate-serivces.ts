import type {
  ActiveTimeParamsPayload,
  GateActionPayload,
  ParamsPayload,
} from '..';
import { api } from './api';

export const gateServices = {
  recordGateAction: async (payload: GateActionPayload) => {
    const response = await api.post('/gatelogs', {
      personId: payload.personId,
      vehicleId: payload.vehicleId,
      gateId: payload.gateId,
      action: payload.action,
      breakType: payload.breakType,
    });

    return response;
  },
  getTodayActivity: async (params: ParamsPayload) => {
    const response = await api.get('/gatelogs/today', {
      params,
    });
    return response;
  },
  getAllActivity: async (params: ParamsPayload) => {
    const response = await api.get('/gatelogs', {
      params,
    });
    console.log(response);
    return response;
  },
  generateActiveReport: async (params: ActiveTimeParamsPayload) => {
    const response = await api.get('/gatelogs/report/active', {
      params,
      responseType: params.format === 'pdf' ? 'arraybuffer' : 'json',
    });
    return response;
  },
  generateInOutReport: async (params: ActiveTimeParamsPayload) => {
    const response = await api.get('/gatelogs/report/in-out', {
      params,
      responseType: params.format === 'pdf' ? 'arraybuffer' : 'json',
    });
    return response;
  },
  getDashboardSummary: async () => {
    const response = await api.get('/gatelogs/get-dashboard-summary');
    return response;
  },
};
