// script.js

let heatPumpCounter = 0;
let hybridCounter = 0;
let geothermalCounter = 0;

function getVal(id) {
    const element = document.getElementById(id);
    return element ? parseFloat(element.value) || 0 : 0;
}

function getText(id) {
    const element = document.getElementById(id);
    return element ? element.value || '' : '';
}

function toggleDebug() {
    const debugSection = document.getElementById('debugSection');
    debugSection.style.display = debugSection.style.display === 'none' ? 'block' : 'none';
}

function createVendorHTML(type, id, name, cost, rating1, rating2) {
    const isRemovable = (type === 'hp' && heatPumpCounter > 1) ||
                        (type === 'hybrid' && hybridCounter > 1) ||
                        (type === 'geo' && geothermalCounter > 1);

    let typeLabel, typeColor, rating1Label, rating2Label, rating1Id, rating2Id, rating1Help, rating2Help;

    switch(type) {
        case 'hp':
            typeLabel = 'Heat Pump';
            typeColor = '#3498db';
            rating1Label = 'SEER2 Rating';
            rating2Label = 'HSPF2 Rating';
            rating1Id = `hpSEER${id}`;
            rating2Id = `hpHSPF${id}`;
            rating1Help = 'Cooling efficiency';
            rating2Help = 'Heating efficiency';
            break;
        case 'hybrid':
            typeLabel = 'Hybrid Geothermal';
            typeColor = '#007bff';
            rating1Label = 'EER Rating';
            rating2Label = 'COP Rating';
            rating1Id = `hybridEER${id}`;
            rating2Id = `hybridCOP${id}`;
            rating1Help = 'Geo Cooling (EER)';
            rating2Help = 'Geo Heating (COP)';
            break;
        case 'geo':
            typeLabel = 'Full Geothermal';
            typeColor = '#e74c3c';
            rating1Label = 'EER Rating';
            rating2Label = 'COP Rating';
            rating1Id = `geoEER${id}`;
            rating2Id = `geoCOP${id}`;
            rating1Help = 'Geo Cooling (EER)';
            rating2Help = 'Geo Heating (COP)';
            break;
    }

    const removeButton = isRemovable ? `<button class="remove-vendor" onclick="removeVendor('${type}', ${id})" title="Remove this vendor">✗</button>` : '';

    return `
        <div class="vendor-option" id="${type}Vendor${id}">
            ${removeButton}
            <h4 style="border-bottom-color: ${typeColor}">${typeLabel} Option ${id}</h4>
            <div class="vendor-grid">
                <div class="input-group">
                    <label for="${type}Name${id}">Vendor/Option Name</label>
                    <input type="text" id="${type}Name${id}" value="${name}" onchange="calculateAll()">
                    <small>Custom name for this option</small>
                </div>
                <div class="input-group">
                    <label for="${type}Cost${id}">Total Cost ($)</label>
                    <input type="number" id="${type}Cost${id}" value="${cost}" onchange="calculateAll()">
                    <small>Total installed cost</small>
                </div>
                <div class="input-group">
                    <label for="${rating1Id}">${rating1Label}</label>
                    <input type="number" id="${rating1Id}" value="${rating1}" step="0.1" onchange="calculateAll()">
                    <small>${rating1Help}</small>
                </div>
                <div class="input-group">
                    <label for="${rating2Id}">${rating2Label}</label>
                    <input type="number" id="${rating2Id}" value="${rating2}" step="0.1" onchange="calculateAll()">
                    <small>${rating2Help}</small>
                </div>
            </div>
        </div>
    `;
}


function addHeatPumpVendor() {
    heatPumpCounter++;
    const container = document.getElementById('heatPumpVendors');
    const vendorHTML = createVendorHTML('hp', heatPumpCounter, `Heat Pump Option ${heatPumpCounter}`, 10000, 15, 8.2);
    container.insertAdjacentHTML('beforeend', vendorHTML);
    calculateAll();
}

function addHybridVendor() {
    hybridCounter++;
    const container = document.getElementById('hybridVendors');
    const vendorHTML = createVendorHTML('hybrid', hybridCounter, `Hybrid Option ${hybridCounter}`, 35000, 20, 4.5);
    container.insertAdjacentHTML('beforeend', vendorHTML);
    calculateAll();
}

function addGeothermalVendor() {
    geothermalCounter++;
    const container = document.getElementById('geothermalVendors');
    const vendorHTML = createVendorHTML('geo', geothermalCounter, `Full Geothermal Option ${geothermalCounter}`, 50000, 22, 5.0);
    container.insertAdjacentHTML('beforeend', vendorHTML);
    calculateAll();
}

function removeVendor(type, id) {
    const vendorElement = document.getElementById(`${type}Vendor${id}`);
    if (vendorElement) {
        vendorElement.remove();
        calculateAll();
    }
}

function initializeVendors() {
    const heatPumpContainer = document.getElementById('heatPumpVendors');
    const hybridContainer = document.getElementById('hybridVendors');
    const geothermalContainer = document.getElementById('geothermalVendors');

    heatPumpContainer.innerHTML = '';
    hybridContainer.innerHTML = '';
    geothermalContainer.innerHTML = '';

    heatPumpCounter = 0;
    hybridCounter = 0;
    geothermalCounter = 0;
}

function getHeatPumpOptions() {
    const options = [];
    const hpMaintenance = getVal('hpMaintenance');
    for (let i = 1; i <= heatPumpCounter; i++) {
        const element = document.getElementById(`hpVendor${i}`);
        if (element) {
            options.push({
                id: i,
                name: getText(`hpName${i}`),
                cost: getVal(`hpCost${i}`),
                seer: getVal(`hpSEER${i}`),
                hspf: getVal(`hpHSPF${i}`),
                maintenance: hpMaintenance,
                type: 'HP'
            });
        }
    }
    return options;
}

function getHybridOptions() {
    const options = [];
    const hybridMaintenance = (getVal('hpMaintenance') + getVal('geoMaintenance')) / 2;
    for (let i = 1; i <= hybridCounter; i++) {
        const element = document.getElementById(`hybridVendor${i}`);
        if (element) {
            const eer = getVal(`hybridEER${i}`);
            const cop = getVal(`hybridCOP${i}`);
            const equivalentSEER = eer * 1.15;
            const equivalentHSPF = cop * 2.7;

            options.push({
                id: i,
                name: getText(`hybridName${i}`),
                cost: getVal(`hybridCost${i}`),
                seer: equivalentSEER,
                hspf: equivalentHSPF,
                eer: eer,
                cop: cop,
                maintenance: hybridMaintenance,
                type: 'HYBRID'
            });
        }
    }
    return options;
}

function getGeothermalOptions() {
    const options = [];
    const geoMaintenance = getVal('geoMaintenance');
    for (let i = 1; i <= geothermalCounter; i++) {
        const element = document.getElementById(`geoVendor${i}`);
        if (element) {
            const eer = getVal(`geoEER${i}`);
            const cop = getVal(`geoCOP${i}`);
            const equivalentSEER = eer * 1.15;
            const equivalentHSPF = cop * 2.7;

            options.push({
                id: i,
                name: getText(`geoName${i}`),
                cost: getVal(`geoCost${i}`),
                seer: equivalentSEER,
                hspf: equivalentHSPF,
                eer: eer,
                cop: cop,
                maintenance: geoMaintenance,
                type: 'GEO'
            });
        }
    }
    return options;
}


function calculateNewEnergyCost(newSEER, newHSPF, type) {
    const currentEnergyCost = getVal('currentAnnualCost');
    const currentSEER = getVal('currentSEER');
    const currentHSPF = getVal('currentHSPF');

    let effectiveSEER, effectiveHSPF;

    if (type === 'HP') {
        const downstairsSEER = 14.5;
        const downstairsHSPF = 8.35;
        effectiveSEER = (0.65 * newSEER) + (0.35 * downstairsSEER);
        effectiveHSPF = (0.65 * newHSPF) + (0.35 * downstairsHSPF);
    } else if (type === 'HYBRID') {
        const downstairsSEER = 14.5;
        const downstairsHSPF = 8.35;
        effectiveSEER = (0.65 * newSEER) + (0.35 * downstairsSEER);
        effectiveHSPF = (0.65 * newHSPF) + (0.35 * downstairsHSPF);
    } else {
        effectiveSEER = newSEER;
        effectiveHSPF = newHSPF;
    }

    const seerImprovement = (currentSEER > 0) ? effectiveSEER / currentSEER : 1;
    const hspfImprovement = (currentHSPF > 0) ? effectiveHSPF / currentHSPF : 1;

    const overallEfficiencyFactor = (0.6 * seerImprovement) + (0.4 * hspfImprovement);

    let newEnergyCost = (overallEfficiencyFactor > 0) ? currentEnergyCost / overallEfficiencyFactor : currentEnergyCost;

    if (type === 'HP') { // REMOVED: || type === 'HYBRID'
        const emergencyHeatDays = getVal('emergencyHeatDays');
        const emergencyHeatCost = getVal('emergencyHeatCost');
        const hotDayPenalty = getVal('hotDayPenalty') / 100;
        const hotDaysPerYear = getVal('hotDaysPerYear');

        const weatherFactor = (type === 'HP') ? 1.0 : 0.35;

        const winterPenalty = emergencyHeatDays * emergencyHeatCost * weatherFactor;
        const summerPenalty = (currentEnergyCost * 0.6) * hotDayPenalty * (hotDaysPerYear / 120) * weatherFactor;

        newEnergyCost += winterPenalty + summerPenalty;
    }

    return newEnergyCost;
}

function calculateAll() {
    const calcButton = document.querySelector('.calculate-btn');
    if (calcButton) {
        calcButton.classList.add('is-calculating');
        // Remove the class after the animation completes
        setTimeout(() => {
            calcButton.classList.remove('is-calculating');
        }, 500); // 500ms matches the animation duration
    }
    const taxCreditRate = getVal('taxCredit') / 100;
    const discountRate = getVal('discountRate') / 100;
    const inflationRate = getVal('inflationRate') / 100;
    const currentTotalCost = getVal('currentAnnualCost') + getVal('brokenSystemPenalty');

    const baselineBody = document.getElementById('baselineBody');
    const hybridBody = document.getElementById('hybridBody');
    const upgradeBody = document.getElementById('upgradeBody');
    const npvBody = document.getElementById('npvBody');
    const debugOutput = document.getElementById('debugOutput');

    baselineBody.innerHTML = '';
    hybridBody.innerHTML = '';
    upgradeBody.innerHTML = '';
    npvBody.innerHTML = '';

    let debugText = `Current total annual cost (broken system): ${currentTotalCost.toLocaleString()}<br>`;
    debugText += `Discount rate: ${(discountRate * 100).toFixed(1)}%, Inflation rate: ${(inflationRate * 100).toFixed(1)}%<br><br>`;

    const heatPumpResults = [];
    const hybridResults = [];
    const geothermalResults = [];

    debugText += `<strong>=== BASELINE HEAT PUMP OPTIONS ===</strong><br>`;
    const heatPumpOptions = getHeatPumpOptions();

    heatPumpOptions.forEach(option => {
        if (option.cost > 0 && option.name.trim()) {
            const newEnergyCost = calculateNewEnergyCost(option.seer, option.hspf, option.type);
            const totalNewAnnualCost = newEnergyCost + option.maintenance;
            const annualSavings = currentTotalCost - totalNewAnnualCost;

            debugText += `${option.name}: Cost ${option.cost.toLocaleString()}, `;
            debugText += `Energy ${newEnergyCost.toFixed(0)}, Total Annual ${totalNewAnnualCost.toFixed(0)}, `;
            debugText += `Savings ${annualSavings.toFixed(0)}<br>`;

            heatPumpResults.push({
                ...option,
                energyCost: newEnergyCost,
                totalAnnualCost: totalNewAnnualCost,
                annualSavings: annualSavings
            });
        }
    });

    if (heatPumpResults.length === 0) {
        debugText += `<br><strong>No valid heat pump options found</strong><br><br>`;
        debugOutput.innerHTML = debugText;
        generateCostProjectionChart([], [], []);
        return;
    }

    // Populate the baseline selector dropdown
    const baselineSelect = document.getElementById('baselineSelect');
    const previouslySelected = baselineSelect.value;
    baselineSelect.innerHTML = ''; // Clear old options
    heatPumpResults.forEach(hp => {
        const optionEl = document.createElement('option');
        optionEl.value = hp.name;
        optionEl.textContent = hp.name;
        baselineSelect.appendChild(optionEl);
    });

    // Try to re-select the previous option if it still exists
    if (previouslySelected) {
        baselineSelect.value = previouslySelected;
    }

    // Determine the baseline from the dropdown, or default to the best
    const selectedBaselineName = baselineSelect.value;
    let bestHeatPump = heatPumpResults.find(hp => hp.name === selectedBaselineName);

    // Fallback if the selected option is somehow invalid
    if (!bestHeatPump) {
        bestHeatPump = heatPumpResults.reduce((best, current) =>
            current.totalAnnualCost < best.totalAnnualCost ? current : best
        );
        baselineSelect.value = bestHeatPump.name;
    }


    debugText += `<br><strong>Best Heat Pump Baseline:</strong> ${bestHeatPump.name} with ${bestHeatPump.totalAnnualCost.toFixed(0)} annual cost<br><br>`;

    const calculateUpgradeMetrics = (option) => {
        const taxCredit = (option.type !== 'HP') ? option.cost * taxCreditRate : 0;
        const netCost = option.cost - taxCredit;
        const newEnergyCost = calculateNewEnergyCost(option.seer, option.hspf, option.type);
        const totalNewAnnualCost = newEnergyCost + option.maintenance;

        const extraInvestment = option.cost - bestHeatPump.cost;
        const netExtraInvestment = netCost - bestHeatPump.cost;
        const extraAnnualSavings = bestHeatPump.totalAnnualCost - totalNewAnnualCost;
        const simplePayback = extraAnnualSavings > 0 ? netExtraInvestment / extraAnnualSavings : 999;

        debugText += `${option.name} (Type: ${option.type}): Extra cost ${extraInvestment.toLocaleString()} (net: ${netExtraInvestment.toLocaleString()}), `;
        debugText += `Extra savings ${extraAnnualSavings.toFixed(0)}/yr, Payback ${simplePayback.toFixed(1)} years<br>`;

        const heatPumpLifespan = getVal('heatPumpLifespan');
        const geothermalLifespan = getVal('geothermalLifespan');
        let cumulativeNPV = -netExtraInvestment;
        const npvAtIntervals = {};

        for (let year = 1; year <= 30; year++) {
            const inflatedSavings = extraAnnualSavings * Math.pow(1 + inflationRate, year - 1);
            const presentValue = inflatedSavings / Math.pow(1 + discountRate, year);
            cumulativeNPV += presentValue;

            if (year === geothermalLifespan && (option.type === 'HYBRID' || option.type === 'GEO')) {
                const replacementCost = option.cost * 0.7;
                const inflatedReplacementCost = replacementCost * Math.pow(1 + inflationRate, year - 1);
                cumulativeNPV -= inflatedReplacementCost / Math.pow(1 + discountRate, year);
            }

            if (year === heatPumpLifespan) {
                const baselineReplacementCost = bestHeatPump.cost * Math.pow(1 + inflationRate, year - 1);
                cumulativeNPV += baselineReplacementCost / Math.pow(1 + discountRate, year);
            }

            if (year === heatPumpLifespan * 2) {
                    const baselineReplacementCost = bestHeatPump.cost * Math.pow(1 + inflationRate, year - 1);
                cumulativeNPV += baselineReplacementCost / Math.pow(1 + discountRate, year);
            }

            if ([5, 10, 15, 20].includes(year)) {
                npvAtIntervals[year] = cumulativeNPV;
            }
        }

        return {
            ...option,
            netCost: netCost,
            taxCredit: taxCredit,
            energyCost: newEnergyCost,
            totalAnnualCost: totalNewAnnualCost,
            extraInvestment: extraInvestment,
            netExtraInvestment: netExtraInvestment,
            extraAnnualSavings: extraAnnualSavings,
            simplePayback: simplePayback,
            npv5yr: npvAtIntervals[5],
            npv10yr: npvAtIntervals[10],
            npv15yr: npvAtIntervals[15],
            npv20yr: npvAtIntervals[20]
        };
    };

    debugText += `<br><strong>=== HYBRID GEOTHERMAL OPTIONS ===</strong><br>`;
    const hybridOptions = getHybridOptions();
    hybridOptions.forEach(option => {
        if (option.cost > 0 && option.name.trim()) {
            hybridResults.push(calculateUpgradeMetrics(option));
        }
    });

    debugText += `<br><strong>=== FULL GEOTHERMAL OPTIONS ===</strong><br>`;
    const geothermalOptions = getGeothermalOptions();
    geothermalOptions.forEach(option => {
        if (option.cost > 0 && option.name.trim()) {
            geothermalResults.push(calculateUpgradeMetrics(option));
        }
    });

    debugOutput.innerHTML = debugText;

    const formatCurrency = (val) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const formatNPV = (value) => {
        const color = value >= 0 ? '#27ae60' : '#e74c3c';
        return `<span style="color:${color}; font-weight:bold;">${formatCurrency(value)}</span>`;
    };
    const formatPayback = (years) => {
        if (years > 50) return 'Never';
        return `${years.toFixed(1)} years`;
    };

    heatPumpResults.forEach((result) => {
        const row = baselineBody.insertRow();
        // Add data-label attributes to each <td>
        row.innerHTML = `
            <td data-label="Option"><strong>${result.name}</strong></td>
            <td data-label="Install Cost">${formatCurrency(result.cost)}</td>
            <td data-label="Efficiency">${result.seer} SEER2 / ${result.hspf} HSPF2</td>
            <td data-label="Energy Cost">${formatCurrency(result.energyCost)}</td>
            <td data-label="Total Annual">${formatCurrency(result.totalAnnualCost)}</td>
            <td data-label="Annual Savings"><strong>${formatCurrency(result.annualSavings)}</strong></td>
        `;
        if (result.name === bestHeatPump.name) {
            row.style.backgroundColor = '#e8f5e8';
        }
    });

    const populateUpgradeTable = (body, results) => {
        results.forEach((result) => {
            const row = body.insertRow();
            // Add data-label attributes to each <td>
            row.innerHTML = `
                <td data-label="Option"><strong>${result.name}</strong></td>
                <td data-label="Extra Cost">${formatCurrency(result.extraInvestment)}</td>
                <td data-label="Tax Credit">${formatCurrency(result.taxCredit)}</td>
                <td data-label="Net Extra Cost">${formatCurrency(result.netExtraInvestment)}</td>
                <td data-label="Extra Savings"><strong>${formatCurrency(result.extraAnnualSavings)}</strong></td>
                <td data-label="Payback">${formatPayback(result.simplePayback)}</td>
            `;
        });
    };

    populateUpgradeTable(hybridBody, hybridResults);
    populateUpgradeTable(upgradeBody, geothermalResults);

    [...hybridResults, ...geothermalResults].forEach((result) => {
        const row = npvBody.insertRow();
        const type = hybridResults.includes(result) ? 'Hybrid' : 'Full Geothermal';
        // Add data-label attributes to each <td>
        row.innerHTML = `
            <td data-label="Option"><strong>${result.name}</strong></td>
            <td data-label="Type">${type}</td>
            <td data-label="Net Investment">${formatCurrency(result.netExtraInvestment)}</td>
            <td data-label="5 Year NPV">${formatNPV(result.npv5yr)}</td>
            <td data-label="10 Year NPV">${formatNPV(result.npv10yr)}</td>
            <td data-label="15 Year NPV">${formatNPV(result.npv15yr)}</td>
            <td data-label="20 Year NPV">${formatNPV(result.npv20yr)}</td>
        `;
    });

    let bestHybrid = null;
    let bestGeo = null;

    if (hybridResults.length > 0) {
        bestHybrid = hybridResults.reduce((best, current) =>
            current.npv20yr > best.npv20yr ? current : best
        );
    }

    if (geothermalResults.length > 0) {
        bestGeo = geothermalResults.reduce((best, current) =>
            current.npv20yr > best.npv20yr ? current : best
        );
    }

    let recommendation = bestHeatPump.name;
    let bestOverallNPV = 0;

    if (bestHybrid && bestHybrid.npv20yr > bestOverallNPV) {
        recommendation = bestHybrid.name;
        bestOverallNPV = bestHybrid.npv20yr;
    }

    if (bestGeo && bestGeo.npv20yr > bestOverallNPV) {
        recommendation = bestGeo.name;
    }

    // Determine the objective winner for the "Best Heat Pump" card
    const winningHeatPump = heatPumpResults.reduce((best, current) =>
        (current.totalAnnualCost < best.totalAnnualCost ? current : best)
    );

    document.getElementById('bestHeatPump').textContent = winningHeatPump.name; // Use the new winner variable
    document.getElementById('bestHybrid').textContent = bestHybrid ? bestHybrid.name : 'N/A';
    document.getElementById('bestGeo').textContent = bestGeo ? bestGeo.name : 'N/A';
    document.getElementById('recommendation').textContent = recommendation;

    // Pass the names of the best HP and the final recommendation to the chart function
    generateCostProjectionChart(heatPumpResults, hybridResults, geothermalResults, bestHeatPump.name, winningHeatPump.name, recommendation);

    // Manually set the default dropdown selection
    document.getElementById('baselineSelect').value = "Heat Pump Vendor-3";
}


function createInteractiveLegend(projectionData, chartUpdater, bestHpName, recommendedName) {
    const legendContainer = document.getElementById('chartLegend');
    legendContainer.innerHTML = '<h4>Toggle Options</h4>';

    // Dynamically create the list of default options to check
    const defaultOnOptions = [bestHpName];
    // Add the recommendation only if it's different from the best heat pump
    if (bestHpName !== recommendedName) {
        defaultOnOptions.push(recommendedName);
    }

    projectionData.forEach(option => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('legend-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `toggle-${option.uniqueId}`;
        checkbox.value = option.name;
        
        // This line now uses the dynamic list
        checkbox.checked = defaultOnOptions.includes(option.name);
        checkbox.style.accentColor = option.color;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = option.name;
        label.style.borderLeft = `4px solid ${option.color}`;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        legendContainer.appendChild(wrapper);

        checkbox.addEventListener('change', chartUpdater);
    });
}


function generateCostProjectionChart(heatPumpResults, hybridResults, geothermalResults, selectedBaselineName, bestHpName, recommendedName) {
    const canvas = document.getElementById('costProjectionChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const chartContainer = canvas.parentElement;

    if (window.devicePixelRatio > 1) {
        const canvasRect = chartContainer.getBoundingClientRect();
        canvas.width = canvasRect.width * window.devicePixelRatio;
        canvas.height = canvasRect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        canvas.style.width = canvasRect.width + 'px';
        canvas.style.height = canvasRect.height + 'px';
    } else {
        const canvasRect = chartContainer.getBoundingClientRect();
        canvas.width = canvasRect.width;
        canvas.height = canvasRect.height;
    }

    const inflationRate = getVal('inflationRate') / 100;
    const years = 30;

    const allOptions = [...heatPumpResults, ...hybridResults, ...geothermalResults];
    const projectionData = [];

    allOptions.forEach((option, index) => {
        const yearlyData = [];
        let cumulativeCost = (option.type === 'HP') ? option.cost : option.netCost;
        yearlyData.push({ year: 0, cost: cumulativeCost });

        for (let year = 1; year <= years; year++) {
            const inflatedAnnualCost = option.totalAnnualCost * Math.pow(1 + inflationRate, year - 1);
            cumulativeCost += inflatedAnnualCost;
            yearlyData.push({ year: year, cost: cumulativeCost });

            const heatPumpLifespan = getVal('heatPumpLifespan');
            const geothermalLifespan = getVal('geothermalLifespan');
            let replacementCost = 0;

            if (option.type === 'HP' && year > 0 && year % heatPumpLifespan === 0) {
                replacementCost = option.cost * Math.pow(1 + inflationRate, year);
            } else if ((option.type === 'HYBRID' || option.type === 'GEO') && year > 0 && year % geothermalLifespan === 0) {
                const futureReplacementCost = getVal('geoReplacementCost');
                replacementCost = futureReplacementCost * Math.pow(1 + inflationRate, year);
            }
            
            if (replacementCost > 0) {
                cumulativeCost += replacementCost;
                yearlyData.push({ year: year, cost: cumulativeCost });
            }
        }

        projectionData.push({
            name: option.name,
            data: yearlyData,
            type: option.type,
            uniqueId: `option-${index}`,
            color: option.type === 'HP' ? 'hsl(' + (210 + (heatPumpResults.indexOf(option) * 30)) + ', 70%, 50%)' :
                option.type === 'HYBRID' ? 'hsl(' + (270 + (hybridResults.indexOf(option) * 30)) + ', 70%, 50%)' :
                'hsl(' + (120 + (geothermalResults.indexOf(option) * 40)) + ', 70%, 45%)'
        });
    });

    const bestHeatPumpData = projectionData.find(p => p.name === selectedBaselineName);

    const getCostForYear = (data, year) => {
        const pointsForYear = data.filter(p => p.year === year);
        if (pointsForYear.length > 0) {
            return pointsForYear[pointsForYear.length - 1].cost;
        }
        if (year === 0) {
            const zeroYearPoint = data.find(p => p.year === 0);
            if (zeroYearPoint) return zeroYearPoint.cost;
        }
        return undefined;
    };

    function redrawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (heatPumpResults.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Add vendor options to see cost projection', chartContainer.clientWidth / 2, chartContainer.clientHeight / 2);
            return;
        }

        const visibleOptions = projectionData.filter(option => {
            const checkbox = document.getElementById(`toggle-${option.uniqueId}`);
            return checkbox ? checkbox.checked : true;
        });

        if (visibleOptions.length === 0) return;

        const maxCost = Math.max(...visibleOptions.flatMap(p => p.data.map(d => d.cost)));
        const maxYear = years;
        const margin = { top: 40, right: 30, bottom: 80, left: 70 };
        const chartWidth = chartContainer.clientWidth - margin.left - margin.right;
        const chartHeight = chartContainer.clientHeight - margin.top - margin.bottom;
        const xScale = (year) => margin.left + (year / maxYear) * chartWidth;
        const yScale = (cost) => margin.top + chartHeight - (cost / maxCost) * chartHeight;
        
        // --- Draw Gridlines and Axes ---
        ctx.lineWidth = 0.5;

        // MINOR gridlines (faint)
        ctx.strokeStyle = '#f0f0f0';
        for (let year = 1; year <= maxYear; year++) {
            if (year % 5 !== 0) {
                const x = xScale(year);
                ctx.beginPath();
                ctx.moveTo(x, margin.top);
                ctx.lineTo(x, margin.top + chartHeight);
                ctx.stroke();
            }
        }
        for (let cost = 10000; cost < maxCost; cost += 10000) {
            const y = yScale(cost);
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(margin.left + chartWidth, y);
            ctx.stroke();
        }

        // MAJOR gridlines (darker)
        const costStep = Math.ceil(maxCost / 8 / 10000) * 10000;
        ctx.strokeStyle = '#e0e0e0';
        for (let year = 5; year <= maxYear; year += 5) {
            const x = xScale(year);
            ctx.beginPath();
            ctx.moveTo(x, margin.top);
            ctx.lineTo(x, margin.top + chartHeight);
            ctx.stroke();
        }
        for (let cost = costStep; cost < maxCost; cost += costStep) {
            const y = yScale(cost);
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(margin.left + chartWidth, y);
            ctx.stroke();
        }

        // Main X and Y axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + chartHeight);
        ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + chartHeight);
        ctx.stroke();
        
        // --- Draw Minor X-Axis Ticks ---
        ctx.strokeStyle = '#aaa'; 
        ctx.lineWidth = 1;
        for (let year = 0; year <= maxYear; year++) {
            if (year % 5 !== 0) { 
                const x = xScale(year);
                ctx.beginPath();
                ctx.moveTo(x, margin.top + chartHeight); 
                ctx.lineTo(x, margin.top + chartHeight + 5); 
                ctx.stroke();
            }
        }

        // --- Draw Labels and Titles ---
        ctx.fillStyle = '#333';
        ctx.font = '11px Segoe UI';
        ctx.textAlign = 'center';
        for (let year = 0; year <= maxYear; year += 5) {
            ctx.font = (year % 10 === 0) ? 'bold 11px Segoe UI' : '11px Segoe UI';
            ctx.fillText(year.toString(), xScale(year), margin.top + chartHeight + 20);
        }
        ctx.textAlign = 'right';
        // This loop now correctly uses the 'costStep' variable defined earlier
        for (let cost = costStep; cost <= maxCost; cost += costStep) {
            if (cost > 0) ctx.fillText('$' + Math.round(cost / 1000) + 'k', margin.left - 8, yScale(cost) + 4);
        }
        ctx.font = '12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Years', margin.left + chartWidth / 2, chartContainer.clientHeight - 45);
        ctx.save();
        ctx.translate(30, margin.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Cumulative Total Cost', 0, 0);
        ctx.restore();
        ctx.font = 'bold 14px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('30-Year Total Cost Projection (Including Replacements & Inflation)', margin.left + chartWidth / 2, 25);

        // --- Draw Data Lines & Markers ---
        visibleOptions.forEach((option) => {
            ctx.strokeStyle = option.color;
            ctx.lineWidth = option.type === 'GEO' ? 2.5 : option.type === 'HYBRID' ? 2 : 1.5;
            if (option.type === 'HP') {
                ctx.setLineDash([]);
            } else if (option.type === 'HYBRID') {
                ctx.setLineDash([10, 4]);
            } else {
                ctx.setLineDash([4, 4]);
            }
            ctx.beginPath();
            option.data.forEach((point, i) => {
                const x = xScale(point.year);
                const y = yScale(point.cost);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.setLineDash([]);
        });

        // --- Draw Payback Lines ---
        if (bestHeatPumpData) {
            visibleOptions.forEach(option => {
                if (option.type !== 'HP') {
                    let breakEvenYear = -1;
                    for (let year = 1; year <= years; year++) {
                        const optionCost = getCostForYear(option.data, year);
                        const baselineCost = getCostForYear(bestHeatPumpData.data, year);
                        if (optionCost !== undefined && baselineCost !== undefined && optionCost <= baselineCost) {
                            breakEvenYear = year;
                            break;
                        }
                    }

                    if (breakEvenYear !== -1) {
                        const prevYear = breakEvenYear - 1;
                        const geoCostPrev = getCostForYear(option.data, prevYear);
                        const hpCostPrev = getCostForYear(bestHeatPumpData.data, prevYear);
                        const geoCostNow = getCostForYear(option.data, breakEvenYear);
                        const hpCostNow = getCostForYear(bestHeatPumpData.data, breakEvenYear);
                        let breakEvenPoint = breakEvenYear;

                        if (geoCostPrev !== undefined && hpCostPrev !== undefined && geoCostNow !== undefined && hpCostNow !== undefined) {
                            const costDiffPrev = geoCostPrev - hpCostPrev;
                            const costDiffNow = geoCostNow - hpCostNow;
                            if (costDiffPrev > 0 && costDiffNow <= 0) {
                                const totalDiff = costDiffPrev - costDiffNow;
                                if (totalDiff > 0) {
                                    breakEvenPoint = prevYear + (costDiffPrev / totalDiff);
                                }
                            }
                        }

                        const x = xScale(breakEvenPoint);
                        ctx.beginPath();
                        ctx.moveTo(x, margin.top);
                        ctx.lineTo(x, margin.top + chartHeight);
                        ctx.strokeStyle = option.color;
                        ctx.lineWidth = 1;
                        ctx.setLineDash([4, 2]);
                        ctx.stroke();
                        ctx.setLineDash([]);
                        ctx.fillStyle = option.color;
                        ctx.textAlign = 'center';
                        const labelX = Math.max(margin.left + 50, Math.min(x, margin.left + chartWidth - 50));
                        ctx.fillText(`Payback: ${option.name}`, labelX, margin.top - 5);
                    }
                }
            });
        }
    }

    createInteractiveLegend(projectionData, redrawChart, bestHpName, recommendedName);
    redrawChart();
}
function showStatus(message, isError = false) {
    const statusEl = document.getElementById('fileStatus');
    const errorEl = document.getElementById('fileError');

    const el = isError ? errorEl : statusEl;
    el.textContent = message;
    el.style.display = 'block';
    (isError ? statusEl : errorEl).style.display = 'none';

    setTimeout(() => {
        el.style.display = 'none';
    }, 3000);
}

function downloadTemplate() {
    const template = `Type,Name,Cost,Rating1,Rating2
# Enter Heat Pump quotes like this:
HeatPump,My Heat Pump Quote,10000,15,8.2
# Enter Geothermal quotes like this (use EER/COP for Rating1/Rating2):
Hybrid,My Hybrid Quote,35000,20,4.5
Geothermal,My Full Geothermal Quote,50000,22,5.0`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hvac_vendor_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    showStatus('Template downloaded! Fill in your actual vendor quotes.');
}

function loadExampleData() {
    const exampleData = `Type,Name,Cost,Rating1,Rating2
HeatPump,Heat Pump Vendor-1,15401,14.5,7.8
HeatPump,Heat Pump Vendor-2,9500,15.2,8.5
HeatPump,Heat Pump Vendor-3, 20000,20,10

Hybrid,Hybrid Geo-Vendor-1,37500,21.0,4.6
Hybrid,Hybrid Geo-Vendor-2, 34882,21,4.6

Geothermal,Full Geo Vendor-1,60000,22.0,5
Geothermal,Full Geo Vendor-2,51952,22.0,5`;

    try {
        parseVendorData(exampleData);
        showStatus('Example data loaded with accurate geo ratings!');
    } catch (error) {
        showStatus('Error loading example data: ' + error.message, true);
    }
}

function loadFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            parseVendorData(e.target.result);
        } catch (error) {
            showStatus('Error reading file: ' + error.message, true);
        }
    };
    reader.readAsText(file);
}

function parseVendorData(text) {
    try {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
        if (lines.length === 0) throw new Error('File is empty or only contains comments');

        const hasHeader = lines[0].toLowerCase().includes('type');
        const dataLines = hasHeader ? lines.slice(1) : lines;
        if (dataLines.length === 0) throw new Error('No data rows found');

        initializeVendors();

        let hpCount = 0, hybridCount = 0, geoCount = 0;
        let validRows = 0;

        dataLines.forEach((line, index) => {
            if (!line.trim()) return;

            const parts = line.split(',').map(part => part.trim().replace(/"/g, ''));
            if (parts.length < 5) {
                console.warn(`Line ${index + 2}: Skipping, expected 5 columns, got ${parts.length}`);
                return;
            }

            const [type, name, cost, rating1, rating2] = parts;
            const costNum = parseFloat(cost);
            const r1Num = parseFloat(rating1);
            const r2Num = parseFloat(rating2);

            if (isNaN(costNum) || isNaN(r1Num) || isNaN(r2Num) || !name.trim()) {
                console.warn(`Line ${index + 2}: Skipping, invalid data`);
                return;
            }

            validRows++;
            const typeLower = type.toLowerCase();

            if (typeLower.includes('heat') || typeLower.includes('pump')) {
                hpCount++;
                addVendorFromData('hp', hpCount, name, costNum, r1Num, r2Num);
            } else if (typeLower.includes('hybrid')) {
                hybridCount++;
                addVendorFromData('hybrid', hybridCount, name, costNum, r1Num, r2Num);
            } else if (typeLower.includes('geo')) {
                geoCount++;
                addVendorFromData('geo', geoCount, name, costNum, r1Num, r2Num);
            } else {
                console.warn(`Line ${index + 2}: Unknown type "${type}"`);
            }
        });

        if (validRows === 0) throw new Error('No valid data rows found');

        setTimeout(() => calculateAll(), 100);
        showStatus(`Successfully loaded ${hpCount} heat pump, ${hybridCount} hybrid, and ${geoCount} geothermal options.`);
    } catch (error) {
        showStatus('Error parsing file: ' + error.message, true);
    }
}

function addVendorFromData(type, id, name, cost, r1, r2) {
    const containers = {
        'hp': 'heatPumpVendors', 'hybrid': 'hybridVendors', 'geo': 'geothermalVendors'
    };
    const container = document.getElementById(containers[type]);
    const vendorHTML = createVendorHTML(type, id, name, cost, r1, r2);
    container.insertAdjacentHTML('beforeend', vendorHTML);

    if (type === 'hp') heatPumpCounter = Math.max(heatPumpCounter, id);
    else if (type === 'hybrid') hybridCounter = Math.max(hybridCounter, id);
    else geothermalCounter = Math.max(geothermalCounter, id);
}

function exportData() {
        const data = [];
        data.push(['Type', 'Name', 'Cost', 'Rating1', 'Rating2']);

        const collectData = (counter, type) => {
            for (let i = 1; i <= counter; i++) {
                const element = document.getElementById(`${type}Vendor${i}`);
                if (element) {
                    const name = getText(`${type}Name${i}`);
                    const cost = getVal(`${type}Cost${i}`);
                    if (name && cost > 0) {
                        let r1, r2, typeLabel;
                        if (type === 'hp') {
                            r1 = getVal(`hpSEER${i}`);
                            r2 = getVal(`hpHSPF${i}`);
                            typeLabel = 'HeatPump';
                        } else {
                            r1 = getVal(`${type}EER${i}`);
                            r2 = getVal(`${type}COP${i}`);
                            typeLabel = type === 'hybrid' ? 'Hybrid' : 'Geothermal';
                        }
                        data.push([typeLabel, name, cost, r1, r2]);
                    }
                }
            }
        };

        collectData(heatPumpCounter, 'hp');
        collectData(hybridCounter, 'hybrid');
        collectData(geothermalCounter, 'geo');

        const csv = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hvac_analysis_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);

        showStatus('Analysis data exported successfully!');
}

window.onload = function() {
    setTimeout(() => {
        loadExampleData(); // This loads the data and initializes the vendors
        calculateAll();      // This now runs with the data loaded
    }, 200);
};