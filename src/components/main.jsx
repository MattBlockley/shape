import React, { useState } from 'react';
import useWindowDimensions from './hooks/window';

const Main = () => {
    const dimensions = useWindowDimensions();
    const [sides, setSides] = useState(parseInt(3));
    const [size, setSize] = useState(parseInt(50));
    const [color, setColor] = useState('#ffffff');
    const svgHeight = Math.max(0, dimensions.height - 200);
    const createAttributes = (sides, size) => {
        const length = 100;
        const parts = [{x: (sides & 1) === 1 ? length / 2 : 0, y: 0}];
        const boundaries = {maxX: 0, maxY: 0, minX: Number.POSITIVE_INFINITY, minY: Number.POSITIVE_INFINITY};
        const internalAngle = (sides - 2) * 180 / sides;

        for (let i = 0; i < sides; i++) {
            let angle = 0;

            if (sides & 1) {
                angle = 360 - internalAngle - (internalAngle / (sides - 2)) + ((360 / sides) * i);
            } else {
                angle = 360 - internalAngle + ((360 / sides) * i);
            }

            angle *= Math.PI / 180 * -1;

            const x = length * Math.cos(angle) + parts[i].x;
            const y = length * Math.sin(angle) + parts[i].y;

            boundaries.maxX = Math.max(x, boundaries.maxX);
            boundaries.maxY = Math.max(y, boundaries.maxY);
            boundaries.minX = Math.min(x, boundaries.minX);
            boundaries.minY = Math.min(y, boundaries.minY);

            parts.push({x, y});
        }

        const height = boundaries.maxY - boundaries.minY;
        const translateX = dimensions.width / 2 - length / 2;
        const translateY = svgHeight / 2 - height / 2;
        const scale = size / 100 * svgHeight / height;
        const d = parts.reduce((path, part, index) => {
            if (index === 0) {
                path += `M${part.x} ${part.y}`;
            } else {
                path += `l${part.x - parts[index - 1].x} ${part.y - parts[index - 1].y}`; 
            }

            return path;
        }, '');

        return {d, transform: `translate(${translateX}, ${translateY}) scale(${scale})`, fill: color};
    }
    const createName = sides => {
        const ones = ['', 'hena', 'di', 'tri', 'tetra', 'penta', 'hexa', 'septa', 'octa', 'ennea', 'deca', 'hendeca', 'dodeca', 'triskaideca', 'tetradeca', 'pentadeca', 'hexadeca', 'heptadeca', 'octadeca', 'enneadeca', 'icosa'];
        const tens = ['', 'deca', 'icosi', 'triaconta', 'tetraconta', 'pentaconta'];

        if (sides <= 20) {
            return `${ones[sides]}gon`;
        } else if (sides % 10 === 0) {
            return `${tens[Math.floor(sides / 10)]}gon`;
        } else {
            return `${tens[Math.floor(sides / 10)]}kai${ones[sides % 10]}gon`;
        }
    }
    const shapeName = createName(sides);

    return (
        <div className="outer">
            <div className="shape-name">{shapeName}</div>
            <svg width={dimensions.width} height={svgHeight}>
                <path {...createAttributes(sides, size)} />
            </svg>
            <div>
                <label htmlFor="sides">Sides: </label>
                <input type="range" min="3" max="50" id="sides" value={sides} onInput={({ target }) => setSides(parseInt(target.value))} />
                <span>{sides}</span>
            </div>
            <div>
                <label htmlFor="size">Size: </label>
                <input type="range" min="10" max="100" id="size" value={size} onInput={({ target }) => setSize(parseInt(target.value))} />
                <span>{size}</span>
            </div>
            <div>
                <label htmlFor="color">Color: </label>
                <input type="color" id="color" value={color} onInput={({ target }) => setColor(target.value)} />
                <span>{color}</span>
            </div>
        </div>
    )
}

export default Main;