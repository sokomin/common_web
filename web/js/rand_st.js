function calculate() {
    const n = parseInt(document.getElementById("numSelector").value);
    const randomMethod = document.getElementById("randomMethodSelector").value;

    let randomGenerator;
    var mt = new MersenneTwister();
    if (randomMethod === "mathRandom") {
        randomGenerator = Math.random;
    } else if (randomMethod === "mersenneTwister") {
        const mt = new MersenneTwister(); // MersenneTwisterのコンストラクタを仮定
        randomGenerator = () => mt.next(); 
    }


    let sum = 0;
    let sumOfSquares = 0;
    let sumOfThirdPower = 0;
    let sumOfFourthPower = 0;
    let randomValues = [];
    
    for (let i = 0; i < n; i++) {
        // const randomValue = Math.random();
        const randomValue = randomGenerator();
        randomValues.push(randomValue);
        sum += randomValue;
        sumOfSquares += randomValue * randomValue;
        sumOfThirdPower += Math.pow(randomValue, 3);
        sumOfFourthPower += Math.pow(randomValue, 4);
    }
    
    const mean = sum / n;
    const variance = (sumOfSquares / n) - (mean * mean);
    const stdDev = Math.sqrt(variance);
    
    const skewness = (n / ((n - 1) * (n - 2))) * (sumOfThirdPower / n - 3 * mean * variance - mean * mean * mean) / Math.pow(stdDev, 3);
    const kurtosis = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * (sumOfFourthPower / n - 4 * mean * sumOfThirdPower / n + 6 * mean * mean * variance + 3 * mean * mean * mean * mean) / Math.pow(stdDev, 4) - (3 * (n - 1) * (n - 1)) / ((n - 2) * (n - 3));

    let autocorrNumerator = 0;
    for (let i = 0; i < n - 1; i++) {
        autocorrNumerator += (randomValues[i] - mean) * (randomValues[i + 1] - mean);
    }
    const autocorrelation = autocorrNumerator / sumOfSquares;

    // Kolmogorov-Smirnov検定（KS検定）
    let sortedRandomValues = randomValues.slice().sort((a, b) => a - b);
    let maxDiff = 0;
    for (let i = 0; i < n; i++) {
        let cdf = (i + 1) / n;
        let ecdf = sortedRandomValues[i];
        let diff = Math.abs(cdf - ecdf);
        if (diff > maxDiff) {
            maxDiff = diff;
        }
    }

    // https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%AB%E3%83%A2%E3%82%B4%E3%83%AD%E3%83%95%E2%80%93%E3%82%B9%E3%83%9F%E3%83%AB%E3%83%8E%E3%83%95%E6%A4%9C%E5%AE%9A
    // Kolmogorov-Smirnov検定の近似的な臨界値と検定結果
    let criticalValue = 1.36 / Math.sqrt(n);
    let testResult = (maxDiff > criticalValue) ? "帰無仮説を棄却(指定された分布に従っていない可能性が高い)" : "帰無仮説を採択(指定された分布に従っている可能性が高い)";

    document.getElementById("mean").textContent = mean.toFixed(5);
    document.getElementById("variance").textContent = variance.toFixed(5);
    document.getElementById("skewness").textContent = skewness.toFixed(5);
    document.getElementById("kurtosis").textContent = kurtosis.toFixed(5);
    document.getElementById("autocorrelation").textContent = autocorrelation.toFixed(5);
    document.getElementById("ksDValue").textContent = maxDiff.toFixed(5);
    document.getElementById("ksCriticalValue").textContent = criticalValue.toFixed(5);
    document.getElementById("ksTestResult").textContent = testResult;
}