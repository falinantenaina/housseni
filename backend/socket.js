const noop = { to: () => noop, emit: () => {}, on: () => {} };

let _io = noop;

export const initSocket = (_httpServer) => {
  console.log(
    "[Notifications] Mode Passenger cPanel : polling HTTP actif (15 s).",
  );
  _io = noop;
  return _io;
};

export const getIO = () => _io;
