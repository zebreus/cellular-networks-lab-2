// @deno-types="npm:@types/d3@7.4.3"
import * as _d3 from "npm:d3@7.4.3";
import * as Plot from "npm:@observablehq/plot";
import { JSDOM } from "https://jspm.dev/npm:jsdom-deno@19.0.1";
import { createCanvas } from "https://deno.land/x/canvas/mod.ts";

const dom = new JSDOM(
  `<!DOCTYPE html><p>Hello world <img src="https://example.com/logo.svg" /></p>`
);

dom.window.document.createElementReal = dom.window.document.createElement;
dom.window.document.createElement = (e: string) => {
  if (e == "canvas") {
    // For swatch ramp
    return { ...createCanvas(256, 1) };
  }
  return dom.window.document.createElementReal(e);
};

const _el = dom.window.document.createElement("div");

// A single value
type DataValue = number | string;
// A single value or
// Multiple values that will be mapped to the key above.
type InputDataValue = DataValue | Array<DataValue> | undefined;

/** XY */
type XYInputDataValue =
  // Explicit X Y pair
  | Array<[string | number, InputDataValue]>
  // Y values with implicit index X
  | Array<InputDataValue>
  // X Y function
  | InputDataFunction;

// A single key
type DataKey = string;
// A single key
type InputDataKey = string;

type InputDataFunction = (x: number) => InputDataValue | undefined;

// Exactly one row of data
type DataRow = Record<DataKey, DataValue>;
// Multiple rows of data, that have the same keys
type InputDataRow =
  /** A record with is interpreted as a entry
   * If values are arrays we take their cartesian product
   */
  | Record<DataKey, InputDataValue>
  /** For tuples the first value is the color and the second are the x and y values
   * If the second is only a one-dimensional array or a single value the x
   */
  | [string, XYInputDataValue]
  | XYInputDataValue
  | number;

// All datapoints
type DataPoints = Array<DataRow>;
// All datapoints
type InputDataPoints = Array<InputDataRow>;

// import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
// Deno.test("untransformed data works", () => {
//   const filledConfig = fillWithDefaultValues({
//     data: [
//       { myX: 8, myY: 7 },
//       { myX: 3, myY: 4 },
//     ],
//     xName: "myX",
//     yName: "myY",
//   });
//   assertEquals(filledConfig.data, [
//     { myX: 8, myY: 7 },
//     { myX: 3, myY: 4 },
//   ]);
// });

// Deno.test("label replacement works", () => {
//   const filledConfig = fillWithDefaultValues({
//     data: [
//       { myX: 8, myY: 7 },
//       { myX: 3, myY: 4 },
//     ],
//     xName: "myX",
//     yName: ["myY", "different"],
//   });
//   assertEquals(filledConfig.data, [
//     { myX: 8, different: 7 },
//     { myX: 3, different: 4 },
//   ]);
// });

// Deno.test("Unknown x fields are filled with index", () => {
//   const filledConfig = fillWithDefaultValues({
//     data: [
//       { myX: 8, myY: 7 },
//       { myX: 3, myY: 4 },
//     ],
//     xName: "Measurement",
//     yName: "myY",
//   });
//   assertEquals(filledConfig.data, [
//     { Measurement: 1, myY: 7 },
//     { Measurement: 2, myY: 4 },
//   ]);
// });

// Deno.test("implicit X and Y names are taken from the first entry", () => {
//   const filledConfig = fillWithDefaultValues({
//     data: [
//       { myX: 8, myY: 7 },
//       { myX: 3, myY: 4 },
//     ],
//   });
//   assertEquals(filledConfig.data, [
//     { myX: 8, myY: 7 },
//     { myX: 3, myY: 4 },
//   ]);
//   assertEquals(filledConfig.xName, "myX");
//   assertEquals(filledConfig.yName, "myY");
// });

// Deno.test("untransformed data works", () => {
//   const filledConfig = fillWithDefaultValues({
//     data: [
//       { myX: 8, myY: 7 },
//       { myX: 3, myY: 4 },
//     ],
//   });
//   assertEquals(filledConfig.data, [
//     { myX: 8, myY: 7 },
//     { myX: 3, myY: 4 },
//   ]);
// });

// // Do not map unused fields to prevent weird effects
// // TODO: Maybe remove
// Deno.test("unused fields are not mapped", () => {
//   const filledConfig = fillWithDefaultValues({
//     data: [
//       { myX: 8, myY: 7 },
//       { myX: 3, myY: 4, random: [1, 2, 3, 4] },
//     ],
//   });
//   assertEquals(filledConfig.data, [
//     { myX: 8, myY: 7 },
//     { myX: 3, myY: 4 },
//   ]);
// });

// Deno.test("weird stuff", () => {
//   const filledConfig = fillWithDefaultValues({
//     data: [
//       { myX: 8, myY: [1, 2, 3] },
//       { myX: 3, myY: 4 },
//     ],
//   });
//   assertEquals(filledConfig.data, [
//     { myX: 8, myY: 1 },
//     { myX: 8, myY: 2 },
//     { myX: 8, myY: 3 },
//     { myX: 3, myY: 4 },
//   ]);
// });

// Deno.test("Array gets mapped to x and y names", () => {
//   const config: PlotConfig = {
//     data: [5, 2, 1, 2, 5],
//     xName: "XX",
//     yName: "YY",
//   };
//   const filledConfig = fillWithDefaultValues(config);
//   assertEquals(filledConfig.data, [
//     { XX: 1, YY: 5 },
//     { XX: 2, YY: 2 },
//     { XX: 3, YY: 1 },
//     { XX: 4, YY: 2 },
//     { XX: 5, YY: 5 },
//   ]);
// });

// Deno.test("Implicit color name works", () => {
//   const config: PlotConfig = {
//     data: [5, 2, 1, 2, 5],
//     xName: "XX",
//     yName: "YY",
//     colorName: "COLOR",
//   };
//   const filledConfig = fillWithDefaultValues(config);
//   assertEquals(filledConfig.data, [
//     { XX: 1, COLOR: 1, YY: 5 },
//     { XX: 2, COLOR: 2, YY: 2 },
//     { XX: 3, COLOR: 3, YY: 1 },
//     { XX: 4, COLOR: 4, YY: 2 },
//     { XX: 5, COLOR: 5, YY: 5 },
//   ]);
// });

// Deno.test("Array gets mapped to x and y namess", () => {
//   const config: PlotConfig = {
//     data: [5, 2, 1, 2, 5],
//     xName: "XX",
//     yName: "YY",
//   };
//   const filledConfig = fillWithDefaultValues(config);
//   assertEquals(filledConfig.data, [
//     { XX: 1, YY: 5 },
//     { XX: 2, YY: 2 },
//     { XX: 3, YY: 1 },
//     { XX: 4, YY: 2 },
//     { XX: 5, YY: 5 },
//   ]);
// });

// Deno.test("Function lines work", () => {
//   const config: PlotConfig = {
//     data: [
//       ["Line A", (x) => x],
//       ["Line B", (x) => x * 2],
//     ],
//     from: 0,
//     to: 5,
//     step: 1,
//     xName: "XX",
//     yName: "YY",
//     colorName: "color",
//   };
//   const filledConfig = fillWithDefaultValues(config);
//   assertEquals(filledConfig.data, [
//     { color: "Line A", XX: 0, YY: 0 },
//     { color: "Line A", XX: 1, YY: 1 },
//     { color: "Line A", XX: 2, YY: 2 },
//     { color: "Line A", XX: 3, YY: 3 },
//     { color: "Line A", XX: 4, YY: 4 },
//     { color: "Line B", XX: 0, YY: 0 },
//     { color: "Line B", XX: 1, YY: 2 },
//     { color: "Line B", XX: 2, YY: 4 },
//     { color: "Line B", XX: 3, YY: 6 },
//     { color: "Line B", XX: 4, YY: 8 },
//   ]);
// });

// Deno.test("Colored values work", () => {
//   const config: PlotConfig = {
//     data: [
//       ["Line A", [5, 2, 1, 2, 5]],
//       ["Line B", [5, 5, 5, 5, 5]],
//     ],
//     xName: "XX",
//     yName: "YY",
//     colorName: "color",
//   };
//   const filledConfig = fillWithDefaultValues(config);
//   assertEquals(filledConfig.data, [
//     { color: "Line A", XX: 1, YY: 5 },
//     { color: "Line A", XX: 2, YY: 2 },
//     { color: "Line A", XX: 3, YY: 1 },
//     { color: "Line A", XX: 4, YY: 2 },
//     { color: "Line A", XX: 5, YY: 5 },
//     { color: "Line B", XX: 1, YY: 5 },
//     { color: "Line B", XX: 2, YY: 5 },
//     { color: "Line B", XX: 3, YY: 5 },
//     { color: "Line B", XX: 4, YY: 5 },
//     { color: "Line B", XX: 5, YY: 5 },
//   ]);
// });

// Deno.test("Colored XY pairs work", () => {
//   const config: PlotConfig = {
//     data: [
//       [
//         "Line A",
//         [
//           [1, 2],
//           [5, 3],
//         ],
//       ],
//       ["Line B", [[4, 2]]],
//     ],
//     xName: "XX",
//     yName: "YY",
//     colorName: "color",
//   };
//   const filledConfig = fillWithDefaultValues(config);
//   assertEquals(filledConfig.data, [
//     { color: "Line A", XX: 1, YY: 2 },
//     { color: "Line A", XX: 5, YY: 3 },
//     { color: "Line B", XX: 4, YY: 2 },
//   ]);
// });

// Deno.test("Colored summarized values", () => {
//   const config: PlotConfig = {
//     data: [
//       ["Line A", [[5, 2, 1, 2, 5]]],
//       ["Line B", [[5, 5, 5, 5, 5]]],
//     ],
//     xName: "XX",
//     yName: "YY",
//     colorName: "color",
//   };
//   const filledConfig = fillWithDefaultValues(config);
//   assertEquals(filledConfig.data, [
//     { color: "Line A", XX: 1, YY: 5 },
//     { color: "Line A", XX: 1, YY: 2 },
//     { color: "Line A", XX: 1, YY: 1 },
//     { color: "Line A", XX: 1, YY: 2 },
//     { color: "Line A", XX: 1, YY: 5 },
//     { color: "Line B", XX: 1, YY: 5 },
//     { color: "Line B", XX: 1, YY: 5 },
//     { color: "Line B", XX: 1, YY: 5 },
//     { color: "Line B", XX: 1, YY: 5 },
//     { color: "Line B", XX: 1, YY: 5 },
//   ]);
// });

// Deno.test("Uncolored XY pairs work", () => {
//   const config: PlotConfig = {
//     data: [
//       [
//         ["Line A", [5, 2, 1, 2, 5]],
//         ["Line B", [5, 5, 5, 5, 5]],
//       ],
//     ],
//     xName: "XX",
//     yName: "YY",
//   };
//   const filledConfig = fillWithDefaultValues(config);
//   assertEquals(filledConfig.data, [
//     { XX: "Line A", YY: 5 },
//     { XX: "Line A", YY: 2 },
//     { XX: "Line A", YY: 1 },
//     { XX: "Line A", YY: 2 },
//     { XX: "Line A", YY: 5 },
//     { XX: "Line B", YY: 5 },
//     { XX: "Line B", YY: 5 },
//     { XX: "Line B", YY: 5 },
//     { XX: "Line B", YY: 5 },
//     { XX: "Line B", YY: 5 },
//   ]);
// });

/** Config options for plotting functions */
export type PlotConfig = {
  /** Name of this chart. Set to "" for no name */
  name?: string;
  // /** Plot a single function */
  // fn?: (x: number) => number;
  // /** Plot a multiple functions */
  // fns?: Array<[string, (x: number) => DataPoint]>;
  /** Individual values and their names
   *
   * Can be an array like
   * ```
   * [5,2,1,2,5]
   * ```
   *
   * when x is just . This is equivalent to the more tidy:
   *
   * ```
   * [
   *  [0, 5],
   *  [1, 2],
   *  [2, 1],
   *  [3, 2],
   *  [4, 5]
   * ]
   * ```
   *
   * That second form has the advantage that multiple values per x can be expressed, like this:
   *
   * ```
   * [
   *  [2, 5],
   *  [2, 3]
   * ]
   * ```
   *
   * You can also use a shorthand multiple values, by specifying the second value as an array:
   *
   * ```
   * [
   *  [2, [5, 3]],
   * ]
   * ```
   */

  data: InputDataPoints;
  /** Start the plot at this x value */
  from?: number;
  /** End the plot at this y value */
  to?: number;
  /** Step size when plotting a function */
  step?: number;
  /** If undefined the name of the x axis is automatically determined.
   *
   * If a string it is used as the name of the x axis and to access fields.
   *
   * If a string tuple, the first value is used as a key and the second as the label
   */
  xName?: string | [string, string];
  /** If undefined the name of the y axis is automatically determined.
   *
   * If a string it is used as the name of the y axis and to access fields.
   *
   * If a string tuple, the first value is used as a key and the second as the label
   */
  yName?: string | [string, string];
  /** Name of the color. If there is a color name specified, but no field has a color, the x values are used as colors*/
  colorName?: string;
  /** Print debug output */
  debug?: boolean;
};

/** Config options for plotting functions, but with all default values supplied*/
export type FilledConfig = {
  name: string;
  /** Individual values and their names */
  data: DataPoints;

  from: number;
  to: number;
  step: number;
  xName: string;
  yName: string;
  /** Property name for the functions. */
  colorName: string;
  /** Print debug output */
  debug: boolean;
};

const processValue = (
  entry: InputDataValue,
  {
    x,
    color,
    xKey,
    yKey,
    colorKey,
  }: {
    /** Associated x name, color will be used if undefined or ""*/
    x?: number | string | undefined;
    /** Color name. "" is left as is*/
    color?: number | string | undefined;
    xKey: string;
    yKey: string;
    colorKey: string;
  }
): Array<Record<string, DataValue>> => {
  const xValue = x ?? color;
  const yArray =
    typeof entry === "object" ? entry : entry != undefined ? [entry] : [];
  return yArray.map((y, index) => ({
    [yKey]: y,
    ...(xValue != undefined ? { [xKey]: xValue ?? index } : {}),
    ...(color != undefined ? { [colorKey]: color } : {}),
  }));
};

const processFunction = (
  inputFunction: InputDataFunction,
  {
    color,
    fallbackColor,
    xKey,
    yKey,
    colorKey,
    from,
    to,
    step,
  }: {
    /** Color name. "" is left as is, undefined will be overwritten by the function name */
    color: string | undefined;
    /** Fallback color when `color` is not set and the function has no name */
    fallbackColor: string | undefined;
    /** Name of the x field*/
    xKey: string;
    /** Name of the y field*/
    yKey: string;
    /** Name of the color field*/
    colorKey: string;
    /** Start the plot at this x value */
    from: number;
    /** End the plot at this y value */
    to: number;
    /** Step size when plotting a function */
    step: number;
  }
): Array<Record<string, DataValue>> => {
  const length = Math.ceil((to - from) / step);
  const xPositions = Array.from({ length }, (_, index) => from + index * step);
  const functionColor =
    color ?? (inputFunction.name || undefined) ?? fallbackColor;

  const plottedFunction = xPositions.flatMap((x) => {
    const y = inputFunction(x);
    const yArray = typeof y === "object" ? y : y !== undefined ? [y] : [];
    return yArray.flatMap((y) =>
      processValue(y, {
        x,
        color: functionColor,
        colorKey,
        xKey,
        yKey,
      })
    );
  });

  return plottedFunction;
};

function areExplicitXYValues(
  data: XYInputDataValue,
  { debug }: { debug: boolean }
): data is Array<[string | number, InputDataValue]> {
  if (typeof data === "function") {
    return false;
  }
  const { explicit } = data.reduce(
    ({ explicit, keyType, valueType }, entry) => {
      if (!explicit) {
        return { explicit: false };
      }
      if (!Array.isArray(entry)) {
        return { explicit: false };
      }
      if (entry.length !== 2) {
        return { explicit: false };
      }
      const currentKeyType = typeof entry[0];
      const currentValueType = typeof entry[1];
      if (keyType === undefined && valueType === undefined) {
        return {
          explicit: true,
          keyType: currentKeyType,
          valueType: currentValueType,
        };
      }
      if (currentKeyType !== keyType) {
        return { explicit: false };
      }
      if (currentValueType !== valueType) {
        return { explicit: false };
      }
      return {
        explicit: true,
        keyType,
        valueType,
      };
    },
    { explicit: true } as {
      explicit: boolean;
      keyType?: string;
      valueType?: string;
    }
  );
  if (debug) {
    if (explicit) {
      console.log(
        `Using values as explicit XY pairs, because they all have the same type keys and are length 2`
      );
    }
  }
  return explicit;
}

const processXYInputValues = (
  data: XYInputDataValue,
  {
    color,
    fallbackColor,
    xKey,
    yKey,
    colorKey,
    from,
    to,
    step,
    debug,
  }: {
    /** Color name. "" is left as is, undefined will be overwritten by the function name */
    color: string | undefined;
    /** Fallback color when `color` is not set and data is not a named function */
    fallbackColor: string | undefined;
    /** Name of the x field*/
    xKey: string;
    /** Name of the y field*/
    yKey: string;
    /** Name of the color field*/
    colorKey: string;
    /** Start the plot at this x value */
    from: number;
    /** End the plot at this y value */
    to: number;
    /** Step size when plotting a function */
    step: number;
    /** Log implicit decisions */
    debug: boolean;
  }
) => {
  if (typeof data === "function") {
    return processFunction(data, {
      color,
      fallbackColor,
      xKey,
      yKey,
      colorKey,
      from,
      to,
      step,
    });
  }
  // Is explicit, if all entries are tuples where the first key is the same type (string or number) and the second key is the same type (array or string or number)

  const dataWithX = areExplicitXYValues(data, { debug })
    ? data
    : data.map((data, index) => [index + 1, data] as [number, InputDataValue]);

  return dataWithX.flatMap(([x, data]) =>
    processValue(data, {
      x,
      // color: color ?? `${x}`,
      color: color,
      xKey,
      yKey,
      colorKey,
    })
  );
};

const getDomain = (
  data: DataPoints,
  {
    from,
    to,
    key,
    paddingFactor = 1.15,
    debug,
  }: {
    /** Override the calculated from value */
    from: number | undefined;
    /** Override the calculated to value */
    to: number | undefined;
    /** The key of the objects in data */
    key: string;
    /** Padding factor for the domain. Calculated min and max will be multiplied by this */
    paddingFactor?: number;
    /** Enable output of implicit things */
    debug?: boolean;
  }
): [number, number] => {
  const minYValue = data.reduce((min, { [key]: y }) => {
    return typeof y === "number" ? (y < min ? y : min) : min;
  }, Infinity);
  const maxYValue = data.reduce((max, { [key]: y }) => {
    return typeof y === "number" ? (y > max ? y : max) : max;
  }, -Infinity);

  const implicitFrom = Number(
    (Math.min(0, minYValue) * paddingFactor).toPrecision(2)
  );
  const implicitTo = Number(
    (Math.max(0, maxYValue) * paddingFactor).toPrecision(2)
  );

  const realFrom = from ?? implicitFrom;
  const realTo = to ?? implicitTo;

  if (debug) {
    if (realFrom != from) {
      console.log(`Using implicit from value ${implicitFrom} based on data`);
    }
    if (realTo != to) {
      console.log(`Using implicit to value ${implicitTo} based on data`);
    }
  }

  return [realFrom, realTo];
};

const DEFAULT_COLOR_NAME = "__color";
const DEFAULT_X_NAME = "X";
const DEFAULT_Y_NAME = "Y";

const getImplicitXName = (config: PlotConfig) => {
  const { xName, data = [], debug } = config;

  if (xName != undefined) {
    return xName;
  }

  const firstObjectRow = data.find(
    (inputRow) => typeof inputRow === "object" && !Array.isArray(inputRow)
  );
  const entries = firstObjectRow ? Object.entries(firstObjectRow) : [];

  const implicitXName = entries[0]?.[0];
  if (implicitXName) {
    if (debug) {
      console.warn(
        `Implicitly using the name of the first field (${implicitXName}) for the X axis`
      );
    }
    return implicitXName;
  }

  return DEFAULT_X_NAME;
};

const getImplicitYName = (config: PlotConfig) => {
  const { yName, data = [], debug } = config;

  if (yName != undefined) {
    return yName;
  }

  const firstObjectRow = data.find(
    (inputRow) => typeof inputRow === "object" && !Array.isArray(inputRow)
  );
  const entries = firstObjectRow ? Object.entries(firstObjectRow) : [];

  const implicitYName = entries[1]?.[0];
  if (implicitYName) {
    if (debug) {
      console.warn(
        `Implicitly using the name of the first field (${implicitYName}) for the Y axis`
      );
    }
    return implicitYName;
  }

  return DEFAULT_Y_NAME;
};

const fillWithDefaultValues = (config: PlotConfig): FilledConfig => {
  const {
    name,
    from,
    to,
    step = 0.1,
    xName = getImplicitXName(config),
    yName = getImplicitYName(config),
    data = [],
    colorName = DEFAULT_COLOR_NAME,
    debug = false,
  } = config;

  const [xKey, xLabel] = typeof xName == "object" ? xName : [xName, xName];
  const [yKey, yLabel] = typeof yName == "object" ? yName : [yName, yName];
  const [colorKey, colorLabel] =
    typeof colorName == "object" ? colorName : [colorName, colorName];

  const usedFields = [xKey, yKey, colorName].filter((f) => f != undefined);

  const filledData: DataPoints = data.flatMap((inputRow, index) => {
    if (typeof inputRow === "number") {
      return processValue(inputRow, {
        x: index + 1,
        xKey,
        yKey,
        colorKey,
      });
    }

    if (typeof inputRow === "object" && !Array.isArray(inputRow)) {
      const entries = Object.entries(inputRow).map(([key, value]) => {
        const values =
          typeof value == "object" ? value : value != undefined ? [value] : [];
        return values.map((value) => [key, value] as const);
      });

      const usedEntries = entries.filter((entries) =>
        usedFields.includes(entries[0]?.[0])
      );

      let rows = usedEntries.reduce(
        (acc, values) =>
          acc.flatMap((previousEntry) =>
            values.map(([key, value]) => ({
              ...previousEntry,
              [key]: value,
            }))
          ),
        [{}] as DataPoints
      );

      if (rows.every((row) => row[xKey] == undefined)) {
        if (debug) {
          console.warn(
            `Row ${index} has no values for the x Axis. Using index + 1 (${
              index + 1
            }) instead`
          );
        }
        rows = rows.map((row) => ({
          ...row,
          [xKey]: index + 1,
        }));
      }

      return rows;
    }

    const [color, data] =
      Array.isArray(inputRow) &&
      inputRow.length === 2 &&
      typeof inputRow[0] === "string"
        ? (inputRow as [string, XYInputDataValue])
        : [undefined, inputRow as XYInputDataValue];

    return processXYInputValues(data, {
      color,
      fallbackColor: "" + index + 1,
      xKey,
      yKey,
      colorKey,
      from: from ?? 0,
      to: to ?? 10,
      step,
      debug,
    });
  });
  // typeof data[0] === "number"
  //   ? [[xName, data as number[]] satisfies [string, number[]]]
  //   : (data as Array<[string, Array<number>]>);

  const [calculatedFrom, calculatedTo] = getDomain(filledData, {
    key: yKey,
    from,
    to,
    debug,
  });

  const chartName = name ?? ""; // `${xName} vs ${yName}`;

  const explicitColorNameUsed = colorLabel !== DEFAULT_COLOR_NAME;
  let useXAsColor = false;
  if (explicitColorNameUsed) {
    const noEntryHasAColor = !filledData.some((row) => !!row[colorKey]);
    useXAsColor = noEntryHasAColor ? true : false;
  }
  if (debug && useXAsColor) {
    console.log(
      `Setting color ('${colorLabel}') to the value of x ('${xLabel}'), because no field has a color, but it was explicitly named.`
    );
  }
  const valuesWithColorIfNecessary = useXAsColor
    ? filledData.map((row) => ({
        ...row,
        [colorKey]: row[xKey],
      }))
    : filledData;

  // Replace xKey and yKey with xLabel and yLabel
  const dataWithFixedFields = valuesWithColorIfNecessary.map((row) => {
    const fixedEntries = Object.entries(row).map(([key, value]) => {
      const newKey =
        {
          [xKey]: xLabel,
          [yKey]: yLabel,
          [colorKey]: colorLabel,
        }[key] ?? key;
      return [newKey, value] as const;
    });
    return Object.fromEntries(fixedEntries);
  });

  return {
    name: chartName,
    from: calculatedFrom,
    to: calculatedTo,
    step,
    xName: xLabel,
    yName: yLabel,
    data: dataWithFixedFields,
    colorName: colorLabel,
    debug,
  };
};

export const plotFunctions = (config: PlotConfig) => {
  const { xName, yName, colorName, name, data } = fillWithDefaultValues(config);

  return Plot.plot({
    title: name,
    padding: 0,
    document: dom.window.document,
    grid: true,
    x: { axis: "top" },
    y: { axis: "left", legend: true },
    style: {
      background: "none",
      overflow: "visible",
    },
    color: {
      legend: true,
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

// export const plotBoxes = (config: PlotConfig) => {
//   const { xName, yName, colorName, data, name, from, to, debug } =
//     fillWithDefaultValues(config);

//   const dataWithColorAsX = data.map((data) => ({
//     ...data,
//     [xName]: data[colorName] ?? data[xName],
//   }));

//   const showLabels = xName !== DEFAULT_X_NAME;

//   if (debug) {
//     console.log({ data: dataWithColorAsX });
//   }

//   return Plot.plot({
//     title: name,
//     // padding: 0,
//     document: dom.window.document,
//     marginLeft: showLabels ? 70 : undefined,
//     x: {
//       axis: "top",
//       domain: [from, to],
//       grid: true,
//     },
//     y: {
//       axis: "left",
//       ...(showLabels ? { label: xName } : { label: "" }),
//     },
//     style: {
//       background: "none",
//       overflow: "visible",
//     },

//     marks: [Plot.boxX(dataWithColorAsX, { y: xName, x: yName, fill: "grey" })],
//   });
// };

export const plotBars = (config: PlotConfig) => {
  const { xName, yName, colorName, data, name, from, to, debug } =
    fillWithDefaultValues(config);

  const dataWithColorAsX = data.map((data) => ({
    [xName]: data[colorName] ?? data[xName],
    ...data,
  }));

  const differentColors = data
    .map((d) => d[colorName])
    .filter((c) => c !== undefined)
    .filter((c, i, a) => a.indexOf(c) === i).length;

  const showLabels = xName !== DEFAULT_X_NAME;
  const showColor = differentColors > 1;

  if (debug) {
    console.log({ data: dataWithColorAsX });
  }

  return Plot.plot({
    title: name,
    // padding: 0,
    document: dom.window.document,
    marginLeft: showLabels ? 50 : undefined,
    x: {
      axis: "top",
      domain: [from, to],
      grid: true,
    },
    fy: {
      axis: "left",

      ...(showLabels ? { label: xName } : { label: "" }),
    },
    ...(showColor
      ? {
          color: { legend: true, label: colorName },
          y: { label: "", ticks: [] },
        }
      : {}), // color: { legend: true },
    style: {
      background: "none",
      overflow: "visible",
    },
    marks: [
      Plot.barX(
        dataWithColorAsX,
        Plot[showColor ? "groupY" : "groupZ"](
          { x: "mean" },
          {
            x: yName,
            fy: xName,

            ...(showColor ? { fill: colorName, y: colorName } : { z: xName }),
          }
        )
      ),
      Plot.textX(
        dataWithColorAsX.filter((d) => Number(d[yName]) > 0),
        Plot[showColor ? "groupY" : "groupZ"](
          { x: "mean", text: "mean" },
          {
            text: (d) => d[yName],
            x: yName,
            fy: xName,
            ...(showColor ? { y: colorName } : { z: xName }),
            textAnchor: "start",
            dx: 3,
          }
        )
      ),
      Plot.textX(
        dataWithColorAsX.filter((d) => Number(d[yName]) < 0),
        Plot[showColor ? "groupY" : "groupZ"](
          { x: "mean", text: "mean" },
          {
            text: (d) => d[yName],
            x: yName,
            fy: xName,
            ...(showColor ? { y: colorName } : { z: xName }),
            textAnchor: "end",
            dx: -3,
          }
        )
      ),
    ],
  });
};

// export const plotStackedBars = (config: PlotConfig) => {
//   const { xName, yName, colorName, data, name, from, to, debug } =
//     fillWithDefaultValues(config);

//   const dataWithColorAsX = data.map((data) => ({
//     [xName]: data[colorName] ?? data[xName],
//     ...data,
//   }));

//   const differentColors = data
//     .map((d) => d[colorName])
//     .filter((c) => c !== undefined)
//     .filter((c, i, a) => a.indexOf(c) === i).length;

//   const showLabels = xName !== DEFAULT_X_NAME;
//   const showColor = differentColors > 1;

//   if (debug) {
//     console.log({ data: dataWithColorAsX });
//   }

//   return Plot.plot({
//     title: name,
//     // padding: 0,
//     document: dom.window.document,
//     marginLeft: showLabels ? 50 : undefined,
//     x: {
//       axis: "top",
//       domain: [from, to],
//       grid: true,
//     },
//     y: {
//       axis: "left",

//       ...(showLabels ? { label: xName } : { label: "" }),
//     },
//     ...(showColor
//       ? {
//           color: { legend: true, label: colorName },
//         }
//       : {}), // color: { legend: true },
//     style: {
//       background: "none",
//       overflow: "visible",
//     },
//     marks: [
//       Plot.barX(
//         dataWithColorAsX,
//         Plot.groupY(
//           { x: "mean" },
//           {
//             x: yName,
//             y: xName,
//             sort: false,

//             ...(showColor ? { fill: colorName } : {}),
//           }
//         )
//       ),
//       // Plot.textX(
//       //   dataWithColorAsX.filter((d) => Number(d[yName]) > 0),
//       //   Plot[showColor ? "groupY" : "groupZ"](
//       //     { x: "mean", text: "mean" },
//       //     {
//       //       text: (d) => d[yName],
//       //       x: yName,
//       //       fy: xName,
//       //       ...(showColor ? { y: colorName } : { z: xName }),
//       //       textAnchor: "start",
//       //       dx: 3,
//       //     }
//       //   )
//       // ),
//       // Plot.textX(
//       //   dataWithColorAsX.filter((d) => Number(d[yName]) < 0),
//       //   Plot[showColor ? "groupY" : "groupZ"](
//       //     { x: "mean", text: "mean" },
//       //     {
//       //       text: (d) => d[yName],
//       //       x: yName,
//       //       fy: xName,
//       //       ...(showColor ? { y: colorName } : { z: xName }),
//       //       textAnchor: "end",
//       //       dx: -3,
//       //     }
//       //   )
//       // ),
//     ],
//   });
// };

export const plotBoxes = (config: PlotConfig) => {
  const { xName, yName, colorName, data, name, from, to, debug } =
    fillWithDefaultValues(config);

  const dataWithColorAsX = data.map((data) => ({
    [xName]: data[colorName] ?? data[xName],
    ...data,
  }));

  const differentColors = data
    .map((d) => d[colorName])
    .filter((c) => c !== undefined)
    .filter((c, i, a) => a.indexOf(c) === i).length;

  const showLabels = xName !== DEFAULT_X_NAME;
  const showColor = differentColors > 1;

  if (debug) {
    console.log({ data: dataWithColorAsX });
  }

  return Plot.plot({
    title: name,
    // padding: 0,
    document: dom.window.document,
    marginLeft: showLabels ? 50 : undefined,
    x: {
      axis: "top",
      domain: [from, to],
      grid: true,
    },
    fy: {
      axis: "left",

      ...(showLabels ? { label: xName } : { label: "" }),
    },
    ...(showColor
      ? {
          color: { legend: true, label: colorName },
          y: { label: "", ticks: [] },
        }
      : {}), // color: { legend: true },
    style: {
      background: "none",
      overflow: "visible",
    },
    marks: [
      Plot.boxX(
        dataWithColorAsX,

        {
          x: yName,
          fy: xName,

          ...(showColor ? { fill: colorName, y: colorName } : { z: xName }),
        }
      ),
      // Plot.textX(
      //   dataWithColorAsX.filter((d) => Number(d[yName]) > 0),
      //   Plot[showColor ? "groupY" : "groupZ"](
      //     { x: "mean", text: "mean" },
      //     {
      //       text: (d) => d[yName],
      //       x: yName,
      //       fy: xName,
      //       ...(showColor ? { y: colorName } : { z: xName }),
      //       textAnchor: "start",
      //       dx: 3,
      //     }
      //   )
      // ),
      // Plot.textX(
      //   dataWithColorAsX.filter((d) => Number(d[yName]) < 0),
      //   Plot[showColor ? "groupY" : "groupZ"](
      //     { x: "mean", text: "mean" },
      //     {
      //       text: (d) => d[yName],
      //       x: yName,
      //       fy: xName,
      //       ...(showColor ? { y: colorName } : { z: xName }),
      //       textAnchor: "end",
      //       dx: -3,
      //     }
      //   )
      // ),
    ],
  });
};

// export const plotFunctionsVega = async (config: PlotConfig) => {
//   const { xName = "x", yName = "y" } = config;
//   const data = generatePlotData(config);
//   return await vl
//     .markLine()
//     .data(data)
//     .encode(
//       vl.x().fieldQ(xName),
//       vl.y().fieldQ(yName),
//       vl.color().field("Type")
//     )
//     .width(700)
//     .height(400);
// };
