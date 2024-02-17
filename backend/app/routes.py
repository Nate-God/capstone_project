from flask import url_for, redirect, request, jsonify
from app import app, db
from flask_bcrypt import Bcrypt
from app.models import User
from flask_login import logout_user
import csv
import random


bcrypt = Bcrypt(app)

@app.route("/register", methods=['GET', 'POST'])
def register():
    if 'Authorization' in request.headers:
        return jsonify({"message": "already logged in"}), 200

    if request.method == 'POST':
        username = request.json.get('username')  
        email = request.json.get('email')
        password = request.json.get('password')
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        user = User(username=username, email=email, highscore=None, password=hashed_password)
        db.session.add(user)
        db.session.commit()

        token = user.get_token()
        return jsonify({"access_token": token}), 200


@app.route("/login", methods=['GET', 'POST'])
def login():
    if 'Authorization' in request.headers:
        return jsonify({"message": "already logged in"}), 200

    if request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')
        user = User.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password, password):
            token = user.get_token()
            return jsonify({"access_token": token}), 200
        else:
            return jsonify({"message": "Incorrect email or password"}), 401
    return jsonify({"message": "Email and password are required"}), 400

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))


@app.route("/check-username/<username>", methods=["GET"])
def check_username(username):
    user = User.query.filter_by(username=username).first()

    if user:
        return jsonify({"exists": True}), 200
    else:
        return jsonify({"exists": False}), 200
    




def get_puzzles_in_range(min_rating, max_rating, num_puzzles):
    print("I got ran")
    print(min_rating, max_rating, num_puzzles)
    puzzles = []
    map_path = r"C:\Users\Notch\Documents\codingTemple\capstone_project\chess-training-app\backend\app\lichess_db_puzzle.csv"
    with open(map_path, 'r') as file:
        print("opne worked")
        reader = csv.DictReader(file)
        for row in reader:
            rating = int(row['Rating'])
            if min_rating <= rating <= max_rating:
                puzzles.append(row)
            if len(puzzles)>=num_puzzles*3:
                return random.sample(puzzles, num_puzzles)
    
    if len(puzzles) <= num_puzzles:
        return puzzles

    return random.sample(puzzles, num_puzzles)


@app.route('/puzzles', methods=['GET', 'POST'])
def puzzles():

    data = request.json

    recieved_auth = request.headers.get('Authorization')
    parts = recieved_auth.split()
    
    if len(parts) != 2 or parts[0] != "Bearer":
                return jsonify({'message': 'Invalid token format'}), 401

    user = User.query.filter_by(token=parts[1]).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    if not user.is_token_valid():
        return jsonify({"error": "Invalid token"}), 401



    print(data)

    min_rating = data.get('min_rating')    
    if min_rating is None:
        return jsonify({'error': 'Minimum rating is required'}), 400

    max_rating = data.get('max_rating', min_rating)
    num_puzzles = data.get('num_puzzles', 10)

    min_rating = int(min_rating)
    max_rating = int(max_rating)
    num_puzzles = int(num_puzzles)
    

    selected_puzzles = get_puzzles_in_range(min_rating, max_rating, num_puzzles)
    
    return jsonify(selected_puzzles)




@app.route('/user', methods=['GET'])
def get_user():
    recieved_auth = request.headers.get('Authorization')
    parts = recieved_auth.split()
    
    if len(parts) != 2 or parts[0] != "Bearer":
        return jsonify({'message': 'Invalid token format'}), 401

    user = User.query.filter_by(token=parts[1]).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    if not user.is_token_valid():
        return jsonify({"error": "Invalid token"}), 401
    
    return jsonify({
        "username": user.username,
        "email": user.email,
        "highscore": user.highscore,
        "created": user.created
    })


@app.route("/editpassword", methods=['POST'])
def edit_password():
    recieved_auth = request.headers.get('Authorization')
    parts = recieved_auth.split()
    
    if len(parts) != 2 or parts[0] != "Bearer":
        return jsonify({'message': 'Invalid token format'}), 401

    user = User.query.filter_by(token=parts[1]).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    if not user.is_token_valid():
        return jsonify({"error": "Invalid token"}), 401

    old_password = request.json.get('oldPassword')
    new_password = request.json.get('newPassword')

    if not bcrypt.check_password_hash(user.password, old_password):
        return jsonify({"error": "Old password is incorrect"}), 400

    hashed_new_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    user.password = hashed_new_password
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200

@app.route("/editemail", methods=['POST'])
def edit_email():
    received_auth = request.headers.get('Authorization')
    parts = received_auth.split()
    
    if len(parts) != 2 or parts[0] != "Bearer":
        return jsonify({'message': 'Invalid token format'}), 401

    user = User.query.filter_by(token=parts[1]).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    if not user.is_token_valid():
        return jsonify({"error": "Invalid token"}), 401

    old_email = request.json.get('oldEmail')
    new_email = request.json.get('newEmail')

    if old_email != user.email:
        return jsonify({"error": "Old email is incorrect"}), 400

    user.email = new_email
    db.session.commit()

    return jsonify({"message": "Email updated successfully"}), 200


@app.route("/deleteuser", methods=['DELETE'])
def delete_user():
    received_auth = request.headers.get('Authorization')
    parts = received_auth.split()
    
    if len(parts) != 2 or parts[0] != "Bearer":
        return jsonify({'message': 'Invalid token format'}), 401

    user = User.query.filter_by(token=parts[1]).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    if not user.is_token_valid():
        return jsonify({"error": "Invalid token"}), 401
    
    password = request.json.get('password')

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect password"}), 401

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200