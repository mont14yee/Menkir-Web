const fs = require('fs');
let header = fs.readFileSync('components/Header.tsx', 'utf8');

// Remove SearchBar definition
header = header.replace(/const SearchBar = \(\) => \([\s\S]*?\n    \);\s*/, '');

// Remove useSearch destructuring
header = header.replace(/const { searchQuery, setSearchQuery } = useSearch\(\);\n/, '');

// Remove useSearch import
header = header.replace(/import { useSearch } from '\.\.\/App';\n/, '');

// Remove SearchIcon import
header = header.replace(/SearchIcon,\s*/, '');

// Remove desktop SearchBar container
header = header.replace(/<div className="hidden md:block w-52 lg:w-64">\s*<SearchBar \/>\s*<\/div>/, '');

// Remove mobile SearchBar container
header = header.replace(/<div className="mt-12 md:hidden">\s*<SearchBar \/>\s*<\/div>/, '');

fs.writeFileSync('components/Header.tsx', header);
