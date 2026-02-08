// Parsing and normalization helpers for Market Pulse updates

export interface ParsedMarketPulse {
  breaking: string;
  developing: string;
  context: string;
  impact: string;
}

export function parseMarketPulseText(updateText: string): ParsedMarketPulse | null {
  try {
    const sections = updateText.split('\n\n');
    
    if (sections.length < 4) {
      console.warn('Market pulse update missing sections:', sections.length);
      return null;
    }
    
    const breaking = sections[0].replace(/^BREAKING\n?/i, '').trim();
    const developing = sections[1].replace(/^DEVELOPING\n?/i, '').trim();
    const context = sections[2].replace(/^CONTEXT\n?/i, '').trim();
    const impact = sections[3].replace(/^IMPACT\n?/i, '').trim();
    
    // Validate all sections are present
    if (!breaking || !developing || !context || !impact) {
      console.warn('Market pulse update has empty sections');
      return null;
    }
    
    return {
      breaking,
      developing,
      context,
      impact,
    };
  } catch (error) {
    console.error('Failed to parse market pulse update:', error);
    return null;
  }
}

export function validateMarketPulseStructure(updateText: string): boolean {
  const parsed = parseMarketPulseText(updateText);
  return parsed !== null;
}
