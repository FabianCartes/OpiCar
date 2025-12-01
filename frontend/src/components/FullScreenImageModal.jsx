import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const FullScreenImageModal = ({ isOpen, onClose, images, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            resetZoom();
        }
    }, [isOpen, initialIndex]);

    if (!isOpen || !images || images.length === 0) return null;

    const currentImage = images[currentIndex];

    const nextPhoto = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
        resetZoom();
    };

    const prevPhoto = (e) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        resetZoom();
    };

    const resetZoom = () => {
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleWheel = (e) => {
        e.stopPropagation();
        const delta = e.deltaY * -0.01;
        const newZoom = Math.min(Math.max(1, zoomLevel + delta), 4);
        setZoomLevel(newZoom);
        if (newZoom === 1) setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (zoomLevel > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoomLevel > 1) {
            e.preventDefault();
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden animate-fade-in"
            onWheel={handleWheel}
        >
            <div className="absolute top-4 right-4 z-50 flex gap-4">
                <button
                    onClick={onClose}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                    <X className="h-8 w-8" />
                </button>
            </div>

            <div
                className="relative w-full h-full flex items-center justify-center cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <img
                    src={currentImage.url || currentImage} // Handle both object with url property and direct string url
                    alt={`Full screen photo ${currentIndex + 1}`}
                    className="max-w-none transition-transform duration-100 ease-out"
                    style={{
                        transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                        cursor: zoomLevel > 1 ? 'grab' : 'default',
                        maxHeight: '100vh',
                        maxWidth: '100vw',
                        objectFit: 'contain'
                    }}
                    draggable={false}
                />
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={prevPhoto}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-50"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                    <button
                        onClick={nextPhoto}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-50"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>
                </>
            )}

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white">
                {currentIndex + 1} / {images.length}
            </div>
        </div>,
        document.body
    );
};

export default FullScreenImageModal;
