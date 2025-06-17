/**
 * Content-to-Experience Converter
 * Transformation Engine JavaScript
 */

// Transformation methods for different content types
const transformationEngine = {
    // Transform article to interactive story
    articleToStory: function(content, contentType) {
        // For demo purposes, we'll simulate the transformation
        
        // Parse content based on type
        let parsedContent;
        if (contentType === 'markdown') {
            parsedContent = parseMarkdownContent(content);
        } else if (contentType === 'html') {
            parsedContent = parseHtmlContent(content);
        } else {
            parsedContent = parseTextContent(content);
        }
        
        // Create interactive story elements
        const interactiveElements = createInteractiveStoryElements(parsedContent);
        
        // Return transformed content
        return {
            type: 'interactive-story',
            original: content,
            transformed: interactiveElements,
            metadata: {
                transformedAt: new Date().toISOString(),
                contentType: contentType,
                interactiveElements: interactiveElements.length
            }
        };
    },
    
    // Transform data to visualization
    dataToVisualization: function(content, contentType) {
        // For demo purposes, we'll simulate the transformation
        
        // Parse data based on content type
        let parsedData;
        if (contentType === 'json') {
            parsedData = parseJsonData(content);
        } else if (contentType === 'markdown' || contentType === 'text') {
            parsedData = parseTableData(content);
        } else {
            throw new Error('Unsupported content type for data visualization');
        }
        
        // Create visualization elements
        const visualizationElements = createVisualizationElements(parsedData);
        
        // Return transformed content
        return {
            type: 'data-visualization',
            original: content,
            transformed: visualizationElements,
            metadata: {
                transformedAt: new Date().toISOString(),
                contentType: contentType,
                dataPoints: parsedData.length
            }
        };
    },
    
    // Transform product description to demo
    productToDemo: function(content, contentType) {
        // For demo purposes, we'll simulate the transformation
        
        // Parse product information
        let productInfo;
        if (contentType === 'markdown' || contentType === 'text') {
            productInfo = parseProductInfo(content);
        } else if (contentType === 'json') {
            productInfo = JSON.parse(content);
        } else {
            throw new Error('Unsupported content type for product demo');
        }
        
        // Create interactive product demo elements
        const demoElements = createProductDemoElements(productInfo);
        
        // Return transformed content
        return {
            type: 'product-demo',
            original: content,
            transformed: demoElements,
            metadata: {
                transformedAt: new Date().toISOString(),
                contentType: contentType,
                productName: productInfo.name || 'Unknown Product'
            }
        };
    },
    
    // Transform testimonial to story
    testimonialToStory: function(content, contentType) {
        // For demo purposes, we'll simulate the transformation
        
        // Parse testimonial information
        let testimonialInfo;
        if (contentType === 'markdown' || contentType === 'text') {
            testimonialInfo = parseTestimonialInfo(content);
        } else if (contentType === 'json') {
            testimonialInfo = JSON.parse(content);
        } else {
            throw new Error('Unsupported content type for testimonial story');
        }
        
        // Create interactive testimonial story elements
        const storyElements = createTestimonialStoryElements(testimonialInfo);
        
        // Return transformed content
        return {
            type: 'testimonial-story',
            original: content,
            transformed: storyElements,
            metadata: {
                transformedAt: new Date().toISOString(),
                contentType: contentType,
                customerName: testimonialInfo.customer || 'Anonymous Customer'
            }
        };
    }
};

// Helper parsing functions

// Parse markdown content into structured sections
function parseMarkdownContent(markdown) {
    const sections = [];
    
    // Split by headers
    const headerSections = markdown.split(/^#{1,3} /gm);
    
    // Process each section
    headerSections.forEach((section, index) => {
        if (index === 0 && !section.trim()) return; // Skip empty first section
        
        const lines = section.split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        
        sections.push({
            title: title,
            content: content,
            type: 'text'
        });
    });
    
    return sections;
}

// Parse HTML content into structured sections
function parseHtmlContent(html) {
    const sections = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extract headers and their following content
    const headers = tempDiv.querySelectorAll('h1, h2, h3');
    
    headers.forEach((header, index) => {
        const title = header.textContent.trim();
        let content = '';
        let currentNode = header.nextElementSibling;
        
        // Collect all content until the next header
        while (currentNode && !['H1', 'H2', 'H3'].includes(currentNode.tagName)) {
            content += currentNode.outerHTML;
            currentNode = currentNode.nextElementSibling;
        }
        
        sections.push({
            title: title,
            content: content,
            type: 'html'
        });
    });
    
    return sections;
}

// Parse plain text content into sections
function parseTextContent(text) {
    const sections = [];
    const paragraphs = text.split('\n\n');
    
    paragraphs.forEach((paragraph, index) => {
        if (!paragraph.trim()) return; // Skip empty paragraphs
        
        // For text, we'll treat each paragraph as a section
        sections.push({
            title: `Section ${index + 1}`,
            content: paragraph.trim(),
            type: 'text'
        });
    });
    
    return sections;
}

// Parse JSON data for visualization
function parseJsonData(jsonStr) {
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return [];
    }
}

// Parse table data from markdown or text
function parseTableData(content) {
    // Very simple table parser (for demo purposes only)
    const rows = [];
    const lines = content.split('\n');
    
    let inTable = false;
    let headers = [];
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        
        // Detect markdown table headers
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            if (!inTable) {
                // This is the header row
                headers = trimmedLine.split('|')
                    .filter(cell => cell.trim())
                    .map(cell => cell.trim());
                inTable = true;
            } else if (!trimmedLine.includes('---')) {
                // This is a data row
                const cells = trimmedLine.split('|')
                    .filter(cell => cell.trim())
                    .map(cell => cell.trim());
                
                // Create object with header keys
                const rowObj = {};
                headers.forEach((header, index) => {
                    rowObj[header] = cells[index] || '';
                });
                
                rows.push(rowObj);
            }
        }
    });
    
    return rows.length > 0 ? rows : generateMockData();
}

// Generate mock data if no table is found
function generateMockData() {
    return [
        { category: 'Category A', value: 25, trend: 'up' },
        { category: 'Category B', value: 42, trend: 'down' },
        { category: 'Category C', value: 18, trend: 'stable' },
        { category: 'Category D', value: 30, trend: 'up' }
    ];
}

// Parse product information from content
function parseProductInfo(content) {
    // For demo purposes, we'll extract basic product info
    const productInfo = {
        name: '',
        description: '',
        features: [],
        price: ''
    };
    
    // Simple extraction based on common patterns
    const lines = content.split('\n');
    let currentSection = '';
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.match(/^#{1,2}\s+/)) {
            // This is likely a product name
            productInfo.name = trimmedLine.replace(/^#{1,2}\s+/, '');
        } else if (trimmedLine.match(/price|cost/i) && trimmedLine.match(/\$|€|£/)) {
            // This might contain price information
            const priceMatch = trimmedLine.match(/(\$|€|£)\s*[\d,]+(\.\d+)?/);
            if (priceMatch) {
                productInfo.price = priceMatch[0];
            }
        } else if (trimmedLine.match(/^[-*]\s+/)) {
            // This is likely a feature bullet point
            productInfo.features.push(trimmedLine.replace(/^[-*]\s+/, ''));
        } else if (productInfo.description.length < 100 && trimmedLine.length > 20) {
            // This could be part of the description
            productInfo.description += trimmedLine + ' ';
        }
    });
    
    // If we couldn't extract meaningful info, use placeholder data
    if (!productInfo.name) productInfo.name = 'Sample Product';
    if (!productInfo.description) productInfo.description = 'This is a sample product description.';
    if (productInfo.features.length === 0) productInfo.features = ['Feature 1', 'Feature 2', 'Feature 3'];
    if (!productInfo.price) productInfo.price = '$99.99';
    
    return productInfo;
}

// Parse testimonial information from content
function parseTestimonialInfo(content) {
    // For demo purposes, we'll extract basic testimonial info
    const testimonialInfo = {
        customer: '',
        company: '',
        quote: '',
        rating: 0
    };
    
    // Simple extraction based on common patterns
    const lines = content.split('\n');
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.match(/^["']/) && trimmedLine.match(/["']$/)) {
            // This is likely the testimonial quote
            testimonialInfo.quote = trimmedLine.replace(/^["']|["']$/g, '');
        } else if (trimmedLine.match(/^[-—]\s*[A-Z]/)) {
            // This might be the customer attribution
            const attribution = trimmedLine.replace(/^[-—]\s*/, '');
            const parts = attribution.split(',');
            
            if (parts.length >= 1) testimonialInfo.customer = parts[0].trim();
            if (parts.length >= 2) testimonialInfo.company = parts[1].trim();
        } else if (trimmedLine.match(/\d+\/\d+|[1-5]\s*stars|\★{1,5}/)) {
            // This might contain rating information
            const ratingMatch = trimmedLine.match(/(\d+)\/(\d+)|([1-5])\s*stars|(\★{1,5})/);
            if (ratingMatch) {
                if (ratingMatch[1] && ratingMatch[2]) {
                    // Format: X/Y
                    testimonialInfo.rating = parseInt(ratingMatch[1]) / parseInt(ratingMatch[2]) * 5;
                } else if (ratingMatch[3]) {
                    // Format: X stars
                    testimonialInfo.rating = parseInt(ratingMatch[3]);
                } else if (ratingMatch[4]) {
                    // Format: ★★★★★
                    testimonialInfo.rating = ratingMatch[4].length;
                }
            }
        }
    });
    
    // If we couldn't extract meaningful info, use placeholder data
    if (!testimonialInfo.customer) testimonialInfo.customer = 'John Doe';
    if (!testimonialInfo.company) testimonialInfo.company = 'ABC Company';
    if (!testimonialInfo.quote) testimonialInfo.quote = 'This product transformed our business operations completely.';
    if (!testimonialInfo.rating) testimonialInfo.rating = 5;
    
    return testimonialInfo;
}

// Creation functions for interactive elements

// Create interactive story elements
function createInteractiveStoryElements(sections) {
    return sections.map((section, index) => {
        // For each section, create an interactive element
        return {
            id: `story-section-${index}`,
            type: 'story-section',
            title: section.title,
            content: section.content,
            interactivity: {
                type: index % 3 === 0 ? 'reveal' : (index % 3 === 1 ? 'quiz' : 'highlight'),
                options: index % 3 === 1 ? generateQuizOptions(section) : null
            }
        };
    });
}

// Generate quiz options for interactive sections
function generateQuizOptions(section) {
    // Simple quiz option generator for demo
    return {
        question: `What is the main point of "${section.title}"?`,
        answers: [
            { text: 'Option A', correct: true },
            { text: 'Option B', correct: false },
            { text: 'Option C', correct: false }
        ]
    };
}

// Create visualization elements
function createVisualizationElements(data) {
    // Determine the best visualization type based on data
    const visualizationType = determineVisualizationType(data);
    
    // Create visualization config
    return {
        id: 'data-viz',
        type: 'visualization',
        vizType: visualizationType,
        data: data,
        options: {
            title: 'Data Visualization',
            interactive: true,
            colors: ['#4a6bfa', '#34c3a9', '#f7931a', '#e74c3c']
        }
    };
}

// Determine best visualization type for data
function determineVisualizationType(data) {
    if (!data || data.length === 0) return 'bar';
    
    // Simple logic to determine visualization type
    const firstItem = data[0];
    const numericKeys = Object.keys(firstItem).filter(key => !isNaN(firstItem[key]));
    
    if (numericKeys.length >= 2) {
        return 'scatter';
    } else if (numericKeys.length === 1) {
        return data.length <= 5 ? 'pie' : 'bar';
    } else {
        return 'table';
    }
}

// Create product demo elements
function createProductDemoElements(productInfo) {
    // Create interactive product demo
    return {
        id: 'product-demo',
        type: 'interactive-demo',
        product: productInfo,
        elements: [
            {
                id: 'product-overview',
                type: 'overview',
                title: productInfo.name,
                description: productInfo.description
            },
            {
                id: 'product-features',
                type: 'feature-explorer',
                features: productInfo.features.map((feature, index) => ({
                    id: `feature-${index}`,
                    name: feature,
                    description: `Detailed explanation of ${feature}`
                }))
            },
            {
                id: 'product-pricing',
                type: 'pricing',
                price: productInfo.price,
                options: [
                    { name: 'Basic', price: productInfo.price },
                    { name: 'Premium', price: `$${(parseFloat(productInfo.price.replace(/[^\d.]/g, '')) * 1.5).toFixed(2)}` }
                ]
            }
        ]
    };
}

// Create testimonial story elements
function createTestimonialStoryElements(testimonialInfo) {
    // Create interactive testimonial story
    return {
        id: 'testimonial-story',
        type: 'interactive-testimonial',
        customer: {
            name: testimonialInfo.customer,
            company: testimonialInfo.company,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonialInfo.customer)}&background=random`
        },
        testimonial: {
            quote: testimonialInfo.quote,
            rating: testimonialInfo.rating
        },
        elements: [
            {
                id: 'customer-journey',
                type: 'journey-timeline',
                stages: [
                    { title: 'Challenge', content: 'The customer faced significant challenges with their existing solution.' },
                    { title: 'Discovery', content: 'They discovered our product through industry recommendations.' },
                    { title: 'Implementation', content: 'The implementation process was smooth and efficient.' },
                    { title: 'Results', content: 'They achieved outstanding results and ROI from our solution.' }
                ]
            },
            {
                id: 'testimonial-video',
                type: 'video-placeholder',
                thumbnail: 'https://via.placeholder.com/640x360',
                duration: '2:45'
            },
            {
                id: 'impact-metrics',
                type: 'metrics',
                metrics: [
                    { label: 'Time Saved', value: '35%' },
                    { label: 'ROI', value: '250%' },
                    { label: 'User Satisfaction', value: '4.8/5' }
                ]
            }
        ]
    };
}