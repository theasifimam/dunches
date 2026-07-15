const fs = require('fs');
const path = 'c:/desktopfolders/restaurant/apps/web/app/book/booking.module.css';

// Re-read original from TS again to undo damage
const tsPath = 'c:/desktopfolders/restaurant/apps/mobile/components/booking/booking.styles.ts';
let content = fs.readFileSync(tsPath, 'utf8');

function toKebabCase(str) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function processValue(key, val) {
  if (typeof val === 'number') {
    if (['flex', 'opacity', 'zIndex', 'elevation', 'fontWeight', 'lineHeight'].includes(key)) return val;
    return `${val}px`;
  }
  if (val === 'StyleSheet.hairlineWidth') return '1px';
  if (val.startsWith('Platform.')) return 'auto';
  return val;
}

let css = '';
const createRegex = /StyleSheet\.create\(\{([\s\S]*?)\}\);/g;
let match;

function processInline(k, v) {
  if (k === 'paddingHorizontal') return `  padding-left: ${processValue(k, v)};\n  padding-right: ${processValue(k, v)};\n`;
  if (k === 'paddingVertical') return `  padding-top: ${processValue(k, v)};\n  padding-bottom: ${processValue(k, v)};\n`;
  if (k === 'marginHorizontal') return `  margin-left: ${processValue(k, v)};\n  margin-right: ${processValue(k, v)};\n`;
  if (k === 'marginVertical') return `  margin-top: ${processValue(k, v)};\n  margin-bottom: ${processValue(k, v)};\n`;
  if (k === 'elevation') return '';
  if (k === 'lineHeight') return `  line-height: ${v}px;\n`;
  return `  ${toKebabCase(k)}: ${processValue(k, v)};\n`;
}

while ((match = createRegex.exec(content)) !== null) {
  const block = match[1];
  const lines = block.split('\n');
  let currentClass = null;
  
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('//')) continue;
    
    const keyMatch = line.match(/^([a-zA-Z0-9_]+):\s*\{/);
    if (keyMatch) {
      currentClass = keyMatch[1];
      css += `.${currentClass} {\n`;
      const inlineProps = line.substring(line.indexOf('{') + 1).replace('}', '').trim();
      if (inlineProps) {
          const props = inlineProps.split(',').filter(Boolean);
          for (let p of props) {
              const [k, v] = p.split(':').map(s => s.trim().replace(/"/g, ''));
              if(k && v) css += processInline(k, isNaN(Number(v)) ? v : Number(v));
          }
      }
      if (line.endsWith('},')) {
        css += `}\n\n`;
        currentClass = null;
      }
      continue;
    }
    
    if (currentClass) {
      if (line === '},' || line === '}') {
        css += `}\n\n`;
        currentClass = null;
        continue;
      }
      
      const propMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.+),?$/);
      if (propMatch) {
        let key = propMatch[1];
        let valStr = propMatch[2].replace(/,$/, '').trim();
        let val = valStr;
        
        if (valStr.startsWith('"') || valStr.startsWith("'")) {
          val = valStr.slice(1, -1);
        } else if (!isNaN(Number(valStr))) {
          val = Number(valStr);
        } else if (valStr === 'StyleSheet.hairlineWidth') {
            val = '1px';
        } else if (valStr.startsWith('{')) {
          if (key === 'shadowOffset') val = '0px 4px';
        }
        
        if (typeof val === 'string' && val.includes('Platform')) continue;
        if (typeof val === 'string' && val.includes('{')) continue;

        if (key === 'flexDirection' && val === 'row') css += `  display: flex;\n  flex-direction: row;\n`;
        else if (key === 'flexDirection' && val === 'column') css += `  display: flex;\n  flex-direction: column;\n`;
        else if (key === 'alignItems') css += `  display: flex;\n  align-items: ${val};\n`;
        else if (key === 'justifyContent') css += `  display: flex;\n  justify-content: ${val};\n`;
        else if (key === 'gap') css += `  display: flex;\n  gap: ${processValue(key, val)};\n`;
        else if (key === 'flexWrap') css += `  flex-wrap: ${val};\n`;
        else if (key === 'flex' && val === 1) css += `  flex: 1 1 0%;\n`;
        else css += processInline(key, val);
      }
    }
  }
}

css += `
.root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}
.scroll {
  overflow-y: auto;
  flex: 1;
}
.menuImage {
  object-fit: cover;
}
.timeGrid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
.col {
  display: flex;
  flex-direction: column;
}
.stepHead {
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
  flex-direction: row;
}
`;

fs.writeFileSync(path, css);
console.log('Successfully re-transpiled CSS with perfect properties!');
