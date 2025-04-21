class Listing {
    constructor() {
        this.categories = ['housing', 'food', 'essentials', 'events', 'places', 'services'];
        this.listings = [];
    }

    async createListing(data) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Must be logged in to create listing');

            const listing = {
                ...data,
                userId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            };

            const docRef = await firebase.firestore().collection('listings').add(listing);
            return docRef.id;
        } catch (error) {
            console.error('Error creating listing:', error);
            throw error;
        }
    }

    async getListings(filters = {}) {
        try {
            let query = firebase.firestore().collection('listings')
                .where('status', '==', 'active')
                .orderBy('createdAt', 'desc');

            if (filters.category) {
                query = query.where('category', '==', filters.category);
            }
            if (filters.college) {
                query = query.where('college', '==', filters.college);
            }

            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching listings:', error);
            throw error;
        }
    }

    async searchListings(searchTerm) {
        // Implement full-text search (you might want to use Algolia or similar)
        // For now, we'll do a simple client-side search
        const listings = await this.getListings();
        return listings.filter(listing => 
            listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
} 