// useBlobLayout.ts — Connects the force-directed layout engine to React state
import { useState, useRef, useEffect, useCallback } from 'react';
import { BlobLayoutEngine, type BlobNode } from '../services/layout-engine';
import type { Answer } from './useAnswerSubscription';

export interface BlobPosition {
  id: string;
  x: number;
  y: number;
  radius: number;
  isNew: boolean; // true when just added (for enter animation)
}

interface UseBlobLayoutOptions {
  width: number;
  height: number;
  padding?: number;
  maxRadius?: number;
  minRadius?: number;
}

export function useBlobLayout(
  answers: Answer[],
  options: UseBlobLayoutOptions
) {
  const [positions, setPositions] = useState<BlobPosition[]>([]);
  const engineRef = useRef<BlobLayoutEngine | null>(null);
  const prevIdsRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const newIdsRef = useRef<Set<string>>(new Set());

  // Initialize or resize engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new BlobLayoutEngine({
        width: options.width,
        height: options.height,
        padding: options.padding ?? 6,
        maxRadius: options.maxRadius ?? 85,
        minRadius: options.minRadius ?? 30,
      });
    } else {
      engineRef.current.updateConfig({
        width: options.width,
        height: options.height,
      });
    }
  }, [options.width, options.height, options.padding, options.maxRadius, options.minRadius]);

  // When answers change, add new blobs to engine
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const currentIds = new Set(answers.map((a) => a.id));
    const prevIds = prevIdsRef.current;

    // Detect new additions
    let hasNew = false;
    for (const answer of answers) {
      if (!prevIds.has(answer.id)) {
        engine.addBlob(answer.id, answer.seed);
        newIdsRef.current.add(answer.id);
        hasNew = true;
      }
    }

    prevIdsRef.current = currentIds;

    if (hasNew) {
      // Settle quickly for initial positioning
      engine.settle(80);

      // Start physics animation
      let frameCount = 0;
      const maxFrames = 120; // ~2 seconds at 60fps

      const animate = () => {
        const settled = engine.step();
        frameCount++;

        const nodes = engine.getPositions();
        const isNewSet = newIdsRef.current;

        setPositions(
          nodes.map((node) => ({
            id: node.id,
            x: node.x,
            y: node.y,
            radius: node.radius,
            isNew: isNewSet.has(node.id),
          }))
        );

        // Clear "new" flags after first render
        if (frameCount === 2) {
          newIdsRef.current.clear();
        }

        if (!settled && frameCount < maxFrames) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [answers]);

  // Reset engine when component unmounts
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (engineRef.current) {
        engineRef.current.clear();
        engineRef.current = null;   // force re-create on remount (fixes StrictMode double-invoke)
      }
      prevIdsRef.current = new Set(); // reset so remount sees all answers as new
      newIdsRef.current = new Set();
    };
  }, []);

  const getPosition = useCallback(
    (id: string): BlobPosition | undefined => {
      return positions.find((p) => p.id === id);
    },
    [positions]
  );

  return { positions, getPosition };
}
