const fs = require('fs');
const pdf = require('pdf-parse');

const analyzeResume = async (resumePath, jobSkills) => {
    try {
        const dataBuffer = fs.readFileSync(resumePath);
        const data = await pdf(dataBuffer);
        const resumeText = data.text.toLowerCase();

        // VALIDATION: Check for empty or too short content
        if (!resumeText || resumeText.length < 50) {
            return { valid: false, score: 0, message: 'Resume seems empty or too short.' };
        }

        // VALIDATION: Check for basic resume keywords to prevent fake files
        const requiredTerms = ['education', 'experience', 'skills', 'projects', 'summary', 'profile', 'work'];
        const hasResumeTerm = requiredTerms.some(term => resumeText.includes(term));
        if (!hasResumeTerm) {
            return { valid: false, score: 0, message: 'File does not look like a valid resume (missing standard sections).' };
        }

        // jobSkills might be an array or string. Ensure array.
        const skills = Array.isArray(jobSkills) ? jobSkills : (typeof jobSkills === 'string' ? jobSkills.split(',') : []);

        let matchCount = 0;
        const missingKeywords = [];

        skills.forEach(skill => {
            const s = skill.toLowerCase().trim();
            if (s && resumeText.includes(s)) {
                matchCount++;
            } else if (s) {
                missingKeywords.push(s);
            }
        });

        const score = skills.length > 0 ? (matchCount / skills.length) * 100 : 0;

        return {
            valid: true,
            score: Math.round(score),
            missingKeywords
        };

    } catch (error) {
        console.error('Error parsing PDF:', error);
        return { score: 0, missingKeywords: [] };
    }
};

module.exports = analyzeResume;
