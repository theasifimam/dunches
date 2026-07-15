const fs = require('fs');
const path = 'c:/desktopfolders/restaurant/apps/web/app/book/booking.module.css';
let css = fs.readFileSync(path, 'utf8');

css += `
.hideScrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hideScrollbar::-webkit-scrollbar {
  display: none;
}
`;

fs.writeFileSync(path, css);
console.log('Appended scrollbar CSS');
