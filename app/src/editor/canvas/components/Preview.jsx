import React, { useMemo } from 'react'
import { defaultModuleLayout } from '../state'
import { isModuleResizable } from './Resizer'

function aspectSize({ width, height, minWidth, minHeight }) {
    const ratio = Math.max(minWidth / width, minHeight / height)
    return {
        width: Math.round(width * ratio * 100) / 100,
        height: Math.round(height * ratio * 100) / 100,
    }
}

function ModulePreview({
    x,
    y,
    height,
    width,
    titleWidth,
}) {
    x = Math.round(x)
    y = Math.round(y)
    width = Math.round(width)
    height = Math.round(height)

    const um = 16 // pseudo 'grid' unit
    const titleMaxWidth = width - (2 * um)
    const titleActualWidth = Math.min(titleWidth * um, titleMaxWidth)
    return (
        <React.Fragment>
            <g>
                <rect
                    x={x}
                    y={y}
                    height={height}
                    width={width}
                    fill="#FCFBF9"
                    rx="0.2%"
                    stroke="#EFEFEF"
                    strokeWidth="0.5px"
                    vectorEffect="non-scaling-stroke"
                />
                <rect
                    x={x + um}
                    y={y + um}
                    width={titleActualWidth}
                    height={um * 1.3}
                    fill="#D8D8D8"
                    rx="0.2%"
                />
                <path
                    stroke="#EFEFEF"
                    strokeLinecap="square"
                    strokeWidth="0.5px"
                    vectorEffect="non-scaling-stroke"
                    d={`M${x},${y + (um * 3.333)} H${x + width}`}
                />
            </g>
        </React.Fragment>
    )
}

const defaultLayout = {
    height: Number.parseInt(defaultModuleLayout.height, 10),
    width: Number.parseInt(defaultModuleLayout.width, 10),
}

function getPortRows({ inputs = [], outputs = [], params = [] }) {
    return Math.max(inputs.length + params.length, outputs.length)
}

function getPreviewCanvas({ canvas, aspect, screen }) {
    // grab basic module dimensions
    const modulePreviews = canvas.modules.map((m) => ({
        key: `${m.id}-${m.hash}`,
        top: Number.parseInt(m.layout.position.top, 10) || 0,
        left: Number.parseInt(m.layout.position.left, 10) || 0,
        height: Number.parseInt(m.layout.height, 10) || defaultLayout.height,
        width: Number.parseInt(m.layout.width, 10) || defaultLayout.width,
        isResizable: isModuleResizable(m),
        portRows: getPortRows(m),
        titleWidth: (m.displayName || m.name).length,
    }))
        .map((m) => (
            // set sensible min-height on non-resizable modules using number of ports
            Object.assign(m, {
                height: m.isResizable ? m.height : Math.max(m.height, defaultLayout.height + (m.portRows * 30)),
            })
        ))

    // find bounds of modules
    const bounds = modulePreviews.reduce((b, m) => (
        Object.assign(b, {
            maxX: Math.max(b.maxX, m.left + m.width),
            maxY: Math.max(b.maxY, m.top + m.height),
            minX: Math.min(b.minX, m.left),
            minY: Math.min(b.minY, m.top),
        })
    ), {
        maxX: -Infinity,
        maxY: -Infinity,
        minX: Infinity,
        minY: Infinity,
    })

    const ratio = aspect.height / aspect.width

    // set a minimum canvas size so a single module doesn't take up entire preview
    const minWidth = Math.max(bounds.maxX, screen.width || screen.height * (1 / ratio))
    const minHeight = Math.max(bounds.maxY, screen.height || screen.width * ratio)

    // force dimensions to fit aspect
    const canvasSize = aspectSize({
        height: aspect.height,
        width: aspect.width,
        minHeight,
        minWidth,
    })

    return {
        width: canvasSize.width,
        height: canvasSize.height,
        modules: modulePreviews,
        bounds,
        minWidth,
        minHeight,
    }
}

export default function Preview({
    className,
    style,
    canvas,
    aspect,
    screen,
    ...props
}) {
    const preview = useMemo(() => (
        getPreviewCanvas({
            canvas,
            aspect,
            screen,
        })
    ), [canvas, aspect, screen])

    return (
        <svg
            className={className}
            preserveAspectRatio="none"
            viewBox={`0 0 ${aspect.width} ${aspect.height}`}
            style={{
                ...style,
                background: '#e7e7e7',
                padding: '8px',
            }}
            {...props}
        >
            <rect
                x="0"
                y="0"
                height="100%"
                width="100%"
                fill="#e7e7e7"
            />
            <svg
                className={className}
                preserveAspectRatio="none"
                viewBox={`0 0 ${preview.width} ${preview.height}`}
            >
                {preview.modules.map((m) => (
                    <ModulePreview
                        key={m.key}
                        y={m.top}
                        x={m.left}
                        width={m.width}
                        height={m.height}
                        titleWidth={m.titleWidth}
                    />
                ))}

            </svg>
        </svg>
    )
}

Preview.defaultProps = {
    aspect: {
        width: 318,
        height: 200,
    },
    screen: {
        width: 1680,
        // calculate height based on aspect
    },
}
