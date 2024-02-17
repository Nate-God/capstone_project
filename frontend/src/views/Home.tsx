import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container className='home-styles' >
    <div>
      <header>
        <h1>Welcome to Chess Trainer</h1>
      </header>
      <main>
        <section>
          <h2>About Chess Trainer</h2>
          <p>
            Chess Trainer is your go-to platform for improving your chess skills. Whether you are a
            beginner or an experienced player, we have the tools and resources to help you enhance your game.
          </p>
        </section>
        <section>
          <h2>Key Features</h2>
          <ul>
            <li>
              <strong>Chess Puzzles:</strong> Sharpen your tactical skills with a variety of chess puzzles.
            </li>
            <li>
              <strong>Game Analysis:</strong> Coming soon in Version 0.12.
            </li>
            <li>
              <strong>Training Exercises:</strong> Coming soon in Version 0.13.
            </li>
          </ul>
        </section>
        <section>
          <h2>Get Started</h2>
          <p>
            Ready to elevate your chess game? <Link to="/register">Sign up</Link> or <Link to="/login">log in</Link> now!
          </p>
        </section>
      </main>
    </div>
    </Container>
  );
};

export default Home;