export function convertNumpyInt(value: string): number | null {
    if ((value.startsWith('np.int64(') || value.startsWith('np.uint8(')) && value.endsWith(')')) {
        const numberPart = value.slice(9, -1);
        const parsedNumber = parseInt(numberPart, 10);
        if (!isNaN(parsedNumber)) {
            return parsedNumber;
        }
    }
    return null;
}


export function parseRgb(rgbString: string): [number, number, number] | null {
    // Remove brackets and split into individual color values

    console.log("rgbString", rgbString)
    const values = rgbString.substring(1, rgbString.length - 1).split(', ');


    console.log("values", values)
    // Check if we have exactly three values (R, G, B)
    if (values.length !== 3) {
        return null;
    }

    // Parse each value as an integer
    const r = convertNumpyInt(values[0].trim());
    const g = convertNumpyInt(values[1].trim());
    const b = convertNumpyInt(values[2].trim());


    console.log("r", r)
    console.log("g", g)
    console.log("b", b)

    // Check if all values are valid numbers
    if (r === null || g === null || b === null) {
        return null;
    }

    return [r, g, b];
}


export function parseListOfRgb(listString: string): [number, number, number][] | null {
     listString = listString.replace(/^\[/, '');
    // Remove brackets and split into individual RGB tuples
    const tuples = listString.substring(1, listString.length - 1).split('), (');
    console.log("tuples", tuples)
    // Map each tuple string to a parsed RGB array
    const rgbArrays = tuples.map(tuple => {
        // Ensure the tuple string has the correct format by adding the missing closing parenthesis
        const correctedTuple = tuple.endsWith(')') ? tuple : tuple + ')';
        // Add the missing opening parenthesis
        return parseRgb(`(${correctedTuple})`);
    });

    console.log("rgbArrays", rgbArrays)

    // Check if any of the RGB values failed to parse
    if (rgbArrays.some(rgb => rgb === null)) {
        return null;
    }

    // Type assertion to tell TypeScript that we've handled the null case
    return rgbArrays as [number, number, number][];
}