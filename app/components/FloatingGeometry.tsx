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

    // Grid cell dimensions - responsive based on viewport width
    // Increased cell sizes to reduce total shape count for better performance
    // Mobile (360px): ~180px cells, Tablet (768px+): ~250px cells, Desktop (1024px+): ~300px cells
    const getGridCellWidth = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth >= 1024) return 300; // Desktop - increased from 200
      if (viewportWidth >= 768) return 250;  // Tablet - increased from 150
      return Math.max(150, Math.min(180, viewportWidth * 0.5)); // Mobile: 50% of viewport, min 150px, max 180px
    };
    const getGridCellHeight = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth >= 1024) return 300; // Desktop - increased from 200
      if (viewportWidth >= 768) return 250;  // Tablet - increased from 150
      return Math.max(150, Math.min(180, viewportWidth * 0.5)); // Mobile: 50% of viewport, min 150px, max 180px
    };

    // Generate shapes for the entire document height with even distribution
    const generateShapesForFullPage = (pageHeight: number): Shape[] => {
      const shapes: Shape[] = [];
      
      // Grid-based distribution for even spacing
      const currentGridCellWidth = getGridCellWidth();
      const currentGridCellHeight = getGridCellHeight();
      const cols = Math.ceil(canvas.width / currentGridCellWidth);
      const rows = Math.ceil(pageHeight / currentGridCellHeight);
      
      // Generate shapes evenly distributed across grid
      const types: Shape['type'][] = ['triangle', 'square', 'circle'];
      let shapeIndex = 0;
      
      for (let row = 0; row < rows; row++) {
        // Mark this row as generated
        generatedGridRowsRef.current.add(row);
        
        for (let col = 0; col < cols; col++) {
          // Place one shape per grid cell with slight random offset
          const baseX = col * currentGridCellWidth + currentGridCellWidth / 2;
          const baseY = row * currentGridCellHeight + currentGridCellHeight / 2;
          const offsetX = (Math.random() - 0.5) * currentGridCellWidth * 0.6; // Max 30% offset
          const offsetY = (Math.random() - 0.5) * currentGridCellHeight * 0.6;
          
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

      // Add connecting lines evenly distributed - reduced frequency for performance
      const lineCols = Math.ceil(canvas.width / (currentGridCellWidth * 2.5)); // Increased spacing from 1.5 to 2.5
      const lineRows = Math.ceil(pageHeight / (currentGridCellHeight * 2.5)); // Increased spacing from 1.5 to 2.5
      
      for (let row = 0; row < lineRows; row++) {
        for (let col = 0; col < lineCols; col++) {
          const baseX = col * currentGridCellWidth * 1.5 + currentGridCellWidth * 0.75;
          const baseY = row * currentGridCellHeight * 1.5 + currentGridCellHeight * 0.75;
          const offsetX = (Math.random() - 0.5) * currentGridCellWidth * 0.8;
          const offsetY = (Math.random() - 0.5) * currentGridCellHeight * 0.8;
          
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
      
      const currentGridCellWidth = getGridCellWidth();
      const currentGridCellHeight = getGridCellHeight();
      
      // Calculate which grid rows this region covers
      const startRow = Math.floor(regionStart / currentGridCellHeight);
      const endRow = Math.ceil(regionEnd / currentGridCellHeight);
      
      const cols = Math.ceil(canvas.width / currentGridCellWidth);
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
          const baseX = col * currentGridCellWidth + currentGridCellWidth / 2;
          const baseY = row * currentGridCellHeight + currentGridCellHeight / 2;
          const offsetX = (Math.random() - 0.5) * currentGridCellWidth * 0.6; // Max 30% offset
          const offsetY = (Math.random() - 0.5) * currentGridCellHeight * 0.6;
          
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
      const lineCols = Math.ceil(canvas.width / (currentGridCellWidth * 1.5));
      const lineStartRow = Math.floor(regionStart / (currentGridCellHeight * 1.5));
      const lineEndRow = Math.ceil(regionEnd / (currentGridCellHeight * 1.5));
      
      for (let row = lineStartRow; row < lineEndRow; row++) {
        for (let col = 0; col < lineCols; col++) {
          const baseX = col * currentGridCellWidth * 1.5 + currentGridCellWidth * 0.75;
          const baseY = row * currentGridCellHeight * 1.5 + currentGridCellHeight * 0.75;
          
          // Only add if this line is in the new region
          if (baseY >= regionStart && baseY <= regionEnd) {
            const offsetX = (Math.random() - 0.5) * currentGridCellWidth * 0.8;
            const offsetY = (Math.random() - 0.5) * currentGridCellHeight * 0.8;
            
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

    // Set canvas size to cover full document - ensure it doesn't exceed viewport width
    // Throttled for performance
    let resizeTimeout: NodeJS.Timeout | null = null;
    const resizeCanvas = () => {
      if (resizeTimeout) return;
      
      resizeTimeout = setTimeout(() => {
        const maxWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
        canvas.width = maxWidth;
        canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
        // Regenerate shapes with new grid cell sizes when viewport changes
        const newPageHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight);
        shapesRef.current = generateShapesForFullPage(newPageHeight);
        generatedGridRowsRef.current.clear();
        resizeTimeout = null;
      }, 200); // Throttle resize to 200ms
    };
    
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
    
    // Initial setup - wait for page to fully load to get accurate document height
    const initializeCanvas = () => {
      const maxWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
      const fullPageHeight = Math.max(
        window.innerHeight, 
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        3000 // Minimum height to ensure we cover the page
      );
      
      canvas.width = maxWidth;
      canvas.height = fullPageHeight;
      
      // Set canvas CSS height to match
      canvas.style.height = `${fullPageHeight}px`;
      
      // Generate all shapes for the entire page upfront
      shapesRef.current = generateShapesForFullPage(fullPageHeight);
      generatedGridRowsRef.current.clear();
      
      // Pre-render all shapes immediately
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapesRef.current.forEach((shape) => {
        switch (shape.type) {
          case 'triangle':
            drawTriangle(shape);
            break;
          case 'square':
            drawSquare(shape);
            break;
          case 'circle':
            drawCircle(shape);
            break;
          case 'line':
            drawLine(shape);
            break;
        }
      });
    };
    
    // Initialize after a short delay to ensure page is loaded
    let initTimeout: NodeJS.Timeout | null = null;
    const startInit = () => {
      initTimeout = setTimeout(() => {
        initializeCanvas();
        // Also check again after page fully loads
        if (document.readyState !== 'complete') {
          window.addEventListener('load', initializeCanvas, { once: true });
        }
        initTimeout = null;
      }, 200);
    };
    startInit();
    
    window.addEventListener('resize', resizeCanvas, { passive: true });
    
    // Check document height more frequently to ensure canvas always covers full page
    const heightCheckInterval = setInterval(updateCanvasHeight, 500); // Check every 500ms

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
    // Throttled for performance
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        const currentPageHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight);
        
        // Update canvas height if page grew
        if (currentPageHeight > canvas.height) {
          const oldHeight = canvas.height;
          canvas.height = currentPageHeight;
          // Generate shapes only for the truly new area
          const newShapes = generateShapesForRegion(oldHeight, currentPageHeight);
          shapesRef.current.push(...newShapes);
        }
        scrollTimeout = null;
      }, 100); // Throttle scroll handler to 100ms
    };

    // Animation loop - runs continuously without throttling for smooth animation
    let lastScrollY = window.scrollY;
    let isScrolling = false;
    let scrollEndTimeout: NodeJS.Timeout | null = null;
    
    // Track scroll position continuously without throttling to avoid lag
    const handleScrollUpdate = () => {
      lastScrollY = window.scrollY;
      isScrolling = true;
      
      // Clear any existing timeout
      if (scrollEndTimeout) {
        clearTimeout(scrollEndTimeout);
      }
      
      // Mark scrolling as ended after a short delay
      scrollEndTimeout = setTimeout(() => {
        isScrolling = false;
        scrollEndTimeout = null;
      }, 150);
    };
    
    window.addEventListener('scroll', handleScrollUpdate, { passive: true });
    
    const animate = () => {
      // Ensure canvas height always matches document height
      const currentDocHeight = Math.max(
        window.innerHeight,
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      
      if (currentDocHeight > canvas.height) {
        const oldHeight = canvas.height;
        canvas.height = currentDocHeight;
        canvas.style.height = `${currentDocHeight}px`;
        // Generate shapes for new area
        const newShapes = generateShapesForRegion(oldHeight, currentDocHeight);
        shapesRef.current.push(...newShapes);
      }
      
      // Read scroll position directly - it's fast and ensures smooth updates
      const scrollY = window.scrollY;
      lastScrollY = scrollY;
      const viewportHeight = window.innerHeight;
      const viewportTop = scrollY;
      const viewportBottom = scrollY + viewportHeight;
      const viewportBuffer = viewportHeight * 2; // Larger buffer to ensure shapes are always visible

      // Calculate visible region with larger buffer
      const visibleTop = Math.max(0, viewportTop - viewportBuffer);
      const visibleBottom = Math.min(canvas.height, viewportBottom + viewportBuffer);
      
      // Clear the entire visible area plus buffer
      ctx.clearRect(0, visibleTop, canvas.width, visibleBottom - visibleTop);

      // Always update shape positions - animation never pauses
      shapesRef.current.forEach((shape) => {
        // Update position continuously - animation never pauses
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        // Wrap around horizontal edges
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;

        // Wrap around vertical edges to keep shapes animating throughout the page
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

        // Draw shapes in the visible viewport with buffer (using absolute positions)
        if (shape.y >= visibleTop && shape.y <= visibleBottom) {
          // Draw shape at its absolute position on the canvas
          switch (shape.type) {
            case 'triangle':
              drawTriangle(shape);
              break;
            case 'square':
              drawSquare(shape);
              break;
            case 'circle':
              drawCircle(shape);
              break;
            case 'line':
              drawLine(shape);
              break;
          }
        }
      });

      // Continue animation immediately - no throttling, no delays
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    
    // Initial scroll position
    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle mouse hover - slightly increase opacity of nearby shapes
    // Throttled for performance
    let mouseMoveTimeout: NodeJS.Timeout | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseMoveTimeout) return;
      
      mouseMoveTimeout = setTimeout(() => {
        const mouseX = e.clientX;
        const mouseY = e.clientY + window.scrollY; // Account for scroll position
        // Responsive hover radius: smaller on mobile
        const viewportWidth = window.innerWidth;
        const hoverRadius = viewportWidth >= 1024 ? 150 : viewportWidth >= 768 ? 120 : 100;

        // Only check shapes in viewport for performance
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const viewportBuffer = viewportHeight * 1.5;

        shapesRef.current.forEach((shape) => {
          const drawY = shape.y - scrollY;
          // Skip shapes outside viewport
          if (drawY < -viewportBuffer || drawY > viewportBuffer) return;
          
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
        mouseMoveTimeout = null;
      }, 50); // Throttle mouse move to 50ms
    };

    window.addEventListener('mousemove', handleMouseMove);

    const currentAnimationFrame = animationFrameRef.current;

    return () => {
      clearInterval(heightCheckInterval);
      if (initTimeout) clearTimeout(initTimeout);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
      if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollUpdate);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('load', initializeCanvas);
      if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-0"
      style={{ 
        opacity: 0.9, 
        width: '100%',
        maxWidth: '100vw', 
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    />
  );
}

