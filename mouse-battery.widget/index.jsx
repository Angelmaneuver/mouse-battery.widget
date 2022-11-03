import { React }      from 'uebersicht';
import * as Component from './lib/components';

const DEVICE                  = `Magic Mouse`;

const THRESHOLDS              = {
	blue:   70,
	yellow: 40,
};

export const className        = `
	top:  0;
	left: 0;
	svg {
		transform: scale(2);

		&.blue {
			color: #00BFFF;
		}
	
		&.yellow {
			color: #FFEF6C;
		}
	
		&.red {
			color: #DC143C;
		}
	}
`;

export const command          = `ioreg -r -d 1 -k BatteryPercent | egrep '("BatteryPercent"|"Product")'`;

export const refreshFrequency = 5 * 60 * 1000;

export const updateState      = (event, previousState) => {
	if (event.error) {
		return { ...previousState, warning: `We got an error: ${event.error}` };
	}

	const dataSet   = refill(event.output);
	let   className = '';

	if (DEVICE in dataSet) {
		const battery = dataSet[DEVICE];

		if (THRESHOLDS.blue <= battery) {
			className = 'blue';
		} else if (THRESHOLDS.yellow <= battery) {
			className = 'yellow';
		} else {
			className = 'red';
		}
	}

	return { ...previousState, className: className };
}

export const render           = (props, dispatch) => {
	return (
		<React.Fragment>
			<Component.Atoms.Icon.Mouse className = { props.className }/>
		</React.Fragment>
	);
}

function refill(output) {
	const PRODUCT_MATCHER         = /"Product" += +"(.*?)"/;
	const BATTERY_PERCENT_MATCHER = /"BatteryPercent" += +(\d*)/;

	const records = output.split(`\n`);
	const dataSet = {};
	let   name    = '';

	records.forEach((record, index) => {
		if (PRODUCT_MATCHER.exec(record)) {
			name         = PRODUCT_MATCHER.exec(record)[1];
		} else if ('string' === typeof name && 0 < name.length && BATTERY_PERCENT_MATCHER.exec(record)) {
			dataSet[name] = Number(BATTERY_PERCENT_MATCHER.exec(record)[1]);
			name          = ``;
		}
	});

	return dataSet;
}
