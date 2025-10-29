import Experience from '../models/Experience.js';
// 1. GET /experiences - Return list of experiences [cite: 32]
export const getExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find({}, // Filter
        {
            title: 1,
            price: 1,
            duration: 1,
            location: 1,
            imageUrl: 1
        } // Projection: Only return fields needed for Home Page list
        );
        res.json(experiences);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: 'Error fetching experiences', error: err.message });
    }
};
// 2. GET /experiences/:id - Return details and slot availability [cite: 33]
export const getExperienceById = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        // Filter out slots that are already sold out and only show future slots
        const now = new Date();
        const availableExperience = {
            ...experience.toObject(), // Convert mongoose document to a plain object
            slots: experience.slots.filter(slot => !slot.isSoldOut && slot.date >= now),
        };
        res.json(availableExperience);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: 'Error fetching experience details', error: err.message });
    }
};
//# sourceMappingURL=experienceController.js.map