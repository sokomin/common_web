let selectedTimezone_tmp = 9 * 60;
let timezoneOffset = 9 * 60 * 60 * 1000;

// Update function to handle separate date and time fields
const updateFields = (timestamp) => {
	const date = new Date(timestamp);
	document.getElementById('timestamp_ms').value = timestamp;
	document.getElementById('timestamp_s').value = Math.floor(timestamp / 1000);
	document.getElementById('year').value = date.getFullYear();
	document.getElementById('month').value = date.getMonth() + 1;
	document.getElementById('day').value = date.getDate();
	document.getElementById('hour').value = date.getHours();
	document.getElementById('minute').value = date.getMinutes();
	document.getElementById('second').value = date.getSeconds();
};

// Add event listeners for the new fields
const dateFields = ['year', 'month', 'day', 'hour', 'minute', 'second'];
dateFields.forEach(id => {
	document.getElementById(id).addEventListener('input', function () {
		const year = parseInt(document.getElementById('year').value) || 0;
		const month = parseInt(document.getElementById('month').value) - 1 || 0;
		const day = parseInt(document.getElementById('day').value) || 0;
		const hour = parseInt(document.getElementById('hour').value) || 0;
		const minute = parseInt(document.getElementById('minute').value) || 0;
		const second = parseInt(document.getElementById('second').value) || 0;
		const date = new Date(year, month, day, hour, minute, second);
		const timestamp = date.getTime();
		updateFields(timestamp);
	});
});

document.getElementById('timestamp_ms').addEventListener('input', function () {
	const timestamp = parseInt(this.value) || 0;
	updateFields(timestamp);
});

document.getElementById('timestamp_s').addEventListener('input', function () {
	const timestamp = (parseInt(this.value) || 0) * 1000;
	updateFields(timestamp);
});

// Populate the timezone selector
const timezoneSelect = document.getElementById('timezone');

// Update fields based on selected timezone
const updateTimezone = () => {
	const selectedTimezone = parseInt(timezoneSelect.value);
	const currentTimestamp = parseInt(document.getElementById('timestamp_ms').value);
	const newTimezoneOffset = (selectedTimezone - selectedTimezone_tmp) * 60 * 1000; // Convert to milliseconds
	updateFields(currentTimestamp + newTimezoneOffset);
	selectedTimezone_tmp = selectedTimezone;
};

// Initialize the timezone selector and add event listener
timezoneSelect.addEventListener('change', updateTimezone);
//JSTで上書き
const now = new Date(new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })).getTime()
updateFields(now);
