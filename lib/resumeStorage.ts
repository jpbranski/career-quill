import { Resume } from './resumeModel';

const STORAGE_KEY = 'career-quill-resume';
const AUTOSAVE_DELAY = 1000; // 1 second debounce

let saveTimeout: NodeJS.Timeout | null = null;

/**
 * Save resume to localStorage
 */
export function saveResume(resume: Resume): void {
  try {
    const updatedResume = {
      ...resume,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResume));
  } catch (error) {
    console.error('Failed to save resume to localStorage:', error);
    // Handle quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please clear some data or download your resume.');
    }
  }
}

/**
 * Save resume with debounce for auto-save functionality
 */
export function autoSaveResume(resume: Resume): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    saveResume(resume);
  }, AUTOSAVE_DELAY);
}

/**
 * Load resume from localStorage
 */
export function loadResume(): Resume | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as Resume;
  } catch (error) {
    console.error('Failed to load resume from localStorage:', error);
    return null;
  }
}

/**
 * Clear resume from localStorage
 */
export function clearResume(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear resume from localStorage:', error);
  }
}

/**
 * Export resume data as JSON
 */
export function exportResumeAsJson(resume: Resume): void {
  const dataStr = JSON.stringify(resume, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `resume-${resume.contact.fullName.replace(/\s+/g, '-').toLowerCase() || 'untitled'}-${Date.now()}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Import resume data from JSON file
 */
export function importResumeFromJson(file: File): Promise<Resume> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const resume = JSON.parse(content) as Resume;

        // Basic validation
        if (!resume.contact || !resume.sections) {
          throw new Error('Invalid resume format');
        }

        resolve(resume);
      } catch (error) {
        reject(new Error('Failed to parse resume file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): { used: number; available: boolean } {
  const available = isStorageAvailable();
  let used = 0;

  if (available) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      used = new Blob([stored]).size;
    }
  }

  return { used, available };
}
