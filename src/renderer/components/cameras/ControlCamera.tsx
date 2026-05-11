import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppButton from '../ui/AppButton';

function useRadialDrag(onChange: (x: number, y: number, phase: 'move' | 'end') => void) {
  const draggingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onPointerDown = useCallback((ev: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    activePointerIdRef.current = ev.pointerId;
    (ev.target as Element).setPointerCapture?.(ev.pointerId);
  }, []);

  const onPointerUp = useCallback(
    (ev?: PointerEvent) => {
      if (ev && activePointerIdRef.current !== null && ev.pointerId !== activePointerIdRef.current) {
        return;
      }
      if (!draggingRef.current) return;
      draggingRef.current = false;
      activePointerIdRef.current = null;
      onChange(0, 0, 'end');
    },
    [onChange],
  );

  const onPointerMove = useCallback(
    (ev: PointerEvent | React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || !containerRef.current) return;
      if (activePointerIdRef.current !== null && ev.pointerId !== activePointerIdRef.current) {
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ev.clientX - cx;
      const dy = ev.clientY - cy;

      const radius = Math.min(rect.width, rect.height) / 2;
      const nx = Math.max(-1, Math.min(1, dx / radius));
      const ny = Math.max(-1, Math.min(1, dy / radius));
      onChange(nx, ny, 'move');
    },
    [onChange],
  );

  useEffect(() => {
    const up = (e: PointerEvent) => onPointerUp(e);
    const move = (e: PointerEvent) => onPointerMove(e);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointermove', move);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointermove', move);
    };
  }, [onPointerMove, onPointerUp]);

  return { containerRef, onPointerDown };
}

export default function ControlCamera() {
  const { id } = useParams<{ id: string }>();
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState('');
  const [pad, setPad] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0);
  const [pingMs, setPingMs] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    window.cameraApi.getCamera(id).then((camera) => {
      if (!camera) return;
      setName(camera.name);
      setConnected(!!camera.connected);
    });
  }, [id]);

  // poll ping periodically
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => {
      window.cameraApi
        .getPing({ cameraId: id })
        .then((ms) => setPingMs(ms))
        .catch(() => setPingMs(null));
    }, 1000);
    return () => clearInterval(interval);
  }, [id]);

  const panTiltSend = useMemo(
    () =>
      createThrottledSender((pan: number, tilt: number) => {
        if (!id) return;
        window.cameraApi.controlPanTilt({ cameraId: id, pan, tilt });
      }, 50),
    [id],
  );

  const zoomSend = useMemo(
    () =>
      createThrottledSender((value: number) => {
        if (!id) return;
        window.cameraApi.controlZoom({ cameraId: id, zoom: value });
      }, 50),
    [id],
  );

  const sendFullStopPtz = useCallback(() => {
    if (!id) return;
    panTiltSend.invokeImmediate(0, 0);
    zoomSend.invokeImmediate(0);
  }, [id, panTiltSend, zoomSend]);

  const { containerRef, onPointerDown } = useRadialDrag((x, y, phase) => {
    setPad({ x, y });
    if (phase === 'end') {
      sendFullStopPtz();
      return;
    }
    // y inverted for intuitive up/down control; pan=x, tilt=-y
    panTiltSend.run(x, -y);
  });

  const onZoom = zoomSend.run;

  return (
    <Layout title={`Control ${name}`}>
      <Container>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <p className="mb-2 text-sm text-gray-600">Pan / Tilt</p>
            <div
              ref={containerRef}
              onPointerDown={onPointerDown}
              className="relative w-64 h-64 bg-gray-100 border border-gray-200 rounded-full select-none touch-none"
            >
              <div className="absolute inset-0 w-1 h-64 m-auto bg-gray-200" />
              <div className="absolute inset-0 w-64 h-1 m-auto bg-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-400">Drag</span>
              </div>
              {/* indicator dot showing current pan/tilt vector */}
              <div
                className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-sm"
                style={{
                  left: `${50 + pad.x * 50}%`,
                  top: `${50 + pad.y * 50}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </div>

          <div className="w-8" />

          <div className="flex-1">
            <p className="mb-2 text-sm text-gray-600">Zoom</p>
            <div className="flex items-center h-64">
              <input
                type="range"
                min={-1}
                max={1}
                step={0.01}
                value={zoom}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setZoom(v);
                  onZoom(v);
                }}
                onMouseUp={() => {
                  setZoom(0);
                  sendFullStopPtz();
                }}
                onTouchEnd={() => {
                  setZoom(0);
                  sendFullStopPtz();
                }}
                className="w-64 origin-center rotate-90"
              />
            </div>
            <div className="mt-1 text-xs text-gray-400">Slide up to zoom in, down to zoom out</div>
          </div>
        </div>

        <div className="flex mt-6">
          <span
            className={`px-2 py-0.5 rounded text-xs border ${
              connected ? 'text-green-700 border-green-200' : 'text-gray-600 border-gray-200'
            }`}
          >
            {connected ? 'connected' : 'disconnected'}
          </span>
          <span className="ml-3 text-xs text-gray-600">Ping: {pingMs ?? '-'} ms</span>
          <AppButton
            className="ml-auto"
            to={`/cameras/${id}`}
          >
            Edit
          </AppButton>
        </div>
      </Container>
    </Layout>
  );
}

function createThrottledSender<T extends (...args: never[]) => void>(
  fn: T,
  wait: number,
): { run: T; invokeImmediate: (...args: Parameters<T>) => void } {
  let last = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const invokeImmediate = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastArgs = null;
    last = Date.now();
    fn(...args);
  };

  const run = ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    lastArgs = args;
    if (remaining <= 0) {
      last = now;
      lastArgs = null;
      fn(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        last = Date.now();
        timeout = null;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, remaining);
    }
  }) as T;

  return { run, invokeImmediate };
}
