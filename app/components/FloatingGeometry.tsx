'use client';

import { useEffect, useRef } from 'react';

interface Shape {
  type: 'triangle' | 'square' | 'circle' | 'line';
  x: number;
  y: number;
  size: number;
  rotation: number;
  speedX: number;
  speedY: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

export default function FloatingGeometry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const animationFrameRef = useRef<number>();
  const lastScrollYRef = useRef<number>(0);
  const generatedRegionsRef = useRef<Set<number>>(new Set());
  const generatedGridRowsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to cover full document
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Update canvas height when document height changes and generate shapes for new areas
    const updateCanvasHeight = () => {
      const newHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight);
      if (newHeight > canvas.height) {
        const oldHeight = canvas.height;
        canvas.height = newHeight;
        // Generate shapes only for the truly new area (will skip already-generated rows)
        const newShapes = generateShapesForRegion(oldHeight, newHeight);
        shapesRef.current.push(...newShapes);
      }
    };
    
    // Check document height periodically
    const heightCheckInterval = setInterval(updateCanvasHeight, 500);

    // Grid cell dimensions - shared across all generation functions
    const gridCellWidth = 200;
    const gridCellHeight = 200;

    // Generate shapes for the entire document height with even distribution
    const generateShapesForFullPage = (pageHeight: number): Shape[] => {
      const shapes: Shape[] = [];
      
      // Grid-based distribution for even spacing
      const cols = Math.ceil(canvas.width / gridCellWidth);
      const rows = Math.ceil(pageHeight / gridCellHeight);
      
      // Generate shapes evenly distributed across grid
      const types: Shape['type'][] = ['triangle', 'square', 'circle'];
      let shapeIndex = 0;
      
      for (let row = 0; row < rows; row++) {
        // Mark this row as generated
        generatedGridRowsRef.current.add(row);
        
        for (let col = 0; col < cols; col++) {
          // Place one shape per grid cell with slight random offset
          const baseX = col * gridCellWidth + gridCellWidth / 2;
          const baseY = row * gridCellHeight + gridCellHeight / 2;
          const offsetX = (Math.random() - 0.5) * gridCellWidth * 0.6; // Max 30% offset
          const offsetY = (Math.random() - 0.5) * gridCellHeight * 0.6;
          
          const x = Math.max(0, Math.min(canvas.width, baseX + offsetX));
          const y = Math.max(0, Math.min(pageHeight, baseY + offsetY));
          
          const type = types[shapeIndex % types.length];
          
          shapes.push({
            type,
            x,
            y,
            size: 5 + Math.random() * 7.5, // Small: 5-12.5px
            rotation: Math.random() * Math.PI * 2,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            rotationSpeed: (Math.random() - 0.5) * 0.01,
            opacity: 0.4 + Math.random() * 0.3,
            color: `rgba(255, 255, 255, ${0.5 + Math.random() * 0.4})`,
          });
          
          shapeIndex++;
        }
      }

      // Add connecting lines evenly distributed
      const lineCols = Math.ceil(canvas.width / (gridCellWidth * 1.5));
      const lineRows = Math.ceil(pageHeight / (gridCellHeight * 1.5));
      
      for (let row = 0; row < lineRows; row++) {
        for (let col = 0; col < lineCols; col++) {
          const baseX = col * gridCellWidth * 1.5 + gridCellWidth * 0.75;
          const baseY = row * gridCellHeight * 1.5 + gridCellHeight * 0.75;
          const offsetX = (Math.random() - 0.5) * gridCellWidth * 0.8;
          const offsetY = (Math.random() - 0.5) * gridCellHeight * 0.8;
          
          const x = Math.max(0, Math.min(canvas.width, baseX + offsetX));
          const y = Math.max(0, Math.min(pageHeight, baseY + offsetY));
          
          shapes.push({
            type: 'line',
            x,
            y,
            size: 10 + Math.random() * 10,
            rotation: Math.random() * Math.PI * 2,
            speedX: (Math.random() - 0.5) * 0.15,
            speedY: (Math.random() - 0.5) * 0.15,
            rotationSpeed: (Math.random() - 0.5) * 0.005,
            opacity: 0.3 + Math.random() * 0.2,
            color: `rgba(255, 255, 255, ${0.4 + Math.random() * 0.3})`,
          });
        }
      }

      return shapes;
    };

    // Generate shapes for a specific region (only for new areas when page grows) with even distribution
    const generateShapesForRegion = (regionStart: number, regionEnd: number): Shape[] => {
      const shapes: Shape[] = [];
      const regionHeight = regionEnd - regionStart;
      
      // Calculate which grid rows this region covers
      const startRow = Math.floor(regionStart / gridCellHeight);
      const endRow = Math.ceil(regionEnd / gridCellHeight);
      
      const cols = Math.ceil(canvas.width / gridCellWidth);
      const types: Shape['type'][] = ['triangle', 'square', 'circle'];
      let shapeIndex = 0;
      
      // Only generate shapes for rows that haven't been generated yet
      for (let row = startRow; row < endRow; row++) {
        // Skip if this row was already generated
        if (generatedGridRowsRef.current.has(row)) {
          continue;
        }
        
        // Mark this row as generated
        generatedGridRowsRef.current.add(row);
        
        for (let col = 0; col < cols; col++) {
          // Place one shape per grid cell with slight random offset
          const baseX = col * gridCellWidth + gridCellWidth / 2;
          const baseY = row * gridCellHeight + gridCellHeight / 2;
          const offsetX = (Math.random() - 0.5) * gridCellWidth * 0.6; // Max 30% offset
          const offsetY = (Math.random() - 0.5) * gridCellHeight * 0.6;
          
          const x = Math.max(0, Math.min(canvas.width, baseX + offsetX));
          const y = Math.max(regionStart, Math.min(regionEnd, baseY + offsetY));
          
          const type = types[shapeIndex % types.length];
          
          shapes.push({
            type,
            x,
            y,
            size: 5 + Math.random() * 7.5,
            rotation: Math.random() * Math.PI * 2,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            rotationSpeed: (Math.random() - 0.5) * 0.01,
            opacity: 0.4 + Math.random() * 0.3,
            color: `rgba(255, 255, 255, ${0.5 + Math.random() * 0.4})`,
          });
          
          shapeIndex++;
        }
      }

      // Add connecting lines evenly distributed (only for new rows)
      const lineCols = Math.ceil(canvas.width / (gridCellWidth * 1.5));
      const lineStartRow = Math.floor(regionStart / (gridCellHeight * 1.5));
      const lineEndRow = Math.ceil(regionEnd / (gridCellHeight * 1.5));
      
      for (let row = lineStartRow; row < lineEndRow; row++) {
        for (let col = 0; col < lineCols; col++) {
          const baseX = col * gridCellWidth * 1.5 + gridCellWidth * 0.75;
          const baseY = row * gridCellHeight * 1.5 + gridCellHeight * 0.75;
          
          // Only add if this line is in the new region
          if (baseY >= regionStart && baseY <= regionEnd) {
            const offsetX = (Math.random() - 0.5) * gridCellWidth * 0.8;
            const offsetY = (Math.random() - 0.5) * gridCellHeight * 0.8;
            
            const x = Math.max(0, Math.min(canvas.width, baseX + offsetX));
            const y = Math.max(regionStart, Math.min(regionEnd, baseY + offsetY));
            
            shapes.push({
              type: 'line',
              x,
              y,
              size: 10 + Math.random() * 10,
              rotation: Math.random() * Math.PI * 2,
              speedX: (Math.random() - 0.5) * 0.15,
              speedY: (Math.random() - 0.5) * 0.15,
              rotationSpeed: (Math.random() - 0.5) * 0.005,
              opacity: 0.3 + Math.random() * 0.2,
              color: `rgba(255, 255, 255, ${0.4 + Math.random() * 0.3})`,
            });
          }
        }
      }

      return shapes;
    };

    // Initial generation for full page
    const initialPageHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    shapesRef.current = generateShapesForFullPage(initialPageHeight);

    // Draw functions
    const drawTriangle = (shape: Shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.beginPath();
      ctx.moveTo(0, -shape.size / 2);
      ctx.lineTo(-shape.size / 2, shape.size / 2);
      ctx.lineTo(shape.size / 2, shape.size / 2);
      ctx.closePath();
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = shape.opacity;
      ctx.stroke();
      ctx.restore();
    };

    const drawSquare = (shape: Shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = shape.opacity;
      ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      ctx.restore();
    };

    const drawCircle = (shape: Shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.beginPath();
      ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = shape.opacity;
      ctx.stroke();
      ctx.restore();
    };

    const drawLine = (shape: Shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.beginPath();
      ctx.moveTo(-shape.size / 2, 0);
      ctx.lineTo(shape.size / 2, 0);
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = shape.opacity;
      ctx.stroke();
      ctx.restore();
    };

    // Handle scroll - only update canvas height, don't generate shapes on scroll
    // Shapes are only generated when page height actually increases
    const handleScroll = () => {
      const currentPageHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight);
      
      // Update canvas height if page grew
      if (currentPageHeight > canvas.height) {
        const oldHeight = canvas.height;
        canvas.height = currentPageHeight;
        // Generate shapes only for the truly new area
        const newShapes = generateShapesForRegion(oldHeight, currentPageHeight);
        shapesRef.current.push(...newShapes);
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      shapesRef.current.forEach((shape) => {
        // Update position
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        // Wrap around horizontal edges
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;

        // Draw all shapes relative to scroll position (with buffer for smooth scrolling)
        const viewportTop = scrollY - viewportHeight;
        const viewportBottom = scrollY + viewportHeight * 2;
        
        if (shape.y >= viewportTop && shape.y <= viewportBottom) {
          // Draw shape relative to scroll position
          const drawY = shape.y - scrollY;
          
          // Only draw if in visible viewport
          if (drawY >= -viewportHeight && drawY <= viewportHeight * 2) {
            // Draw shape
            switch (shape.type) {
              case 'triangle':
                drawTriangle({ ...shape, y: drawY });
                break;
              case 'square':
                drawSquare({ ...shape, y: drawY });
                break;
              case 'circle':
                drawCircle({ ...shape, y: drawY });
                break;
              case 'line':
                drawLine({ ...shape, y: drawY });
                break;
            }
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    
    // Initial scroll position
    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle mouse hover - slightly increase opacity of nearby shapes
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY + window.scrollY; // Account for scroll position
      const hoverRadius = 150;

      shapesRef.current.forEach((shape) => {
        const distance = Math.sqrt(
          Math.pow(shape.x - mouseX, 2) + Math.pow(shape.y - mouseY, 2)
        );

        if (distance < hoverRadius) {
          // Temporarily increase opacity on hover
          const originalOpacity = shape.opacity;
          const hoverOpacity = Math.min(originalOpacity * 2, 0.6);
          shape.opacity = hoverOpacity;
          
          // Reset after a short delay
          setTimeout(() => {
            shape.opacity = originalOpacity;
          }, 100);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(heightCheckInterval);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
}

