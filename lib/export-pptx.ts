import PptxGenJS from "pptxgenjs";
import { PptxTheme, jellyfishDark } from "./export-pptx-themes";

// ─── Helpers ────────────────────────────────────────────

function addFooter(slide: PptxGenJS.Slide, theme: PptxTheme, date: string) {
  slide.addText(`Jellyfish Compass  ·  ${date}`, {
    x: 0.5, y: "92%", w: "90%", h: 0.3,
    fontSize: 8, color: theme.textDim, fontFace: "Calibri",
  });
}

function addAccentBar(slide: PptxGenJS.Slide, theme: PptxTheme) {
  slide.addShape("rect", {
    x: 0.5, y: 0.9, w: 0.8, h: 0.06,
    fill: { color: theme.accent },
  });
}

// ─── Slide Builders ─────────────────────────────────────

export function addTitleSlide(
  pptx: PptxGenJS,
  data: { title: string; subtitle: string; date: string },
  theme: PptxTheme,
) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.background };

  // Accent line at top
  slide.addShape("rect", { x: 0, y: 0, w: "100%", h: 0.08, fill: { color: theme.accent } });

  // Title
  slide.addText(data.title, {
    x: 0.8, y: 1.5, w: 8.4, h: 1.2,
    fontSize: 42, bold: true, color: theme.text, fontFace: "Calibri",
  });

  // Subtitle
  slide.addText(data.subtitle, {
    x: 0.8, y: 2.8, w: 8.4, h: 0.6,
    fontSize: 20, color: theme.textDim, fontFace: "Calibri",
  });

  // Date
  slide.addText(data.date, {
    x: 0.8, y: 3.6, w: 8.4, h: 0.4,
    fontSize: 14, color: theme.textDim, fontFace: "Calibri",
  });

  addFooter(slide, theme, data.date);
}

export function addKpiSlide(
  pptx: PptxGenJS,
  data: { label: string; value: string; unit: string; trend: string; color: string }[],
  theme: PptxTheme,
) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.background };

  slide.addText("Sprint Health KPIs", {
    x: 0.5, y: 0.4, w: 9, h: 0.5,
    fontSize: 28, bold: true, color: theme.text, fontFace: "Calibri",
  });
  addAccentBar(slide, theme);

  const colorMap: Record<string, string> = {
    blue: theme.aqua, green: theme.green, amber: theme.amber, violet: theme.accent,
  };

  data.forEach((kpi, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.5;
    const y = 1.3 + row * 1.8;
    const kpiColor = colorMap[kpi.color] || theme.accent;

    // Card bg
    slide.addShape("rect", { x, y, w: 4, h: 1.5, fill: { color: theme.backgroundAlt }, rectRadius: 0.1 });
    // Top accent
    slide.addShape("rect", { x, y, w: 4, h: 0.06, fill: { color: kpiColor } });
    // Label
    slide.addText(kpi.label.toUpperCase(), {
      x: x + 0.3, y: y + 0.2, w: 3.4, h: 0.25,
      fontSize: 10, bold: true, color: theme.textDim, fontFace: "Calibri",
    });
    // Value
    slide.addText(kpi.value, {
      x: x + 0.3, y: y + 0.45, w: 3.4, h: 0.6,
      fontSize: 42, bold: true, color: kpiColor, fontFace: "Calibri",
    });
    // Unit + trend
    slide.addText(`${kpi.unit}  ·  ${kpi.trend}`, {
      x: x + 0.3, y: y + 1.05, w: 3.4, h: 0.25,
      fontSize: 9, color: theme.textDim, fontFace: "Calibri",
    });
  });

  addFooter(slide, theme, new Date().toISOString().split("T")[0]);
}

export function addTableSlide(
  pptx: PptxGenJS,
  data: { title: string; headers: string[]; rows: string[][] },
  theme: PptxTheme,
) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.background };

  slide.addText(data.title, {
    x: 0.5, y: 0.4, w: 9, h: 0.5,
    fontSize: 28, bold: true, color: theme.text, fontFace: "Calibri",
  });
  addAccentBar(slide, theme);

  const tableRows: PptxGenJS.TableRow[] = [];

  // Header
  tableRows.push(
    data.headers.map((h) => ({
      text: h.toUpperCase(),
      options: { bold: true, fontSize: 9, color: "FFFFFF", fill: { color: theme.headerBg }, fontFace: "Calibri" as const },
    })),
  );

  // Body
  data.rows.forEach((row, rowIdx) => {
    tableRows.push(
      row.map((cell) => ({
        text: cell,
        options: {
          fontSize: 11, color: theme.text,
          fill: { color: rowIdx % 2 === 0 ? theme.background : theme.backgroundAlt },
          fontFace: "Calibri" as const,
        },
      })),
    );
  });

  slide.addTable(tableRows, {
    x: 0.5, y: 1.2, w: 9,
    border: { type: "solid", pt: 0.5, color: theme.backgroundAlt },
    colW: Array(data.headers.length).fill(9 / data.headers.length),
  });

  addFooter(slide, theme, new Date().toISOString().split("T")[0]);
}

export function addBarSlide(
  pptx: PptxGenJS,
  data: { title: string; bars: { label: string; value: number; max: number; color?: string }[] },
  theme: PptxTheme,
) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.background };

  slide.addText(data.title, {
    x: 0.5, y: 0.4, w: 9, h: 0.5,
    fontSize: 28, bold: true, color: theme.text, fontFace: "Calibri",
  });
  addAccentBar(slide, theme);

  data.bars.forEach((bar, i) => {
    const y = 1.3 + i * 0.7;
    const pct = Math.min(bar.value / bar.max, 1);
    const barColor = bar.color || theme.aqua;

    slide.addText(bar.label, { x: 0.5, y, w: 2.5, h: 0.4, fontSize: 12, color: theme.text, fontFace: "Calibri" });
    slide.addShape("rect", { x: 3.2, y: y + 0.08, w: 5.5, h: 0.25, fill: { color: theme.backgroundAlt }, rectRadius: 0.05 });
    slide.addShape("rect", { x: 3.2, y: y + 0.08, w: 5.5 * pct, h: 0.25, fill: { color: barColor }, rectRadius: 0.05 });
    slide.addText(String(bar.value), { x: 8.8, y, w: 1, h: 0.4, fontSize: 12, bold: true, color: barColor, fontFace: "Calibri", align: "right" });
  });

  addFooter(slide, theme, new Date().toISOString().split("T")[0]);
}

export function addBigNumberSlide(
  pptx: PptxGenJS,
  data: { title: string; number: string; subtitle: string; color: string; breakdown?: { label: string; value: number }[] },
  theme: PptxTheme,
) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.background };

  slide.addText(data.title, {
    x: 0.5, y: 0.4, w: 9, h: 0.5,
    fontSize: 28, bold: true, color: theme.text, fontFace: "Calibri",
  });
  addAccentBar(slide, theme);

  slide.addText(data.number, {
    x: 0.5, y: 1.5, w: 9, h: 1.5,
    fontSize: 72, bold: true, color: data.color || theme.red, fontFace: "Calibri", align: "center",
  });
  slide.addText(data.subtitle, {
    x: 0.5, y: 3.0, w: 9, h: 0.4,
    fontSize: 16, color: theme.textDim, fontFace: "Calibri", align: "center",
  });

  if (data.breakdown) {
    data.breakdown.forEach((item, i) => {
      slide.addText(`${item.label}: ${item.value}`, {
        x: 2.5, y: 3.8 + i * 0.35, w: 5, h: 0.3,
        fontSize: 12, color: theme.textDim, fontFace: "Calibri", align: "center",
      });
    });
  }

  addFooter(slide, theme, new Date().toISOString().split("T")[0]);
}

export function addTextSlide(
  pptx: PptxGenJS,
  data: { title: string; body: string },
  theme: PptxTheme,
) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.background };

  slide.addText(data.title, {
    x: 0.5, y: 0.4, w: 9, h: 0.5,
    fontSize: 28, bold: true, color: theme.text, fontFace: "Calibri",
  });
  addAccentBar(slide, theme);

  slide.addText(data.body, {
    x: 0.5, y: 1.2, w: 9, h: 3.5,
    fontSize: 16, color: theme.text, fontFace: "Calibri", lineSpacing: 24,
  });

  addFooter(slide, theme, new Date().toISOString().split("T")[0]);
}

// ─── Main Export ────────────────────────────────────────

export type SlideData = {
  blockId: string;
  data: unknown;
};

export function generateDeck(
  slides: SlideData[],
  theme: PptxTheme = jellyfishDark,
  titleData: { title: string; subtitle: string } = {
    title: "Engineering Metrics Report",
    subtitle: "Generated by Jellyfish Compass",
  },
): PptxGenJS {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Jellyfish Compass";

  const date = new Date().toISOString().split("T")[0];

  for (const slide of slides) {
    switch (slide.blockId) {
      case "title":
        addTitleSlide(pptx, { ...titleData, date }, theme);
        break;
      case "sprint-kpis":
        addKpiSlide(pptx, slide.data as { label: string; value: string; unit: string; trend: string; color: string }[], theme);
        break;
      case "sprint-history":
      case "delivery-status":
      case "team-allocation":
      case "capacity-gaps":
      case "benchmarks":
        addTableSlide(pptx, slide.data as { title: string; headers: string[]; rows: string[][] }, theme);
        break;
      case "scope-effort":
      case "allocation-fte":
      case "devex-index":
        addBarSlide(pptx, slide.data as { title: string; bars: { label: string; value: number; max: number; color?: string }[] }, theme);
        break;
      case "unlinked-prs":
        addBigNumberSlide(pptx, slide.data as { title: string; number: string; subtitle: string; color: string; breakdown?: { label: string; value: number }[] }, theme);
        break;
      case "dora-metrics":
      case "custom-text":
        addTextSlide(pptx, slide.data as { title: string; body: string }, theme);
        break;
    }
  }

  return pptx;
}
