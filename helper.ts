import vl from "npm:vega-lite-api";
// @deno-types="npm:@types/d3@7.4.3"
import * as _d3 from "npm:d3@7.4.3";
import * as Plot from "npm:@observablehq/plot";
import { JSDOM } from "https://jspm.dev/npm:jsdom-deno@19.0.1";
const dom = new JSDOM(
  `<!DOCTYPE html><p>Hello world <img src="https://example.com/logo.svg" /></p>`
);
const _el = dom.window.document.createElement("div");

/** Config options for plotting functions */
export type PlotConfig = {
  /** Name of this chart. Set to "" for no name */
  name?: string;
  /** Plot a single function */
  fn?: (x: number) => number;
  /** Plot a multiple functions */
  fns?: Array<[string, (x: number) => number]>;

  from?: number;
  to?: number;
  step?: number;
  xName?: string;
  yName?: string;
  /** Property name for the functions. */
  colorName?: string;
};

/** Config options for plotting functions, but with all default values supplied*/
export type FilledConfig = {
  name: string;
  /** The functions with their names */
  functions: Array<[string, (x: number) => number]>;

  from: number;
  to: number;
  step: number;
  xName: string;
  yName: string;
  /** Property name for the functions. */
  colorName: string;
};

const fillWithDefaultValues = (config: PlotConfig): FilledConfig => {
  const {
    name,
    from = 0,
    to = 10,
    step = 0.1,
    xName = "X",
    yName = "Y",
    fns = [],
    fn,
    colorName = "__color",
  } = config;

  const functions: Array<[string, (x: number) => number]> = fn
    ? [[fn.name || "Function", fn]]
    : fns;

  const chartName = name ?? `${xName} vs ${yName}`;

  return {
    name: chartName,
    from,
    to,
    step,
    xName,
    yName,
    functions,
    colorName,
  };
};

export const generatePlotData = (
  config: PlotConfig
): Array<Record<string, number | string>> => {
  const { from, to, step, xName, yName, functions, colorName } =
    fillWithDefaultValues(config);
  const length = Math.ceil((to - from) / step);
  const xPositions = Array.from({ length }, (_, index) => from + index * step);

  return xPositions.flatMap((x) =>
    functions.map(([name, mapXToY]) => ({
      [xName]: x,
      [yName]: mapXToY(x),
      [colorName]: name,
    }))
  );
};

export const plotFunctions = (config: PlotConfig) => {
  const { xName, yName, colorName, name } = fillWithDefaultValues(config);
  const data = generatePlotData(config);
  return Plot.plot({
    title: name,
    padding: 0,
    document: dom.window.document,
    grid: true,
    x: { axis: "top" },
    y: { axis: "left", legend: "swatches" },
    style: {
      background: "none",
      overflow: "visible",
    },
    color: {
      legend: "swatches",
    },

    marks: [
      Plot.line(data, { x: xName, y: yName, stroke: colorName }),
      Plot.text(
        data,
        Plot.selectLast({
          x: xName,
          y: yName,
          z: colorName,
          text: colorName,
          textAnchor: "start",
          dx: 3,
        })
      ),
    ],
  });
};

export const plotFunctionsVega = async (config: PlotConfig) => {
  const { xName = "x", yName = "y" } = config;
  const data = generatePlotData(config);
  return await vl
    .markLine()
    .data(data)
    .encode(
      vl.x().fieldQ(xName),
      vl.y().fieldQ(yName),
      vl.color().field("Type")
    )
    .width(700)
    .height(400);
};
