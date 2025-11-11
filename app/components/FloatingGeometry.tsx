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
        // Generate shapes for the new area
        const newShapes = generateShapesForRegion(oldHeight, newHeight);
        shapesRef.current.push(...newShapes);
      }
    };
    
    // Check document height periodically
    const heightCheckInterval = setInterval(updateCanvasHeight, 500);

    // Generate shapes for the entire document height
    const generateShapesForFullPage = (pageHeight: number): Shape[] => {
      const shapes: Shape[] = [];
      const viewportHeight = window.innerHeight;
      const density = 0.8; // Shapes per 100px of height
      const totalShapes = Math.ceil((pageHeight / 100) * density);
      
      for (let i = 0; i < totalShapes; i++) {
        const types: Shape['type'][] = ['triangle', 'square', 'circle'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        shapes.push({
          type,
          x: Math.random() * canvas.width,
          y: Math.random() * pageHeight,
          size: 5 + Math.random() * 7.5, // Small: 5-12.5px
          rotation: Math.random() * Math.PI * 2,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          opacity: 0.4 + Math.random() * 0.3,
          color: `rgba(255, 255, 255, ${0.5 + Math.random() * 0.4})`,
        });
      }

      // Add connecting lines distributed across the page
      const lineCount = Math.ceil((pageHeight / 200) * density);
      for (let i = 0; i < lineCount; i++) {
        shapes.push({
          type: 'line',
          x: Math.random() * canvas.width,
          y: Math.random() * pageHeight,
          size: 10 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 2,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          rotationSpeed: (Math.random() - 0.5) * 0.005,
          opacity: 0.3 + Math.random() * 0.2,
          color: `rgba(255, 255, 255, ${0.4 + Math.random() * 0.3})`,
        });
      }

      return shapes;
    };

    // Generate shapes for a specific region (for scroll-based generation)
    const generateShapesForRegion = (regionStart: number, regionEnd: number): Shape[] => {
      const shapes: Shape[] = [];
      const regionHeight = regionEnd - regionStart;
      const shapeCount = Math.ceil((regionHeight / 100) * 0.8); // Same density
      
      for (let i = 0; i < shapeCount; i++) {
        const types: Shape['type'][] = ['triangle', 'square', 'circle'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        shapes.push({
          type,
          x: Math.random() * canvas.width,
          y: regionStart + Math.random() * regionHeight,
          size: 5 + Math.random() * 7.5,
          rotation: Math.random() * Math.PI * 2,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          opacity: 0.4 + Math.random() * 0.3,
          color: `rgba(255, 255, 255, ${0.5 + Math.random() * 0.4})`,
        });
      }

      // Add lines
      const lineCount = Math.ceil((regionHeight / 200) * 0.8);
      for (let i = 0; i < lineCount; i++) {
        shapes.push({
          type: 'line',
          x: Math.random() * canvas.width,
          y: regionStart + Math.random() * regionHeight,
          size: 10 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 2,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          rotationSpeed: (Math.random() - 0.5) * 0.005,
          opacity: 0.3 + Math.random() * 0.2,
          color: `rgba(255, 255, 255, ${0.4 + Math.random() * 0.3})`,
        });
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

    // Handle scroll - generate new shapes for new areas and update canvas height
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const currentPageHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight);
      
      // Update canvas height if page grew
      if (currentPageHeight > canvas.height) {
        canvas.height = currentPageHeight;
        // Generate shapes for the new area
        const newAreaStart = canvas.height - viewportHeight * 2;
        const newAreaEnd = currentPageHeight;
        if (newAreaEnd > newAreaStart) {
          const newShapes = generateShapesForRegion(newAreaStart, newAreaEnd);
          shapesRef.current.push(...newShapes);
        }
      }
      
      // Generate shapes for areas ahead of scroll (preload)
      const preloadDistance = viewportHeight * 2;
      const preloadStart = scrollY + viewportHeight;
      const preloadEnd = Math.min(preloadStart + preloadDistance, currentPageHeight);
      
      // Check if we need to generate for this region
      const regionKey = Math.floor(preloadStart / viewportHeight);
      if (!generatedRegionsRef.current.has(regionKey) && preloadEnd > preloadStart) {
        const newShapes = generateShapesForRegion(preloadStart, preloadEnd);
        shapesRef.current.push(...newShapes);
        generatedRegionsRef.current.add(regionKey);
      }
      
      lastScrollYRef.current = scrollY;
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

