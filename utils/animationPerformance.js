export class AnimationPerformanceManager {
	constructor() {
		this.frameId = null;
		this.isThrottling = false;
		this.pendingTasks = new Set();
		this.taskQueue = [];
	}

	scheduleTask(task, priority = "normal") {
		return new Promise((resolve) => {
			const taskWrapper = {
				task,
				priority,
				resolve,
				id: Math.random().toString(36).substr(2, 9),
			};

			this.taskQueue.push(taskWrapper);
			this.pendingTasks.add(taskWrapper.id);

			if (!this.frameId) {
				this.frameId = requestAnimationFrame(() => this.processTasks());
			}
		});
	}

	processTasks() {
		this.taskQueue.sort((a, b) => {
			const priorities = { high: 3, normal: 2, low: 1 };
			return priorities[b.priority] - priorities[a.priority];
		});

		const batchSize = Math.min(this.taskQueue.length, 5);
		const batch = this.taskQueue.splice(0, batchSize);

		batch.forEach(({ task, resolve, id }) => {
			try {
				const result = task();
				resolve(result);
			} catch (error) {
				resolve(null);
			}
			this.pendingTasks.delete(id);
		});

		if (this.taskQueue.length > 0) {
			this.frameId = requestAnimationFrame(() => this.processTasks());
		} else {
			this.frameId = null;
		}
	}

	debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func.apply(this, args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	throttle(func, limit) {
		let inThrottle;
		return function executedFunction(...args) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}

	createEventManager() {
		const listeners = new Map();

		return {
			add(element, event, handler, options = {}) {
				const key = `${element}_${event}`;
				if (listeners.has(key)) {
					this.remove(element, event);
				}

				element.addEventListener(event, handler, options);
				listeners.set(key, { element, event, handler });
			},

			remove(element, event) {
				const key = `${element}_${event}`;
				const listener = listeners.get(key);
				if (listener) {
					listener.element.removeEventListener(
						listener.event,
						listener.handler
					);
					listeners.delete(key);
				}
			},

			removeAll() {
				listeners.forEach(({ element, event, handler }) => {
					element.removeEventListener(event, handler);
				});
				listeners.clear();
			},
		};
	}

	createOptimizedObserver(callback, options = {}) {
		const defaultOptions = {
			rootMargin: "300px",
			threshold: 0.01,
			...options,
		};

		let observer = null;
		const observedElements = new WeakSet();

		return {
			observe(element) {
				if (observedElements.has(element)) return;

				if (!observer) {
					observer = new IntersectionObserver((entries) => {
						this.scheduleTask(() => {
							entries.forEach(callback);
						}, "high");
					}, defaultOptions);
				}

				observer.observe(element);
				observedElements.add(element);
			},

			unobserve(element) {
				if (observer && observedElements.has(element)) {
					observer.unobserve(element);
					observedElements.delete(element);
				}
			},

			disconnect() {
				if (observer) {
					observer.disconnect();
					observer = null;
				}
			},
		};
	}

	cleanup() {
		if (this.frameId) {
			cancelAnimationFrame(this.frameId);
			this.frameId = null;
		}

		this.taskQueue = [];
		this.pendingTasks.clear();
		this.isThrottling = false;
	}
}

export const performanceManager = new AnimationPerformanceManager();

export const deviceUtils = {
	_cache: new Map(),
	_cacheTime: new Map(),
	CACHE_DURATION: 1000,

	getCached(key, getter) {
		const now = Date.now();
		const cachedTime = this._cacheTime.get(key);

		if (cachedTime && now - cachedTime < this.CACHE_DURATION) {
			return this._cache.get(key);
		}

		const value = getter();
		this._cache.set(key, value);
		this._cacheTime.set(key, now);

		return value;
	},

	isDesktop() {
		return this.getCached("isDesktop", () => {
			if (!import.meta.client) return false;

			const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
			const isLargeScreen = window.innerWidth >= 1024;

			return !hasTouch && isLargeScreen;
		});
	},

	isMobile() {
		return this.getCached("isMobile", () => {
			if (!import.meta.client) return false;

			const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
			const isSmallScreen = window.innerWidth < 768;

			return hasTouch || isSmallScreen;
		});
	},

	clearCache() {
		this._cache.clear();
		this._cacheTime.clear();
	},
};

export const animationPresets = {
	click: {
		scale: 0.97,
		duration: 0.2,
		ease: "power2.out",
		return: {
			scale: 1,
			duration: 0.8,
			ease: "elastic.out(1, 0.25)",
		},
	},

	magnetic: {
		intensity: 0.15,
		duration: 1.2,
		ease: "power2.out",
		return: {
			duration: 1.6,
			ease: "elastic.out(1, 0.3)",
		},
	},

	entrance: {
		duration: 0.6,
		ease: "power2.out",
		stagger: 0.1,
	},
};
