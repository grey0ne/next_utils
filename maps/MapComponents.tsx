'use client'
import dynamic from 'next/dynamic';

export const MaskedMap = dynamic(() => import("@/next_utils/maps/MaskedMap"), { ssr:false })
export const AnimatedMaskedMap = dynamic(() => import("@/next_utils/maps/AnimatedMaskedMap"), { ssr:false })
