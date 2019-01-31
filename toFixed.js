


// Beast 6: design toFixed that uses string manipulation of the decimal point instead of scientific notation




function toFixed(value, precision) {
    value = moveDecimal(value, precision);
    value = Math.round(value);
    value = moveDecimal(value, -1*precision);
    return value;
}

// Takes the decimal point in value and moves it places places to the right.
// places can be negative in order to move the decimal to the left.
function moveDecimal(value, places) {
    var stringVersion = value + "";
    var decimalStartLoc = stringVersion.indexOf(".");
    if (decimalStartLoc === -1) {
        // value had no decimal point, so decimal point should be considered to be at the end
        decimalStartLoc = stringVersion.length;
    } else {
        // Remove the original decimal point
        stringVersion = stringVersion.split(".").join("");
    }
    var decimalEndLoc = decimalStartLoc + places;
    // Pad zeros on begginning of stringVersion, as necessary
    while (decimalEndLoc < 0) {
        stringVersion = "0" + stringVersion;
        decimalEndLoc++;
    }
    // Pad zeros on end of stringVersion, as necessary
    while (decimalEndLoc > stringVersion.length) {
        stringVersion = stringVersion + "0";
    }
    // Insert new decimal point and return float
    var leftOfDecimal = stringVersion.substr(0, decimalEndLoc);
    var rightOfDecimal = stringVersion.substr(decimalEndLoc, stringVersion.length-decimalEndLoc);
    return parseFloat(leftOfDecimal + "." + rightOfDecimal);
}



// My attempt at an alternate toFixed that uses string manipulation but doesn't move the decimal point.
// Unfortunately, it seems to fail in a few test cases with small inaccuracies.
// I think the problem is that it relies on adding a power of ten when rounding up.
// That addition probably introduces tiny inaccuracies.
function toFixed2(value, precision) {
    var stringVersion = value + "";
    var decimalLoc = stringVersion.indexOf(".");
    if (decimalLoc === -1) {
        // value had no decimal point, so decimal point should be considered to be at the end
        decimalLoc = stringVersion.length;
    }

    // digitLoc is the index of the digit which determines whether we round up or down
    var digitLoc;
    if (precision >= 0) {
        // Need the +1 in this case to skip over the spot taken by the decimal point
        digitLoc = decimalLoc + precision + 1;
    } else {
        digitLoc = decimalLoc + precision;
    }

    
    // If the digit under consideration is 5 or greater, round up
    // Default (round down) case:
    var contributionFromRounding =  ( value < 0 ?   -1*Math.pow(10, -1*precision)  :  0  );
    // Check if we need to round up:
    if (    digitLoc >= 0
            && digitLoc <= stringVersion.length-1
            && (value > 0 && parseInt(stringVersion[digitLoc]) >= 5) || (value < 0 && parseInt(stringVersion[digitLoc]) <= 5)
    ) {
        // Round up
        contributionFromRounding += Math.pow(10, -1*precision);
    }

    // Set all digits to 0, starting at digitLoc
    var originalLength = stringVersion.length;
    stringVersion = stringVersion.substr(0, digitLoc);
    for (var i = digitLoc; i < originalLength; i++) {
        if (i === decimalLoc) {
            stringVersion = stringVersion + ".";
        } else {
            stringVersion = stringVersion + "0";
        }
    }

    return parseFloat(stringVersion) + contributionFromRounding;
}