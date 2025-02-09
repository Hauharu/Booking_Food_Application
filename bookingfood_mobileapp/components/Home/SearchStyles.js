import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SearchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Lighter background for modern feel
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  title: {
    fontSize: 32, // Slightly larger title
    fontWeight: 'bold',
    color: '#0b2fe7', // Primary accent color
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 2, // More rounded corners for a smoother look
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 25,
    backgroundColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    transition: 'background-color 0.2s ease',
  },
  sortButtonActive: {
    backgroundColor: '#0df8cd', // Active button color
  },
  sortText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7492e5',
    marginLeft: 10,
  },
  searchButton: {
    backgroundColor: '#3b82f6', // Consistent accent color
    paddingVertical: 14,
    borderRadius: 50, // Fully rounded button for modern look
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  searchText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
    width:100,
    textAlign: "center",
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 18,
    backgroundColor: '#efbcbc',
    borderRadius: 9,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    transition: 'transform 0.3s ease',
  },
  foodItemHovered: {
    transform: [{ scale: 1.05 }],
  },
  foodImage: {
    width: 90, // Slightly larger image
    height: 90,
    borderRadius: 18,
    marginRight: 20,
    backgroundColor: '#f9fafb',
    transition: 'transform 0.3s ease',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 20, // Slightly larger product name
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  foodPrice: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 6,
  },
  foodStore: {
    fontSize: 14,
    color: '#64748b',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  pageButton: {
    marginHorizontal: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  pageButtonActive: {
    backgroundColor: '#2563eb',
  },
  pageText: {
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  pageTextActive: {
    color: '#ffffff',
  },
});

export default SearchStyles;
