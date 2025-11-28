// Convert Leaflet or GeoJSON geometry to WKT format
export const geoJSONToWKT = (geometry) => {
    if (!geometry) return null;

    const { type, coordinates } = geometry;

    const formatCoords = (coords) =>
        coords.map(pair => pair.join(" ")).join(", ");

    if (type === "Polygon") {
        const rings = coordinates[0].map(c => c.join(" ")).join(", ");
        return `POLYGON((${rings}))`;
    }

    if (type === "MultiPolygon") {
        const polys = coordinates
            .map(poly => `(${poly[0].map(c => c.join(" ")).join(", ")})`)
            .join(", ");
        return `MULTIPOLYGON(${polys})`;
    }

    return null;
};

// Parse WKT to basic coordinates array
export const wktToCoords = (wkt) => {
    if (!wkt) return [];

    let cleaned = wkt.replace(/POLYGON|\(|\)|MULTIPOLYGON/gi, "").trim();
    let parts = cleaned.split(",");

    return parts.map(p => {
        const [lng, lat] = p.trim().split(" ");
        return [parseFloat(lng), parseFloat(lat)];
    });
};
