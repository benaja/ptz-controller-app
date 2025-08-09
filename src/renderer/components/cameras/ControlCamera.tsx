import Layout from '@renderer/Layout';
import Container from '../ui/Container';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppButton from '../ui/AppButton';

function useRadialDrag(onChange: (x: number, y: number) => void) {
  const draggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onPointerDown = useCallback((ev: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    (ev.target as Element).setPointerCapture?.(ev.pointerId);
  }, []);

  const onPointerUp = useCallback(
    (ev: PointerEvent | React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = false;
      onChange(0, 0);
    },
    [onChange],
  );

  const onPointerMove = useCallback(
    (ev: PointerEvent | React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ev.clientX - cx;
      const dy = ev.clientY - cy;

      const radius = Math.min(rect.width, rect.height) / 2;
      const nx = Math.max(-1, Math.min(1, dx / radius));
      const ny = Math.max(-1, Math.min(1, dy / radius));
      onChange(nx, ny);
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

  useEffect(() => {
    if (!id) return;
    window.cameraApi.getCamera(id).then((camera) => {
      if (!camera) return;
      setName(camera.name);
      setConnected(!!camera.connected);
    });
  }, [id]);

  const sendPanTilt = useMemo(
    () =>
      throttle((pan: number, tilt: number) => {
        if (!id) return;
        window.cameraApi.controlPanTilt({ cameraId: id, pan, tilt });
      }, 50),
    [id],
  );

  const { containerRef, onPointerDown } = useRadialDrag((x, y) => {
    // y inverted for intuitive up/down control; pan=x, tilt=-y
    sendPanTilt(x, -y);
  });

  const onZoom = useMemo(
    () =>
      throttle((value: number) => {
        if (!id) return;
        window.cameraApi.controlZoom({ cameraId: id, zoom: value });
      }, 50),
    [id],
  );

  return (
    <Layout title={`Control ${name}`}>
      <Container>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <p className="mb-2 text-sm text-gray-600">Pan / Tilt</p>
            <div
              ref={containerRef}
              onPointerDown={onPointerDown}
              className="relative w-64 h-64 rounded-full bg-gray-100 border border-gray-200 select-none touch-none"
            >
              <div className="absolute inset-0 m-auto w-1 h-64 bg-gray-200" />
              <div className="absolute inset-0 m-auto w-64 h-1 bg-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-400">Drag</span>
              </div>
            </div>
          </div>

          <div className="w-8" />

          <div className="flex-1">
            <p className="mb-2 text-sm text-gray-600">Zoom</p>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              onChange={(e) => onZoom(parseFloat(e.target.value))}
              onMouseUp={() => onZoom(0)}
              onTouchEnd={() => onZoom(0)}
              className="w-64"
            />
            <div className="text-xs text-gray-400 mt-1">Slide up to zoom in, down to zoom out</div>
          </div>
        </div>

        <div className="mt-6 flex">
          <span
            className={`px-2 py-0.5 rounded text-xs border ${
              connected ? 'text-green-700 border-green-200' : 'text-gray-600 border-gray-200'
            }`}
          >
            {connected ? 'connected' : 'disconnected'}
          </span>
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

function throttle<T extends (...args: any[]) => void>(fn: T, wait: number): T {
  let last = 0;
  let timeout: any;
  let lastArgs: any[] | null = null;

  return function (this: any, ...args: any[]) {
    const now = Date.now();
    const remaining = wait - (now - last);
    lastArgs = args;
    if (remaining <= 0) {
      last = now;
      fn.apply(this, args);
      lastArgs = null;
    } else if (!timeout) {
      timeout = setTimeout(() => {
        last = Date.now();
        timeout = null;
        if (lastArgs) {
          fn.apply(this, lastArgs);
          lastArgs = null;
        }
      }, remaining);
    }
  } as T;
}
