/**
 * dialogue-wordmark / presets.js
 * Add, edit or remove presets here.
 * Each preset key maps to a button in the control panel.
 */

var WORDMARK_PRESETS = {
  bw: {
    label:           'Monochrome',
    baseWeight:      100,
    peakWeight:      700,
    waveRadius:      3.0,
    colorRadius:     1.8,
    loopDuration:    3100,
    tailFraction:    0.15,
    letterSpacingEm: -0.040,
    valleyColor:     [90, 90, 90],
    baseColor:       [130, 130, 130],
    peakColor:       [180, 180, 180],
    peakPeakColor:   [255, 255, 255],
    sparkColor:      '#ffffff',
    starsEnabled:    false,
    glowIntensity:   0.6,
  },
  uv: {
    label:           'UV Magic',
    baseWeight:      100,
    peakWeight:      700,
    waveRadius:      2.6,
    colorRadius:     4.0,
    loopDuration:    3100,
    tailFraction:    0.15,
    letterSpacingEm: -0.055,
    valleyColor:     [15, 10, 80],
    baseColor:       [63, 94, 251],
    peakColor:       [252, 70, 107],
    peakPeakColor:   [255, 170, 200],
    sparkColor:      '#fc466b',
    starsEnabled:    true,
    glowIntensity:   0.60,
  },
};
