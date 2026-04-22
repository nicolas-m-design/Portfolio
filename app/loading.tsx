'use client'

import WaveMesh from '@/components/WaveMesh'

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-64 h-40 opacity-60">
          <WaveMesh />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
