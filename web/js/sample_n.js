var n1 = 0;
var n2 = 0;
var n3 = 0;
var rel_width = 0.05;

//output出力用
function calculateAndDisplayResults() {
    document.getElementById('output').innerText = "";
    var ph = 1;
    var outputString = '';
    // 必要なサンプルサイズ n を計算
    outputString = calculateRequiredSampleSize(outputString, ph);

    // 計算された n を使用して信頼区間を計算
    outputString = calculateConfidenceInterval(outputString, ph);

    // 信頼区間を変えてみる
    outputString += "\n";
    ph = 2;
    outputString = calculateRequiredSampleSize(outputString, ph);

    // 計算された n を使用して信頼区間を計算
    outputString = calculateConfidenceInterval(outputString, ph);
    document.getElementById('output').innerText = outputString;
}

// サンプルサイズ計算
function calculateRequiredSampleSize(outputString, phase) {
    var p_hat = parseFloat(document.getElementById('p-hat').value) / 100;
    var z_values = {
        '0.9': 1.645,
        '0.95': 1.96,
        '0.99': 2.576
    };
    var z = z_values['0.95'];  // 95% 信頼区間の z 値をデフォルトとして使用
    // var n = Math.ceil((4 * z * z * p_hat * (1 - p_hat)) / 0.05 / 0.05);
    n1 = 0;
    n2 = 0;
    n3 = 0;
    rel_width = 0.05

    var i = 0;
    if (p_hat < 0.05) {
        rel_width = p_hat / 2;
    }
    if (p_hat > 0.95) {
        rel_width = (1 - p_hat) / 2;
    }
    if (phase == 2) {
        rel_width = ((0.5 - Math.abs(0.5 - p_hat)) / 2.5).toFixed(4);
        if (rel_width < 0.01) {
            if (p_hat < 0.05) {
                rel_width = p_hat / 4;
            }
            if (p_hat > 0.95) {
                rel_width = (1 - p_hat) / 4;
            }
        }
    }
    if (phase == 2) {
        outputString += "(2) 信頼区間の幅を" + String((rel_width * 100).toFixed(2)) + "%とした場合…\n";
    } else if (phase == 1) {
        outputString += "(1) 信頼区間の幅を" + String((rel_width * 100).toFixed(2)) + "%とした場合…\n";
    }
    for (var alpha in z_values) {
        var z = z_values[alpha];

        // 幅が5%以内であるためのnの計算
        var n = Math.ceil((4 * z * z * p_hat * (1 - p_hat)) / rel_width / rel_width);

        // 結果の出力文字列の作成
        outputString += "有意水準" + String(Number(alpha) * 100) + "%で必要なサンプルサイズ： " + n + "\n";
        if (i == 0) {
            n1 = n;
        } else if (i == 1) {
            n2 = n;
        } else if (i == 2) {
            n3 = n;
        }
        i++;
    }

    return outputString;
}

// 信頼区間の計算（区間推定用）
function calculateConfidenceInterval(outputString, phase) {
    var p_hat = parseFloat(document.getElementById('p-hat').value) / 100;
    var z_values = {
        '0.9': 1.645,
        '0.95': 1.96,
        '0.99': 2.576
    };

    outputString += "\n上記のサンプル数で区間推定をした場合…\n";

    var i = 0;
    var n = 1;
    // 現行ロジックだと全部同じになる、逆関数状態でしかないので。一応検証も兼ねて残しておく。
    for (var alpha in z_values) {
        if (i == 0) {
            n = n1;
        } else if (i == 1) {
            n = n2;
        } else if (i == 2) {
            n = n3;
        }
        i++;
        var z = z_values[alpha];
        var marginOfError = z * Math.sqrt(p_hat * (1 - p_hat) / n);
        var lowerBound = (p_hat - marginOfError) * 100;
        var upperBound = (p_hat + marginOfError) * 100;
        outputString += "信頼区間: [" + lowerBound.toFixed(2) + "%, " + upperBound.toFixed(2) + "%]の範囲となります。\n";
        break;
    }
    return outputString;
}

// 検定まで実行する場合…
function performHypothesisTest() {
    document.getElementById('output').innerText = "";
    var p = parseFloat(document.getElementById('p-hat').value) / 100;
    var n = parseInt(document.getElementById('sample-size').value);
    var q = parseFloat(document.getElementById('actual-prob').value) / 100;  // 実際の確率 q の入力を追加する必要があります

    var X = p * n;  // サンプル中の成功数

    // z統計量の計算
    var z = (X - n * q) / Math.sqrt(n * q * (1 - q));

    // p値の計算(片側検定の場合…)
    // var pValue = 1 - (0.5 * (1 + erf(z / Math.sqrt(2))));
    // p値の両側検定
    var pValueOneSided = 0.5 * (1 + erf(-Math.abs(z) / Math.sqrt(2)));
    var pValue = 2 * pValueOneSided;  // 両側検定のためのp値

    // 有意水準での検定結果
    var results = {
        '0.9': pValue < 0.1,
        '0.95': pValue < 0.05,
        '0.99': pValue < 0.01
    };

    var outputString = "[検定結果]\n zValue:" + z.toFixed(2) + "\n pValue:" + pValue.toFixed(4) + "\n";

    for (var alpha in results) {
        outputString += String(Number(alpha) * 100) + "%の有意水準で、";
        outputString += results[alpha] ? "帰無仮説を棄却します。\n" : "帰無仮説を棄却しません。\n";
    }

    // 結果を出力エリアに追加
    document.getElementById('output').innerText += "\n" + outputString;
}

// エラー関数
function erf(x) {
    // constants
    var a1 = 0.254829592;
    var a2 = -0.284496736;
    var a3 = 1.421413741;
    var a4 = -1.453152027;
    var a5 = 1.061405429;
    var p = 0.3275911;

    // Save the sign of x
    var sign = (x < 0) ? -1 : 1;
    x = Math.abs(x);

    // A&S formula 7.1.26
    var t = 1.0 / (1.0 + p * x);
    var y = (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t;

    return sign * (1 - y * Math.exp(-x * x));
}
