import csv
import random

# Path to the CSV file
file_path = r"C:\Users\Notch\Documents\codingTemple\capstone_project\chess-training-app\backend\app\lichess_db_puzzle.csv"
print(file_path)
# Function to read the CSV file and return puzzles within the specified rating range
def get_puzzles_in_range(min_rating, max_rating, num_puzzles):
    puzzles = []
    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            rating = int(row['Rating'])
            if min_rating <= rating <= max_rating:
                puzzles.append(row)
    
    # If the number of puzzles found is less than the requested number, return all found puzzles
    if len(puzzles) <= num_puzzles:
        return puzzles
    
    # Otherwise, select a random subset of the requested size
    return random.sample(puzzles, num_puzzles)

# Example: Get 50 puzzles with ratings between 1500 and 1800
min_rating = 1500
max_rating = 1800
num_puzzles = 50
selected_puzzles = get_puzzles_in_range(min_rating, max_rating, num_puzzles)

print(f"Selected {len(selected_puzzles)} puzzles within the rating range of {min_rating} to {max_rating}:")
for puzzle in selected_puzzles:
    print(puzzle)