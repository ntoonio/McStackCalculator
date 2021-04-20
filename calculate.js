// Generate a units array with the specified stackSize and if blocks should be included (0 = don't include, other int = items per block)
function generateUnits(stackSize, blocks) {
	var u = [{unit: "items", name: "Items", amount: 1}, {unit: "stacks", name: "Stacks", amount: stackSize}, {unit: "shulkerboxes", name: "Shulkerboxes", amount: 27}, {unit: "shulkerbox-chests", name: "Chest of Shulkerboxes", amount: 27}, {unit: "shulkerbox-double-chest", name: "Double Chest of Shulkerboxes", amount: 2}]

	// Optionally add a blocks unit, where a block is crafted out of items of the amount assigned
	if (blocks != 0) {
		u.splice(1, 0, {units: "blocks", name: "Blocks", amount: blocks})
	}

	return u
}

function calculateStacks(value, stackSize = 64, blocks = 0) {
	// Set up the units variable
	const units = generateUnits(stackSize, blocks)

	// Calculate the raw amount of items that can fit in the unit
	function unitItems(i) {
		var f = units[i].amount

		for (let j = i - 1; j >= 0; j--) {
			f *= units[j].amount
		}

		return f
	}

	const unitAmounts = {"_units": units}

	// Start calculating and populating the table
	for (let i = 0; i < units.length; i++) {
		const unit = units[i];

		const f = unitItems(i) // The max amount of raw items that can fit in the unit
		// Calculate the amount of the units the value will fill
		const amount = Math.floor(value / f)

		// The decimals that overflows the unit but doesn't fill completely
		const leftOver = parseFloat((value / f) % 1)
		// Calculate how many percent is filled of the next one of the same unit
		const leftOverPercentage = leftOver < 0.001 ? "<0.1%" : (leftOver * 100).toFixed(1) + "%"

		const unitAmount = {name: unit.name, amount: amount, overflow: {percent: leftOverPercentage}}

		// Iterate the smaller units to calculate the amount of those that is needed
		for (let j = i - 1; j >= 0; j--) {
			// Calculate the amount of the unit that is needed
			const amount = Math.floor((value % unitItems(j + 1)) / (unitItems(j)))

			unitAmount.overflow[units[j].unit] = amount
		}

		unitAmounts[unit.unit] = unitAmount
	}

	return unitAmounts
}
