export const SocketEvents = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Order events
  ORDER_NEW: 'order:new',
  ORDER_UPDATE: 'order:update',
  ORDER_CANCEL: 'order:cancel',
  ORDER_COMPLETE: 'order:complete',
  ORDER_ITEM_UPDATE: 'order:item:update',
  ORDER_ITEM_READY: 'order:item:ready',

  // Table events
  TABLE_UPDATE: 'table:update',
  TABLE_CALL_WAITER: 'table:call-waiter',
  TABLE_REQUEST_CHECK: 'table:request-check',

  // Kitchen events
  KITCHEN_NEW_ORDER: 'kitchen:new-order',
  KITCHEN_ORDER_READY: 'kitchen:order-ready',

  // Notification events
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',

  // Menu events
  MENU_ITEM_UNAVAILABLE: 'menu:item:unavailable',
  MENU_ITEM_AVAILABLE: 'menu:item:available',
} as const;

export type SocketEvent = (typeof SocketEvents)[keyof typeof SocketEvents];
