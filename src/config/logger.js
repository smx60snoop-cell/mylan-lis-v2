export const log = {
    info: (...args) => console.log("ℹ️", ...args),
    success: (...args) => console.log("✅", ...args),
    warn: (...args) => console.warn("⚠️", ...args),
    error: (...args) => console.error("❌", ...args)
};
