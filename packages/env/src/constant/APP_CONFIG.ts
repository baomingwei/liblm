
export const APP_CONFIG = {
    LOGIN_URL: '/login',
    TOKEN: 'lian-med-token',
    AUTH_NAME: 'username',
    isProduction: true,
    CELL_WIDTH_MINI: 30,
    CELL_WIDTH_TINY: 48,
    CELL_WIDTH_SMALL: 96,
    CELL_WIDTH_MIDDLE: 128,
    CELL_WIDTH_LARGE: 192,
  };
  
  export const RUNTIME_CONFIG = {
    SUCCESS_HTTP_STATUS: [200, 201, 204],
  };
  
  
  export const WEBSOCKET_STATUS = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
  };
  
  export const WEBSOCKET_STATUS_TEXT = ['未打开', '已打开', '正在关闭', '已关闭'];
  
  export const ALLOW_CALC_EDD_BASED_ON_IVF = 'ALLOW_CALC_EDD_BASED_ON_IVF'
  