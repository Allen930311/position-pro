/**
 * Position Pro Calculator Core Logic
 * vanilla JS implementation for MV3/PWA compatibility.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const riskInput = document.getElementById('riskAmount');
    const entryInput = document.getElementById('entryPrice');
    const slInput = document.getElementById('stopLossPrice');
    const resultBox = document.getElementById('resultBox');
    const positionSizeText = document.getElementById('positionSize');
    const badge = document.getElementById('badge');
    const distanceBox = document.getElementById('distanceBox');
    const errorBox = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // 1. Initialize from Storage
    const savedRisk = await StorageManager.get('riskAmount', 20);
    riskInput.value = savedRisk;

    /**
     * Core Calculation Function
     */
    function calculate() {
        const riskVal = riskInput.value;
        const entryVal = entryInput.value;
        const slVal = slInput.value;

        // Reset UI
        errorBox.classList.add('hidden');
        resultBox.classList.add('hidden');

        if (!riskVal || !entryVal || !slVal) return;

        try {
            const risk = new BigNumber(riskVal);
            const entry = new BigNumber(entryVal);
            const sl = new BigNumber(slVal);

            // Validation
            if (risk.lte(0) || entry.lte(0) || sl.lte(0)) {
                showError('請輸入大於零的有效數值');
                return;
            }

            if (entry.eq(sl)) {
                showError('入場價與止損價不可相同');
                return;
            }

            // Calculation
            const distance = entry.minus(sl).abs();
            const isLong = entry.gt(sl);
            const rawPosition = risk.dividedBy(distance);
            
            // Safe Position (Floor to 4 decimals)
            const safePosition = rawPosition.toFixed(4, BigNumber.ROUND_FLOOR);

            // Update UI
            updateUI(safePosition, distance.toString(), isLong);
            
            // Persist Risk Amount
            StorageManager.save('riskAmount', riskVal);

        } catch (e) {
            showError('計算出錯，請檢查輸入值');
        }
    }

    function showError(msg) {
        errorText.textContent = msg;
        errorBox.classList.remove('hidden');
    }

    function updateUI(size, dist, isLong) {
        positionSizeText.textContent = size;
        distanceBox.textContent = `價格距離: ${dist}`;
        
        // Badge handling
        badge.className = 'badge ' + (isLong ? 'badge-long' : 'badge-short');
        badge.innerHTML = (isLong ? '做多 (Long)' : '做空 (Short)');
        
        resultBox.classList.remove('hidden');
    }

    // Attach Listeners
    riskInput.addEventListener('input', calculate);
    entryInput.addEventListener('input', calculate);
    slInput.addEventListener('input', calculate);
});
