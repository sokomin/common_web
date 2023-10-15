
const container = document.body;
let currentRadius = 400;
let currentX = 400;
let currentY = 400;
let circles = [];

function drawCircle(radius, x, y) {
	const circle = document.createElement('div');
	circle.classList.add('circle');
	circle.style.width = `${radius * 2}px`;
	circle.style.height = `${radius * 2}px`;
	circle.style.left = `${x - radius}px`;
	circle.style.top = `${y - radius}px`;
	container.appendChild(circle);
	circles.push(circle);
	return circle;
}

function getRandomOffset(maxOffset) {
	return Math.random() * (2 * maxOffset) - maxOffset;
}

drawCircle(currentRadius, currentX, currentY);
while (currentRadius > 0) {
	currentRadius -= 40;
	currentX += getRandomOffset(32);
	currentY += getRandomOffset(32);
	drawCircle(currentRadius, currentX, currentY);
}

// 最終安置はこの辺りにある

// アニメーションの適用
circles[0].style.opacity = 1;
circles[1].style.opacity = 1;

// Apply the animation
circles.forEach((circle, index, arr) => {
	if (index !== arr.length - 1) {
		setTimeout(() => {
			circle.style.left = `${arr[index + 1].style.left}`;
			circle.style.top = `${arr[index + 1].style.top}`;
			circle.style.width = `${arr[index + 1].style.width}`;
			circle.style.height = `${arr[index + 1].style.height}`;
			setTimeout(() => {
				circle.style.opacity = 0;
				if (index + 2 < arr.length) {
					arr[index + 2].style.opacity = 1;
				}
			}, 10000);
		}, 20000 + index * 30000);
	}
});
