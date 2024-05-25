(function() {
    // Function to get query parameters from URL
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            d: params.get('d'),
            i: params.get('i'),
            s: params.get('s'),
            c: params.get('c')
        };
    }

    // Function to get top 2 keys based on values
    function getTop2Keys(obj) {
        return Object.keys(obj)
            .sort((a, b) => obj[b] - obj[a])
            .slice(0, 2);
    }

    function getValue(key) {
        switch (key) {
            case 'D': return 'ДОМИНИРАЩ';
            case 'I': return 'ВЛИЯНИЕ';
            case 'S': return 'УСТОЙЧИВОСТ';
            case 'C': return 'СЪВЕСТНОСТ';
            default: return '¯\_(ツ)_/¯';
        }
    }

    // Function to check if a string can be parsed as a non-negative integer
    function isNonNegativeInteger(value) {
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 0;
    }

    // Get the query parameters
    const { d, i, s, c } = getQueryParams();

    // Validate the parameters
    if (!isNonNegativeInteger(d) || !isNonNegativeInteger(i) || !isNonNegativeInteger(s) || !isNonNegativeInteger(c)) {
        // Redirect to the parent level if any validation fails
        window.location.href = '..'; // Redirect to parent level
    } else {
        // Parse parameters as integers
        const result = {
            D: parseInt(d, 10),
            I: parseInt(i, 10),
            S: parseInt(s, 10),
            C: parseInt(c, 10),
        };

        const [top, second] = getTop2Keys(result);
        const primary = document.getElementById("primary");
        const secondary = document.getElementById("secondary");
        primary.style.color = getBorderColor(top);
        primary.innerHTML = getValue(top);
        secondary.style.color = getBorderColor(second);
        secondary.innerHTML = getValue(second);

        renderChart(result);
    }
})();