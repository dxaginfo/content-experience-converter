/**
 * Content-to-Experience Converter
 * Main JavaScript file for application-wide functionality
 */

// State management
const appState = {
    currentSection: 'transform',
    contentLoaded: false,
    contentType: null,
    originalContent: null,
    transformedContent: null,
    transformationType: null,
    platformView: 'desktop',
    metrics: {
        engagementRate: {
            interactive: null,
            static: null
        },
        timeSpent: {
            interactive: null,
            static: null
        },
        conversionRate: {
            interactive: null,
            static: null
        },
        sharingRate: {
            interactive: null,
            static: null
        }
    }
};

// Local storage keys
const STORAGE_KEYS = {
    STATE: 'content_exp_converter_state',
    CONTENT: 'content_exp_converter_content',
    METRICS: 'content_exp_converter_metrics'
};

// DOM Elements
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('main section');
const deviceButtons = document.querySelectorAll('.device-btn');
const deviceFrames = document.querySelectorAll('.device-frame');
const uploadButton = document.getElementById('uploadButton');
const createButton = document.getElementById('createButton');
const fileUpload = document.getElementById('fileUpload');
const previewArea = document.getElementById('previewArea');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
});

deviceButtons.forEach(button => {
    button.addEventListener('click', handleDeviceChange);
});

uploadButton.addEventListener('click', () => {
    fileUpload.click();
});

fileUpload.addEventListener('change', handleFileUpload);
createButton.addEventListener('click', handleCreateNewContent);

// Initialize the application
function initializeApp() {
    // Load saved state from localStorage if exists
    loadFromLocalStorage();
    
    // Set default active section
    setActiveSection(appState.currentSection);
    
    // Set default device view
    setActiveDevice(appState.platformView);
    
    // Load content if exists
    if (appState.contentLoaded && appState.originalContent) {
        displayContentPreview(appState.originalContent, appState.contentType);
        enableTransformationOptions();
    }
    
    console.log('Content-to-Experience Converter initialized');
}

// Navigation handling
function handleNavigation(e) {
    e.preventDefault();
    const sectionId = e.target.getAttribute('data-section');
    
    // Only proceed if this isn't already the active section
    if (sectionId !== appState.currentSection) {
        setActiveSection(sectionId);
        appState.currentSection = sectionId;
        saveToLocalStorage();
    }
}

// Set the active section
function setActiveSection(sectionId) {
    // Remove active class from all links and sections
    navLinks.forEach(link => link.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));
    
    // Add active class to selected link and section
    document.querySelector(`nav a[data-section="${sectionId}"]`).classList.add('active');
    document.getElementById(sectionId).classList.add('active');
}

// Device change handling
function handleDeviceChange(e) {
    const deviceType = e.currentTarget.getAttribute('data-device');
    setActiveDevice(deviceType);
    appState.platformView = deviceType;
    saveToLocalStorage();
}

// Set the active device
function setActiveDevice(deviceType) {
    // Remove active class from all device buttons and frames
    deviceButtons.forEach(button => button.classList.remove('active'));
    deviceFrames.forEach(frame => frame.classList.remove('active'));
    
    // Add active class to selected button and frame
    document.querySelector(`.device-btn[data-device="${deviceType}"]`).classList.add('active');
    document.querySelector(`.device-frame.${deviceType}`).classList.add('active');
}

// File upload handling
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const content = event.target.result;
        const contentType = determineContentType(file.name);
        
        // Update state
        appState.contentLoaded = true;
        appState.contentType = contentType;
        appState.originalContent = content;
        
        // Display content preview
        displayContentPreview(content, contentType);
        
        // Enable transformation options
        enableTransformationOptions();
        
        // Save to localStorage
        saveToLocalStorage();
    };
    
    reader.readAsText(file);
}

// Create new content handling
function handleCreateNewContent() {
    // For demo purposes, we'll just create a simple text content
    const demoContent = `# Sample Content

This is a sample piece of content that you can use to test the Content-to-Experience Converter.

## Features

1. Interactive elements
2. Multi-platform consistency
3. Engagement optimization
4. ROI measurement

Try transforming this content into an interactive experience!`;

    appState.contentLoaded = true;
    appState.contentType = 'markdown';
    appState.originalContent = demoContent;
    
    // Display content preview
    displayContentPreview(demoContent, 'markdown');
    
    // Enable transformation options
    enableTransformationOptions();
    
    // Save to localStorage
    saveToLocalStorage();
}

// Display content preview based on content type
function displayContentPreview(content, contentType) {
    previewArea.innerHTML = '';
    
    const previewContainer = document.createElement('div');
    previewContainer.className = 'content-preview-inner';
    
    switch (contentType) {
        case 'markdown':
            // Simple markdown to HTML conversion
            previewContainer.innerHTML = convertMarkdownToHtml(content);
            break;
        case 'json':
            // Format and display JSON
            try {
                const jsonObj = JSON.parse(content);
                previewContainer.innerHTML = `<pre>${JSON.stringify(jsonObj, null, 2)}</pre>`;
            } catch (e) {
                previewContainer.innerHTML = `<div class="error">Invalid JSON: ${e.message}</div>`;
            }
            break;
        case 'html':
            // Display HTML with sanitization
            previewContainer.innerHTML = sanitizeHtml(content);
            break;
        default:
            // Plain text
            previewContainer.innerText = content;
    }
    
    previewArea.appendChild(previewContainer);
}

// Enable transformation options
function enableTransformationOptions() {
    const transformButtons = document.querySelectorAll('.option-card button');
    transformButtons.forEach(button => {
        button.disabled = false;
        button.addEventListener('click', handleTransformationSelection);
    });
}

// Handle transformation selection
function handleTransformationSelection(e) {
    const transformType = e.target.parentElement.querySelector('h4').innerText;
    console.log(`Selected transformation: ${transformType}`);
    
    // Update app state
    appState.transformationType = transformType;
    
    // For demo purposes, we'll just log this selection
    // In a real app, this would trigger the transformation process
    alert(`Transformation "${transformType}" selected. This feature would convert your content to an interactive experience.`);
    
    // Save to localStorage
    saveToLocalStorage();
}

// Utility Functions

// Determine content type from file extension
function determineContentType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'md':
            return 'markdown';
        case 'json':
            return 'json';
        case 'html':
        case 'htm':
            return 'html';
        case 'txt':
        default:
            return 'text';
    }
}

// Very simple Markdown to HTML converter (for demo purposes only)
function convertMarkdownToHtml(markdown) {
    let html = markdown;
    
    // Convert headers
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Convert lists
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    html = html.replace(/<\/li>\n<li>/g, '</li><li>');
    html = html.replace(/<li>(.*)<\/li>/g, '<ol><li>$1</li></ol>');
    html = html.replace(/<\/ol>\n<ol>/g, '');
    
    // Convert paragraphs
    html = html.replace(/^(?!<[a-z])(.*$)/gm, '<p>$1</p>');
    
    // Remove empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    
    return html;
}

// Very simple HTML sanitizer (for demo purposes only)
function sanitizeHtml(html) {
    // In a real app, use a proper sanitizer library
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

// Local Storage Functions

// Save current app state to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify({
            currentSection: appState.currentSection,
            contentLoaded: appState.contentLoaded,
            contentType: appState.contentType,
            transformationType: appState.transformationType,
            platformView: appState.platformView
        }));
        
        if (appState.originalContent) {
            localStorage.setItem(STORAGE_KEYS.CONTENT, appState.originalContent);
        }
        
        localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(appState.metrics));
        
    } catch (e) {
        console.warn('Error saving to localStorage:', e);
    }
}

// Load app state from localStorage
function loadFromLocalStorage() {
    try {
        const savedState = localStorage.getItem(STORAGE_KEYS.STATE);
        const savedContent = localStorage.getItem(STORAGE_KEYS.CONTENT);
        const savedMetrics = localStorage.getItem(STORAGE_KEYS.METRICS);
        
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            appState.currentSection = parsedState.currentSection || 'transform';
            appState.contentLoaded = parsedState.contentLoaded || false;
            appState.contentType = parsedState.contentType;
            appState.transformationType = parsedState.transformationType;
            appState.platformView = parsedState.platformView || 'desktop';
        }
        
        if (savedContent && appState.contentLoaded) {
            appState.originalContent = savedContent;
        }
        
        if (savedMetrics) {
            appState.metrics = JSON.parse(savedMetrics);
        }
        
    } catch (e) {
        console.warn('Error loading from localStorage:', e);
    }
}