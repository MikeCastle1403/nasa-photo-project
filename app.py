from flask import Flask, render_template
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    # Pass the NASA API key to the template
    nasa_key = os.getenv('NASA_KEY') or os.getenv('VITE_NASA_KEY') or 'DEMO_KEY'
    return render_template('index.html', nasa_key=nasa_key)

if __name__ == '__main__':
    app.run(debug=True)
