const fs = require('fs');
const path = require('path');

const prefix = 'vt-';
const directories = ['src'];

function prefixString(str) {
	if (!str || typeof str !== 'string') return str;
	return str.split(/\s+/).map(cls => {
		if (!cls || cls.startsWith('vt-') || cls.startsWith('http') || cls.includes('/') || cls.includes('.') || cls.startsWith('#') || cls.startsWith('@') || cls.includes('{') || cls.includes('}')) return cls;

		// Handle variants like hover: or md:
		const parts = cls.split(':');
		const utility = parts.pop();

		// If utility is empty (e.g. trailing colon), return original
		if (!utility) return cls;

		const variants = parts.length > 0 ? parts.join(':') + ':' : '';

		return `${variants}${prefix}${utility}`;
	}).join(' ');
}

function prefixClasses(content) {
	// Regex to match className="..." or className='...'
	let newContent = content.replace(/className=(["'])(.*?)\1/g, (match, quote, classes) => {
		return `className=${quote}${prefixString(classes)}${quote}`;
	});

	// Regex to match cva strings
	newContent = newContent.replace(/cva\([\s\S]*?\)/g, (match) => {
		return match.replace(/(["'])(.*?)\1/g, (m, q, s) => {
			// Avoid matching import paths or other non-class strings
			if (s.includes('/') || s.includes('@') || s.length < 2) return m;
			return `${q}${prefixString(s)}${q}`;
		});
	});

	return newContent;
}

function processFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf8');
	const updatedContent = prefixClasses(content);
	if (content !== updatedContent) {
		fs.writeFileSync(filePath, updatedContent);
		console.log(`Updated: ${filePath}`);
	}
}

function walk(dir) {
	const files = fs.readdirSync(dir);
	files.forEach(file => {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			walk(fullPath);
		} else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
			processFile(fullPath);
		}
	});
}

directories.forEach(dir => walk(path.join(process.cwd(), dir)));
