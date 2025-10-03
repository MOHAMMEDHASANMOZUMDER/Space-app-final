// Text Visibility Fixer - Dynamic approach to ensure all text is visible
export function fixTextVisibility() {
  // Wait for DOM to be ready
  const applyFixes = () => {
    // Fix all text elements
    const allTextElements = document.querySelectorAll('*');
    allTextElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      
      // Check if text color is dark/black
      if (color === 'rgb(0, 0, 0)' || color === 'black' || 
          color === 'rgb(51, 51, 51)' || color === 'rgb(68, 68, 68)' ||
          color.includes('rgba(0, 0, 0') || color.includes('rgb(0,0,0')) {
        element.style.color = '#ffffff';
        element.style.setProperty('color', '#ffffff', 'important');
      }
    });

    // Fix all SVG text elements specifically
    const svgTexts = document.querySelectorAll('svg text, svg tspan, text, tspan');
    svgTexts.forEach(element => {
      element.style.fill = '#ffffff';
      element.style.setProperty('fill', '#ffffff', 'important');
      element.setAttribute('fill', '#ffffff');
    });

    // Fix Mermaid diagrams specifically
    const mermaidTexts = document.querySelectorAll('.mermaid text, .mermaid tspan');
    mermaidTexts.forEach(element => {
      element.style.fill = '#ffffff';
      element.style.setProperty('fill', '#ffffff', 'important');
      element.setAttribute('fill', '#ffffff');
      element.style.fontWeight = 'bold';
    });

    // Fix any remaining dark backgrounds that might hide text
    const mermaidNodes = document.querySelectorAll('.mermaid rect, .mermaid circle, .mermaid ellipse');
    mermaidNodes.forEach(element => {
      const fill = element.getAttribute('fill');
      if (!fill || fill === '#ffffff' || fill === 'white' || fill.includes('255, 255, 255')) {
        element.style.fill = 'rgba(30, 41, 59, 0.9)';
        element.setAttribute('fill', 'rgba(30, 41, 59, 0.9)');
      }
    });
  };

  // Apply fixes immediately
  applyFixes();

  // Apply fixes after a delay to catch dynamically loaded content
  setTimeout(applyFixes, 1000);
  setTimeout(applyFixes, 3000);

  // Apply fixes whenever DOM changes
  const observer = new MutationObserver(() => {
    setTimeout(applyFixes, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });

  return () => observer.disconnect();
}

// Auto-run when module is loaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', fixTextVisibility);
  
  // Also run immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixTextVisibility);
  } else {
    fixTextVisibility();
  }
}