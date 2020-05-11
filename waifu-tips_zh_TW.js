/*
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

function loadWidget(waifuPath, apiPath) {
	localStorage.removeItem("waifu-display");
	sessionStorage.removeItem("waifu-text");
	document.body.insertAdjacentHTML("beforeend", `<div id="waifu" style="z-index: 1000; width: 300px; height: 300px;">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="300" height="300"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-paper-plane"></span>
				<span class="fa fa-lg fa-user-circle"></span>
				<span class="fa fa-lg fa-street-view"></span>
				<span class="fa fa-lg fa-camera-retro"></span>
				<span class="fa fa-lg fa-info-circle"></span>
				<span class="fa fa-lg fa-times"></span>
			</div>
		</div>`);

  	// Make the DIV element draggable:
	dragElement();

	// https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
	setTimeout(() => {
		document.getElementById("waifu").style.bottom = 0;
	}, 0);

	function registerEventListener() {
		document.querySelector("#waifu-tool .fa-comment").addEventListener("click", showHitokoto);
		document.querySelector("#waifu-tool .fa-paper-plane").addEventListener("click", () => {
			if (window.Asteroids) {
				if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
				window.ASTEROIDSPLAYERS.push(new Asteroids());
			} else {
				var script = document.createElement("script");
				script.src = "https://cdn.jsdelivr.net/gh/GalaxyMimi/CDN/asteroids.js";
				document.head.appendChild(script);
			}
		});
		document.querySelector("#waifu-tool .fa-user-circle").addEventListener("click", loadOtherModel);
		document.querySelector("#waifu-tool .fa-street-view").addEventListener("click", loadRandModel);
		document.querySelector("#waifu-tool .fa-camera-retro").addEventListener("click", () => {
			showMessage("照好了嘛，是不是很可愛呢？", 6000, 9);
			Live2D.captureName = "photo.png";
			Live2D.captureFrame = true;
		});
		document.querySelector("#waifu-tool .fa-info-circle").addEventListener("click", () => {
			open("https://github.com/stevenjoezhang/live2d-widget");
		});
		document.querySelector("#waifu-tool .fa-times").addEventListener("click", () => {
			localStorage.setItem("waifu-display", Date.now());
			showMessage("願你有一天能與重要的人重逢。", 2000, 11);
			document.getElementById("waifu").style.bottom = "-500px";
			setTimeout(() => {
				document.getElementById("waifu").style.display = "none";
				document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
			}, 3000);
		});
		var devtools = () => {};
		console.log("%c", devtools);
		devtools.toString = () => {
			showMessage("哈哈，你打開了控制枱，是想要看看我的小祕密嗎？", 6000, 9);
		};
		window.addEventListener("copy", () => {
			showMessage("你都複製了些什麼呀，轉載要記得加上出處哦！", 6000, 9);
		});
		window.addEventListener("visibilitychange", () => {
			if (!document.hidden) showMessage("哇，你終於回來了～", 6000, 9);
		});
	}
	registerEventListener();

	function welcomeMessage() {
		var text;
		if (location.pathname === "/") { // 如果是主页
			var now = new Date().getHours();
			if (now > 5 && now <= 7) text = "早上好！一日之計在於晨，美好的一天就要開始了。";
			else if (now > 7 && now <= 11) text = "上午好！工作順利嘛，不要久坐，多起來走動走動哦！";
			else if (now > 11 && now <= 13) text = "中午了，工作了一個上午，現在是午餐時間！";
			else if (now > 13 && now <= 17) text = "午後很容易犯困呢，今天的運動目標完成了嗎？";
			else if (now > 17 && now <= 19) text = "傍晚了！窗外夕陽的景色很美麗呢，最美不過夕陽紅～";
			else if (now > 19 && now <= 21) text = "晚上好，今天過得怎麼樣？";
			else if (now > 21 && now <= 23) text = ["已經這麼晚了呀，早點休息吧，晚安～", "深夜時要愛護眼睛呀！"];
			else text = "你是夜貓子呀？這麼晚還不睡覺，明天起的來嘛？";
		} else if (document.referrer !== "") {
			var referrer = new URL(document.referrer),
				domain = referrer.hostname.split(".")[1];
			if (location.hostname == referrer.hostname) text = `歡迎收看<span>「${document.title.split(" - ")[0]}」</span>`;
			else if (domain == "baidu") text = `Hello！來自 百度搜索 的朋友<br>你是搜索 <span>${referrer.search.split("&wd=")[1].split("&")[0]}</span> 找到的我嗎？`;
			else if (domain == "so") text = `Hello！來自 360搜索 的朋友<br>你是搜索 <span>${referrer.search.split("&q=")[1].split("&")[0]}</span> 找到的我嗎？`;
			else if (domain == "google") text = `Hello！來自 谷歌搜索 的朋友<br>歡迎閲讀<span>「${document.title.split(" - ")[0]}」</span>`;
			else text = `Hello！來自 <span>${referrer.hostname}</span> 的朋友`;
		} else {
			text = `歡迎閲讀<span>「${document.title.split(" - ")[0]}」</span>`;
		}
		showMessage(text, 7000, 8);
	}
	welcomeMessage();
	// 检测用户活动状态，并在空闲时显示消息
	var userAction = false,
		userActionTimer = null,
		messageTimer = null,
		messageArray = ["好久不見，日子過得好快呢……", "大壞蛋！你都多久沒理人家了呀，嚶嚶嚶～", "嗨～快來逗我玩吧！", "拿小拳拳錘你胸口！", "記得把小家加入 Adblock 白名單哦！"];
	window.addEventListener("mousemove", () => userAction = true);
	window.addEventListener("keydown", () => userAction = true);
	setInterval(() => {
		if (userAction) {
			userAction = false;
			clearInterval(userActionTimer);
			userActionTimer = null;
		} else if (!userActionTimer) {
			userActionTimer = setInterval(() => {
				showMessage(messageArray[Math.floor(Math.random() * messageArray.length)], 6000, 9);
			}, 20000);
		}
	}, 1000);

	function showHitokoto() {
		// 增加 hitokoto.cn 的 API
		fetch("https://v1.hitokoto.cn")
			.then(response => response.json())
			.then(result => {
				var text = `這句一言來自 <span>「${result.from}」</span>，是 <span>${result.creator}</span> 在 hitokoto.cn 投稿的。`;
				showMessage(result.hitokoto, 6000, 9);
				setTimeout(() => {
					showMessage(text, 4000, 9);
				}, 6000);
			});
	}

	function showMessage(text, timeout, priority) {
		if (!text) return;
		if (!sessionStorage.getItem("waifu-text") || sessionStorage.getItem("waifu-text") <= priority) {
			if (messageTimer) {
				clearTimeout(messageTimer);
				messageTimer = null;
			}
			if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length)];
			sessionStorage.setItem("waifu-text", priority);
			var tips = document.getElementById("waifu-tips");
			tips.innerHTML = text;
			tips.classList.add("waifu-tips-active");
			messageTimer = setTimeout(() => {
				sessionStorage.removeItem("waifu-text");
				tips.classList.remove("waifu-tips-active");
			}, timeout);
		}
	}

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function initModel() {
		var modelId = 4 //localStorage.getItem("modelId"),
			modelTexturesId = getRandomInt(1, 156) //localStorage.getItem("modelTexturesId");
		if (modelId == null) {
			// 首次访问加载 指定模型 的 指定材质
			var modelId = 1, // 模型 ID
				modelTexturesId = 53; // 材质 ID
		}
		loadModel(modelId, modelTexturesId);
		fetch(waifuPath)
			.then(response => response.json())
			.then(result => {
				result.mouseover.forEach(tips => {
					window.addEventListener("mouseover", event => {
						if (!event.target.matches(tips.selector)) return;
						var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
						text = text.replace("{text}", event.target.innerText);
						showMessage(text, 4000, 8);
					});
				});
				result.click.forEach(tips => {
					window.addEventListener("click", event => {
						if (!event.target.matches(tips.selector)) return;
						var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
						text = text.replace("{text}", event.target.innerText);
						showMessage(text, 4000, 8);
					});
				});
				result.seasons.forEach(tips => {
					var now = new Date(),
						after = tips.date.split("-")[0],
						before = tips.date.split("-")[1] || after;
					if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
						var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
						text = text.replace("{year}", now.getFullYear());
						//showMessage(text, 7000, true);
						messageArray.push(text);
					}
				});
			});
	}
	initModel();

	function loadModel(modelId, modelTexturesId) {
		localStorage.setItem("modelId", modelId);
		if (modelTexturesId === undefined) modelTexturesId = 0;
		localStorage.setItem("modelTexturesId", modelTexturesId);
		loadlive2d("live2d", `${apiPath}/get/?id=${modelId}-${modelTexturesId}`, console.log(`Live2D 模型 ${modelId}-${modelTexturesId} 加載完成`));
	}

	function loadRandModel() {
		var modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
		// 可选 "rand"(随机), "switch"(顺序)
		fetch(`${apiPath}/rand_textures/?id=${modelId}-${modelTexturesId}`)
			.then(response => response.json())
			.then(result => {
				if (result.textures.id == 1 && (modelTexturesId == 1 || modelTexturesId == 0)) showMessage("我還沒有其他衣服呢！", 4000, 10);
				else showMessage("我的新衣服好看嘛？", 4000, 10);
				loadModel(modelId, result.textures.id);
			});
	}

	function loadOtherModel() {
		var modelId = localStorage.getItem("modelId");
		fetch(`${apiPath}/switch/?id=${modelId}`)
			.then(response => response.json())
			.then(result => {
				loadModel(result.model.id);
				showMessage(result.model.message, 4000, 10);
			});
	}
}

function initWidget(waifuPath = "/waifu-tips.json", apiPath = "") {
	if (screen.width <= 768) return;
	document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle">
			<span>看板娘</span>
		</div>`);
	var toggle = document.getElementById("waifu-toggle");
	toggle.addEventListener("click", () => {
		toggle.classList.remove("waifu-toggle-active");
		if (toggle.getAttribute("first-time")) {
			loadWidget(waifuPath, apiPath);
			toggle.removeAttribute("first-time");
		} else {
			localStorage.removeItem("waifu-display");
			document.getElementById("waifu").style.display = "";
			setTimeout(() => {
				document.getElementById("waifu").style.bottom = 0;
			}, 0);
		}
	});
	if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 86400000) {
		toggle.setAttribute("first-time", true);
		setTimeout(() => {
			toggle.classList.add("waifu-toggle-active");
		}, 0);
	} else {
		loadWidget(waifuPath, apiPath);
	}
}

// Make the DIV element draggable:
function dragElement() {
  var elmnt = document.getElementById("waifu");
  console.log({elmnt});
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById("live2d")) {
	/* if present, the header is where you move the DIV from:*/
	document.getElementById("live2d").onmousedown = dragMouseDown;
  } else {
	/* otherwise, move the DIV from anywhere inside the DIV:*/
	elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
	e = e || window.event;
	e.preventDefault();
	// get the mouse cursor position at startup:
	pos3 = e.clientX;
	pos4 = e.clientY;
	document.onmouseup = closeDragElement;
	// call a function whenever the cursor moves:
	document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
	e = e || window.event;
	e.preventDefault();
	// calculate the new cursor position:
	pos1 = pos3 - e.clientX;
	pos2 = pos4 - e.clientY;
	pos3 = e.clientX;
	pos4 = e.clientY;
	// set the element's new position:
	elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
	/* stop moving when mouse button is released:*/
	document.onmouseup = null;
	document.onmousemove = null;
  }
}