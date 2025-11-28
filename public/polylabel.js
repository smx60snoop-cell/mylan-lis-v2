(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.polylabel = factory());
}(this, (function () { 'use strict';

    function polylabel(polygon, precision, debug) {
        precision = precision || 1.0;

        // Validate input
        if (!polygon || !polygon.length || !polygon[0] || !polygon[0].length) {
            throw new Error('Invalid polygon: must be a non-empty array of rings');
        }

        // find the bounding box of the outer ring
        var minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;

        for (var i = 0; i < polygon[0].length; i++) {
            var p = polygon[0][i];
            if (!p || p.length < 2) continue;
            if (p[0] < minX) minX = p[0];
            if (p[1] < minY) minY = p[1];
            if (p[0] > maxX) maxX = p[0];
            if (p[1] > maxY) maxY = p[1];
        }

        // Handle case where all points are the same or invalid
        if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
            return polygon[0][0] || [0, 0];
        }

        var width = maxX - minX;
        var height = maxY - minY;
        var cellSize = Math.min(width, height);
        var h = cellSize / 2;

        if (cellSize === 0) {
            return [minX, minY];
        }

        // a priority queue of cells in order of their "potential" (max distance to polygon)
        var cellQueue = new Queue(undefined, compareMax);

        // cover polygon with initial cells
        for (var x = minX; x < maxX; x += cellSize) {
            for (var y = minY; y < maxY; y += cellSize) {
                cellQueue.push(new Cell(x + h, y + h, h, polygon));
            }
        }

        // take out the best cell from the queue
        var bestCell = getBestCell(cellQueue, polygon);
        if (!bestCell) return [minX, minY];

        // special case for rectangular polygons
        var bBoxCell = new Cell(minX + width / 2, minY + height / 2, 0, polygon);
        if (bBoxCell.d > bestCell.d) {
            bestCell = bBoxCell;
        }

        var numProbes = cellQueue.length;
        var maxProbes = debug ? 10000 : 2000; // Increased limit for complex polygons
        
        while (cellQueue.length && numProbes < maxProbes) {
            // pick the most promising cell from the queue
            var cell = cellQueue.pop();

            // update the best cell if we found a better one
            if (cell.d > bestCell.d) {
                bestCell = cell;
                if (debug) console.log('found best %f after %d probes', cell.d, numProbes);
            }

            // do not drill down further if there's no chance of a better solution
            if (cell.max - bestCell.d <= precision) continue;

            // split the cell into four cells
            h = cell.h / 2;
            if (h > precision / 10) { // Prevent infinite recursion with very small cells
                cellQueue.push(new Cell(cell.x - h, cell.y - h, h, polygon));
                cellQueue.push(new Cell(cell.x + h, cell.y - h, h, polygon));
                cellQueue.push(new Cell(cell.x - h, cell.y + h, h, polygon));
                cellQueue.push(new Cell(cell.x + h, cell.y + h, h, polygon));
                numProbes += 4;
            }
        }

        if (debug) {
            console.log('num probes: ' + numProbes);
            console.log('best distance: ' + bestCell.d);
            console.log('best cell: ' + bestCell.x + ', ' + bestCell.y);
        }

        return [bestCell.x, bestCell.y];
    }

    function compareMax(a, b) {
        return b.max - a.max;
    }

    function getBestCell(cellQueue, polygon) {
        if (cellQueue.length === 0) return null;
        
        var bestCell = cellQueue.peek(); // Start with the first cell
        var i = Math.min(cellQueue.length, 10); // Check first 10 cells
        
        while (i-- > 0) {
            var cell = cellQueue.data[i];
            if (cell && pointInPolygon([cell.x, cell.y], polygon)) {
                return cell;
            }
        }
        
        // Fallback: return the cell with highest potential
        return bestCell;
    }

    function Cell(x, y, h, polygon) {
        this.x = x; // cell center x
        this.y = y; // cell center y
        this.h = h; // half the cell size
        this.d = pointToPolygonDist(x, y, polygon); // distance from cell center to polygon
        this.max = this.d + this.h * Math.SQRT2; // max distance to polygon within a cell
        this.p = [x, y];
    }

    // signed distance from point to polygon outline (negative if point is outside)
    function pointToPolygonDist(x, y, polygon) {
        var inside = false;
        var minDistSq = Infinity;

        for (var k = 0; k < polygon.length; k++) {
            var ring = polygon[k];
            if (!ring || ring.length < 3) continue;

            for (var i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
                var a = ring[j];
                var b = ring[i];
                
                if (!a || !b || a.length < 2 || b.length < 2) continue;

                if ((a[1] > y !== b[1] > y) &&
                    (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) {
                    inside = !inside;
                }

                var distSq = getSegDistSq(x, y, a, b);
                if (distSq < minDistSq) {
                    minDistSq = distSq;
                }
            }
        }

        if (minDistSq === Infinity) {
            return 0; // No valid segments found
        }

        return (inside ? 1 : -1) * Math.sqrt(minDistSq);
    }

    function pointInPolygon(p, polygon) {
        if (!p || p.length < 2) return false;
        
        var inside = false;
        for (var k = 0; k < polygon.length; k++) {
            var ring = polygon[k];
            if (!ring || ring.length < 3) continue;
            
            for (var i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
                var a = ring[j];
                var b = ring[i];
                
                if (!a || !b || a.length < 2 || b.length < 2) continue;
                
                if ((a[1] > p[1] !== b[1] > p[1]) &&
                    (p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0])) {
                    inside = !inside;
                }
            }
        }
        return inside;
    }

    // get squared distance from a point to a segment
    function getSegDistSq(px, py, a, b) {
        var x = a[0];
        var y = a[1];
        var dx = b[0] - x;
        var dy = b[1] - y;

        if (dx !== 0 || dy !== 0) {
            var t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);

            if (t > 1) {
                x = b[0];
                y = b[1];
            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        dx = px - x;
        dy = py - y;

        return dx * dx + dy * dy;
    }
    
    function Queue(data, compare) {
        if (!(this instanceof Queue)) return new Queue(data, compare);

        this.data = data ? data.slice() : []; // Create a copy to avoid mutation
        this.length = this.data.length;
        this.compare = compare || defaultCompare;

        if (this.length > 0) {
            for (var i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
        }
    }

    function defaultCompare(a, b) {
        if (a === b) return 0;
        return a < b ? -1 : 1;
    }

    Queue.prototype = {
        push: function (item) {
            if (item === undefined || item === null) return;
            
            this.data.push(item);
            this.length++;
            this._up(this.length - 1);
        },

        pop: function () {
            if (this.length === 0) return undefined;

            var top = this.data[0];
            var bottom = this.data.pop();
            this.length--;

            if (this.length > 0) {
                this.data[0] = bottom;
                this._down(0);
            }

            return top;
        },

        peek: function () {
            return this.data[0];
        },

        _up: function (pos) {
            var data = this.data;
            var compare = this.compare;
            var item = data[pos];

            while (pos > 0) {
                var parent = (pos - 1) >> 1;
                var current = data[parent];
                if (compare(item, current) >= 0) break;
                data[pos] = current;
                pos = parent;
            }

            data[pos] = item;
        },

        _down: function (pos) {
            var data = this.data;
            var compare = this.compare;
            var halfLength = this.length >> 1;
            var item = data[pos];

            while (pos < halfLength) {
                var left = (pos << 1) + 1;
                var right = left + 1;
                var best = data[left];

                if (right < this.length && compare(data[right], best) < 0) {
                    left = right;
                    best = data[right];
                }
                if (compare(best, item) >= 0) break;

                data[pos] = best;
                pos = left;
            }

            data[pos] = item;
        }
    };

    return polylabel;

})));
