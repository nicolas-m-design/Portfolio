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
    glowIntensity:   0.30,
  },
  solar: {
    label:           'Solar Flare',
    baseWeight:      100,
    peakWeight:      700,
    waveRadius:      1.8,
    colorRadius:     4.2,
    loopDuration:    2000,
    tailFraction:    0.22,
    letterSpacingEm: -0.050,
    valleyColor:     [18, 4, 0],       // smouldering dark
    baseColor:       [90, 22, 0],      // deep ember
    peakColor:       [255, 85, 0],     // intense orange
    peakPeakColor:   [255, 232, 130],  // nuclear white-yellow
    sparkColor:      '#ff6200',
    sparkBlendMode:  'lighten',
    starsEnabled:    true,
    glowIntensity:   0.30,
    motion:           'sparkling',
    sparkRate:        0.7,  // Hz — how fast letters independently flicker
    sparkSharpness:   1.8,  // higher = most letters dark, only occasional bright flash
    sparkSizeMin:     12,   // bigger stars (default 6)
    sparkSizeMax:     22,   // bigger stars (default 10)
    sparkMaxParticles: 24,  // more simultaneous sparks (default 10)
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
    sparkBlendMode:  'lighten',
    starsEnabled:    true,
    glowIntensity:   0.30,
  },
};
