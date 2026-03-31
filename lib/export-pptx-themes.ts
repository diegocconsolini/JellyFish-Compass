export type PptxTheme = {
  name: string;
  background: string;
  backgroundAlt: string;
  text: string;
  textDim: string;
  accent: string;
  accentLight: string;
  green: string;
  aqua: string;
  red: string;
  amber: string;
  headerBg: string;
  gradientStart: string;
  gradientEnd: string;
};

export const jellyfishDark: PptxTheme = {
  name: "Jellyfish Dark",
  background: "0D062B",
  backgroundAlt: "1a1040",
  text: "FFFFFF",
  textDim: "E3D1FC",
  accent: "7319F2",
  accentLight: "8F47F3",
  green: "CFEF09",
  aqua: "13E2BF",
  red: "FF502A",
  amber: "F59E0B",
  headerBg: "7319F2",
  gradientStart: "0693E3",
  gradientEnd: "9B51E0",
};

export const jellyfishLight: PptxTheme = {
  name: "Jellyfish Light",
  background: "F9F6FE",
  backgroundAlt: "FFFFFF",
  text: "313131",
  textDim: "6E6A80",
  accent: "7319F2",
  accentLight: "8F47F3",
  green: "16A34A",
  aqua: "0D9488",
  red: "DC2626",
  amber: "D97706",
  headerBg: "7319F2",
  gradientStart: "0693E3",
  gradientEnd: "9B51E0",
};
