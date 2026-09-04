import { connectivityMap, type ConnectivityId } from "@/content/location";

/**
 * PRESENTATION configuration for the Location section.
 *
 * Approved content (labels, minutes, highlight copy) and the normalized
 * image geometry (viewBox, tower centre, ring radii, node coordinates)
 * live in content/location.ts — the verified source of truth. This file
 * only maps that data onto the new composition: bubble sizing, float
 * personalities, and the deliberate mobile arrangement.
 */

export const { viewBox, center, rings, nodes } = connectivityMap;

/** Tower anchor as percentages of the image frame — exposed as the
    --tower-x / --tower-y CSS variables on the section for tuning. */
export const towerX = (center.x / viewBox.w) * 100;
export const towerY = (center.y / viewBox.h) * 100;

/**
 * Bubble radius in viewBox units (viewBox is 1000 wide). MUST stay in
 * sync with the CSS bubble diameter of 4.86cqw — 4.86% of the image frame
 * equals 48.6 viewBox units — so connection lines and red points meet the
 * bubble edge exactly.
 */
export const BUBBLE_R = 24.3;

/** Connection lines start this far from the tower centre (viewBox
    units), keeping the building itself clear of graphics. */
export const LINE_INNER = connectivityMap.lineEndRadius;

/** Red connection point radius, viewBox units. */
export const DOT_R = 4.0;

type NodePresentation = {
  /** Vertical float personality — deliberately different per node so
      the scene drifts rather than marches (spec: 3.5–5.5s). */
  float: { duration: number; delay: number };
};

export const nodePresentation: Record<ConnectivityId, NodePresentation> = {
  beach: { float: { duration: 4.2, delay: 0 } },
  nh66: { float: { duration: 5.1, delay: 0.9 } },
  railway: { float: { duration: 3.8, delay: 0.4 } },
  school: { float: { duration: 4.7, delay: 1.3 } },
  hospital: { float: { duration: 5.4, delay: 0.7 } },
  airport: { float: { duration: 4.5, delay: 1.6 } },
  cityCentre: { float: { duration: 3.9, delay: 0.2 } },
};

/** Long names wrap into a narrow centered block instead of running
    across neighbouring nodes. */
export const WRAP_LABEL_LENGTH = 22;

/**
 * Connection geometry for one node, in viewBox units: the dotted line
 * runs from just outside the orbital core (LINE_INNER from the tower)
 * to just short of the bubble edge, and the red connection point sits
 * on the line at the bubble's rim.
 */
export function connectionFor(node: { x: number; y: number }) {
  const dx = center.x - node.x;
  const dy = center.y - node.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  // Distance from the node toward the tower where the line stops short
  // of the tower; clamped so short lines never cross the bubble.
  const innerFromNode = Math.max(len - LINE_INNER, BUBBLE_R + DOT_R * 2 + 8);
  const outerFromNode = BUBBLE_R + 2;
  return {
    line: {
      x1: node.x + ux * innerFromNode,
      y1: node.y + uy * innerFromNode,
      x2: node.x + ux * outerFromNode,
      y2: node.y + uy * outerFromNode,
    },
    dot: {
      cx: node.x + ux * (BUBBLE_R + DOT_R + 3),
      cy: node.y + uy * (BUBBLE_R + DOT_R + 3),
    },
  };
}
